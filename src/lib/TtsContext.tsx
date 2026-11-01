import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useLang } from '../i18n/LangContext';
import { chapterIds } from '../content/chapters';
import { goToChapter } from './router';
import {
  extractChunks,
  isTtsSupported,
  pickVoice,
  readVoices,
  voicesFor,
  waitForSection,
  type Chunk,
} from './tts';

export type TtsStatus =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'unsupported'
  | 'no-voice'
  | 'empty'
  | 'failed';

type Settings = { rate: number; voiceURI: string; autoNext: boolean };

type TtsValue = {
  supported: boolean;
  status: TtsStatus;
  open: boolean;
  chapterId: string | null;
  index: number;
  total: number;
  rate: number;
  autoNext: boolean;
  voices: SpeechSynthesisVoice[];
  voiceURI: string;
  playChapter: (id: string, options?: { ignoreMissingVoice?: boolean }) => void;
  toggle: () => void;
  stop: () => void;
  step: (delta: number) => void;
  playNeighbour: (delta: number) => void;
  setRate: (rate: number) => void;
  setVoiceURI: (uri: string) => void;
  setAutoNext: (on: boolean) => void;
};

const STORAGE_KEY = 'ale:tts';
const DEFAULTS: Settings = { rate: 1, voiceURI: '', autoNext: true };

function readSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

const TtsContext = createContext<TtsValue | null>(null);

