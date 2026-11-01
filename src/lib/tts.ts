import type { Lang } from '../i18n/LangContext';

export type Chunk = { text: string; el: HTMLElement };

const SPEAKABLE = 'h2, h3, h4, p, li, figcaption, blockquote';
const UNSPEAKABLE =
  '[data-no-speak], .code-shell, .flip-card, .table-scroll, .data-table, .source-chip, .chip, pre, code, table, svg, nav, button, input, select, textarea';

const MAX_CHUNK = 190;

export function isTtsSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

export function readVoices(): SpeechSynthesisVoice[] {
  if (!isTtsSupported()) return [];
  try {
    return window.speechSynthesis.getVoices();
  } catch {
    return [];
  }
}

export function voiceLocale(voice: SpeechSynthesisVoice) {
  return (voice.lang || '').toLowerCase().replace('_', '-');
}

export function matchesLang(voice: SpeechSynthesisVoice, lang: Lang) {
  const loc = voiceLocale(voice);
  return lang === 'zh' ? loc.startsWith('zh') : loc.startsWith('en');
}

export function voicesFor(voices: SpeechSynthesisVoice[], lang: Lang) {
  return voices.filter((voice) => matchesLang(voice, lang));
}

export function pickVoice(voices: SpeechSynthesisVoice[], lang: Lang, preferredURI?: string) {
  if (preferredURI) {
    const saved = voices.find((voice) => voice.voiceURI === preferredURI);
    if (saved) return saved;
  }
  const candidates = voicesFor(voices, lang);
  if (candidates.length === 0) return undefined;
  const natural = candidates.find((voice) => /natural|neural|premium|enhanced/i.test(voice.name));
  return natural ?? candidates.find((voice) => voice.default) ?? candidates[0];
}

function normalize(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function splitSentences(text: string, lang: Lang): string[] {
  const locale = lang === 'zh' ? 'zh-Hans-CN' : 'en-US';
  const Segmenter = (Intl as unknown as { Segmenter?: new (l: string, o: { granularity: string }) => unknown }).Segmenter;
  let parts: string[] = [];

  if (typeof Segmenter === 'function') {
    const segmenter = new Segmenter(locale, { granularity: 'sentence' }) as {
      segment: (input: string) => Iterable<{ segment: string }>;
    };
    parts = Array.from(segmenter.segment(text), (item) => item.segment.trim()).filter(Boolean);
  } else {
    parts = text
      .split(/(?<=[。！？；])|(?<=[.!?;])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  const merged: string[] = [];
  for (const part of parts) {
    const last = merged[merged.length - 1];
    if (last && (last.length + part.length) < MAX_CHUNK) merged[merged.length - 1] = `${last} ${part}`.trim();
    else merged.push(part);
  }
  return merged;
}

export function extractChunks(root: HTMLElement, lang: Lang): Chunk[] {
  const chunks: Chunk[] = [];
  const nodes = Array.from(root.querySelectorAll<HTMLElement>(SPEAKABLE));

  for (const el of nodes) {
    if (el.closest(UNSPEAKABLE)) continue;
    if (el.querySelector(SPEAKABLE)) continue;
    if ((el.textContent || '').trim().length === 0) continue;

    const text = normalize(el.innerText || el.textContent || '');
    if (text.length < 8) continue;
    if (/^[\d\s.、,，:：;；\-–—/|·%()（）[\]]+$/.test(text)) continue;

    for (const sentence of splitSentences(text, lang)) {
      chunks.push({ text: sentence, el });
    }
  }

  return chunks;
}

export function waitForSection(id: string, timeout = 2500) {
  return new Promise<HTMLElement | null>((resolve) => {
    const startedAt = Date.now();
    const poll = () => {
      const el = document.getElementById(id);
      if (el) {
        resolve(el);
        return;
      }
      if (Date.now() - startedAt > timeout) {
        resolve(null);
        return;
      }
      window.setTimeout(poll, 60);
    };
    poll();
  });
}