export function TtsProvider({ children }: { children: ReactNode }) {
  const { lang } = useLang();
  const supported = useMemo(() => isTtsSupported(), []);
  const [settings, setSettings] = useState<Settings>(readSettings);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => readVoices());
  const [status, setStatus] = useState<TtsStatus>('idle');
  const [chapterId, setChapterId] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(0);

  const chunksRef = useRef<Chunk[]>([]);
  const generationRef = useRef(0);
  const playingRef = useRef(false);
  const activeElRef = useRef<HTMLElement | null>(null);
  const chapterIdRef = useRef<string | null>(null);
  const settingsRef = useRef(settings);
  const langRef = useRef(lang);
  const voicesRef = useRef(voices);
  const statusRef = useRef(status);

  settingsRef.current = settings;
  langRef.current = lang;
  voicesRef.current = voices;
  statusRef.current = status;

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
  }, [settings]);

  useEffect(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    const load = () => setVoices(readVoices());
    load();
    synth.addEventListener?.('voiceschanged', load);
    const timers = [250, 900, 2000].map((delay) => window.setTimeout(load, delay));
    return () => {
      synth.removeEventListener?.('voiceschanged', load);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [supported]);

  // Chrome stops a long utterance after ~15s; nudging the queue keeps it alive.
  useEffect(() => {
    if (!supported) return;
    const id = window.setInterval(() => {
      const synth = window.speechSynthesis;
      if (playingRef.current && synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 9000);
    return () => window.clearInterval(id);
  }, [supported]);

  const clearHighlight = useCallback(() => {
    activeElRef.current?.classList.remove('tts-active');
    activeElRef.current = null;
  }, []);

  const cancelSpeech = useCallback(() => {
    generationRef.current += 1;
    playingRef.current = false;
    if (supported) window.speechSynthesis.cancel();
    clearHighlight();
  }, [clearHighlight, supported]);

  const highlight = useCallback((el: HTMLElement) => {
    if (activeElRef.current === el) return;
    activeElRef.current?.classList.remove('tts-active');
    el.classList.add('tts-active');
    activeElRef.current = el;
    const rect = el.getBoundingClientRect();
    if (rect.top < 96 || rect.bottom > window.innerHeight - 160) {
      el.scrollIntoView({
        block: 'center',
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    }
  }, []);

  const speakFromRef = useRef<(position: number, generation: number) => void>(() => {});
  const playChapterRef = useRef<(id: string, options?: { ignoreMissingVoice?: boolean }) => void>(() => {});

  const speakFrom = useCallback(
    (position: number, generation: number) => {
      const chunks = chunksRef.current;
      const chunk = chunks[position];
      if (!chunk) return;

      const current = settingsRef.current;
      const activeLang = langRef.current;
      const voice = pickVoice(voicesRef.current, activeLang, current.voiceURI || undefined);

      setIndex(position);
      highlight(chunk.el);

      const utterance = new SpeechSynthesisUtterance(chunk.text);
      utterance.lang = activeLang === 'zh' ? 'zh-CN' : 'en-US';
      if (voice) utterance.voice = voice;
      utterance.rate = current.rate;
      utterance.pitch = 1;

      utterance.onend = () => {
        if (generation !== generationRef.current) return;
        const next = position + 1;
        if (next < chunks.length) {
          window.setTimeout(() => {
            if (generation === generationRef.current) speakFromRef.current(next, generation);
          }, 60);
          return;
        }
        playingRef.current = false;
        clearHighlight();
        if (!current.autoNext) {
          setStatus('idle');
          setChapterId(null);
          return;
        }
        const upcoming = chapterIds[chapterIds.indexOf(chapterIdRef.current ?? '') + 1];
        if (upcoming) playChapterRef.current(upcoming);
        else setStatus('idle');
      };

      utterance.onerror = (event) => {
        if (generation !== generationRef.current) return;
        const reason = (event as SpeechSynthesisErrorEvent).error;
        if (reason === 'interrupted' || reason === 'canceled') return;
        playingRef.current = false;
        clearHighlight();
        setStatus('failed');
      };

      playingRef.current = true;
      setStatus('playing');
      window.speechSynthesis.speak(utterance);
    },
    [clearHighlight, highlight],
  );
  speakFromRef.current = speakFrom;

  const playChapter = useCallback(
    async (id: string, options?: { ignoreMissingVoice?: boolean }) => {
      if (!supported) {
        setChapterId(id);
        setStatus('unsupported');
        return;
      }
      cancelSpeech();
      setChapterId(id);
      chapterIdRef.current = id;
      setStatus('loading');

      goToChapter(id);
      const section = await waitForSection(id);
      if (!section) {
        setStatus('empty');
        return;
      }

      const available = readVoices();
      if (available.length) setVoices(available);
      const chunks = extractChunks(section, langRef.current);
      chunksRef.current = chunks;
      setTotal(chunks.length);

      if (chunks.length === 0) {
        setStatus('empty');
        return;
      }
      const hasVoiceForLang =
        available.length === 0 ||
        voicesFor(available, langRef.current).length > 0 ||
        Boolean(settingsRef.current.voiceURI);
      if (!hasVoiceForLang && !options?.ignoreMissingVoice) {
        setStatus('no-voice');
        return;
      }

      speakFrom(0, generationRef.current);
    },
    [cancelSpeech, speakFrom, supported],
  );
  playChapterRef.current = playChapter;

  const toggle = useCallback(() => {
    if (!supported) return;
    const synth = window.speechSynthesis;
    if (status === 'playing') {
      playingRef.current = false;
      synth.pause();
      setStatus('paused');
      return;
    }
    if (status === 'paused') {
      playingRef.current = true;
      synth.resume();
      if (!synth.speaking && !synth.pending) speakFromRef.current(index, generationRef.current);
      setStatus('playing');
      return;
    }
    if (chapterIdRef.current) playChapterRef.current(chapterIdRef.current, { ignoreMissingVoice: true });
  }, [index, status, supported]);

  const stop = useCallback(() => {
    cancelSpeech();
    setChapterId(null);
    chapterIdRef.current = null;
    setStatus('idle');
  }, [cancelSpeech]);

  const step = useCallback(
    (delta: number) => {
      const chunks = chunksRef.current;
      if (!supported || chunks.length === 0) return;
      const target = Math.min(Math.max(index + delta, 0), chunks.length - 1);
      cancelSpeech();
      speakFromRef.current(target, generationRef.current);
    },
    [cancelSpeech, index, supported],
  );

  const playNeighbour = useCallback((delta: number) => {
    const at = chapterIds.indexOf(chapterIdRef.current ?? '');
    const target = at >= 0 ? chapterIds[at + delta] : undefined;
    if (target) playChapterRef.current(target);
  }, []);

  const prevLangRef = useRef(lang);

  useEffect(() => {
    if (prevLangRef.current === lang) return;
    prevLangRef.current = lang;
    // The extracted script belongs to the previous language.
    if (statusRef.current === 'playing' || statusRef.current === 'paused') stop();
  }, [lang, stop]);

  useEffect(() => {
    const onHide = () => {
      if (supported && document.hidden) window.speechSynthesis.cancel();
    };
    window.addEventListener('pagehide', onHide);
    return () => window.removeEventListener('pagehide', onHide);
  }, [supported]);

  const value = useMemo<TtsValue>(
    () => ({
      supported,
      status,
      open: status !== 'idle',
      chapterId,
      index,
      total,
      rate: settings.rate,
      autoNext: settings.autoNext,
      voices,
      voiceURI: settings.voiceURI,
      playChapter: (id, options) => void playChapter(id, options),
      toggle,
      stop,
      step,
      playNeighbour,
      setRate: (rate) => setSettings((prev) => ({ ...prev, rate })),
      setVoiceURI: (voiceURI) => setSettings((prev) => ({ ...prev, voiceURI })),
      setAutoNext: (autoNext) => setSettings((prev) => ({ ...prev, autoNext })),
    }),
    [
      chapterId,
      index,
      playChapter,
      playNeighbour,
      settings,
      status,
      step,
      stop,
      supported,
      toggle,
      total,
      voices,
    ],
  );

  return <TtsContext.Provider value={value}>{children}</TtsContext.Provider>;
}

export function useTts() {
  const ctx = useContext(TtsContext);
  if (!ctx) throw new Error('useTts must be used inside TtsProvider');
  return ctx;
}
