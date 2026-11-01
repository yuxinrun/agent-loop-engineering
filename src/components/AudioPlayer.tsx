import { useEffect, useRef } from 'react';
import { useLang } from '../i18n/LangContext';
import { chapters } from '../content/chapters';
import { useTts } from '../lib/TtsContext';
import { voicesFor } from '../lib/tts';

function IconPlay() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M5 3.4v9.2L13 8 5 3.4Z" fill="currentColor" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="4.4" y="3.4" width="2.6" height="9.2" rx="1" fill="currentColor" />
      <rect x="9" y="3.4" width="2.6" height="9.2" rx="1" fill="currentColor" />
    </svg>
  );
}

function IconSkip({ back = false }: { back?: boolean }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={back ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 3.6 9.6 8 4 12.4V3.6Z" fill="currentColor" />
      <rect x="10.8" y="3.6" width="1.8" height="8.8" rx="0.9" fill="currentColor" />
    </svg>
  );
}

function IconChapter({ back = false }: { back?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={back ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="m4.5 4.5 7 7M11.5 4.5l-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function platformHint(t: (zh: string, en: string) => string) {
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent;
  if (/iPhone|iPad|iOS/.test(ua) || (/Mac/.test(ua) && 'ontouchend' in window)) {
    return t(
      'iPhone / iPad：设置 → 辅助功能 → 朗读内容与声音 → 自定义语音，添加「中文」语音后再回来。',
      'iPhone / iPad: Settings → Accessibility → Spoken Content → Voices, add a Chinese voice, then reload.',
    );
  }
  if (/Android/.test(ua)) {
    return t(
      '安卓：在应用商店安装并启用「Google 文字转语音引擎」，然后在系统设置 → 语言和输入法 → 文字转语音里选好中文。',
      'Android: install and enable Google Text-to-Speech, then pick a Chinese voice in System settings → Languages → Text-to-speech.',
    );
  }
  if (/Win/.test(ua)) {
    return t(
      'Windows：设置 → 时间和语言 → 语音 → 添加语音（中文 或 English），装完刷新本页。',
      'Windows: Settings → Time & Language → Speech → Add a voice (中文 or English), then reload this page.',
    );
  }
  if (/Mac/.test(ua)) {
    return t(
      'macOS：系统设置 → 辅助功能 → 朗读内容与声音 → 系统语音，添加中文语音后刷新。',
      'macOS: System Settings → Accessibility → Spoken Content → System Voice, add a Chinese voice and reload.',
    );
  }
  return t(
    '请在系统设置里安装中文或英文语音包，或用最新版 Chrome / Edge / Safari 打开本站。',
    'Install a Chinese or English system voice, or open this site in the latest Chrome / Edge / Safari.',
  );
}

export function AudioPlayer() {
  const tts = useTts();
  const { lang, setLang, t } = useLang();
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const apply = () => document.documentElement.style.setProperty('--player-h', `${el.offsetHeight}px`);
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.documentElement.style.setProperty('--player-h', '0px');
    };
  }, [tts.open, tts.status]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !tts.open) return;
      const target = event.target as HTMLElement | null;
      if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return;
      tts.stop();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tts]);

  if (!tts.open) return null;

  const meta = chapters.find((chapter) => chapter.id === tts.chapterId);
  const label = meta ? `${t(`第 ${meta.num} 章`, `CH ${meta.num}`)} · ${meta.short[lang]}` : t('听书', 'Audiobook');
  const chapterVoices = voicesFor(tts.voices, lang);
  const progress = tts.total > 0 ? Math.round(((tts.index + 1) / tts.total) * 100) : 0;
  const atFirstChapter = !meta || chapters[0].id === meta.id;
  const atLastChapter = !meta || chapters[chapters.length - 1].id === meta.id;
  const notice =
    tts.status === 'unsupported'
      ? {
          title: t('这台设备暂时不能朗读', 'This device cannot read aloud yet'),
          body: t(
            '当前浏览器没有提供语音合成能力（Web Speech API）。',
            'This browser does not expose the Web Speech API used for read-aloud.',
          ),
          hint: platformHint(t),
        }
      : tts.status === 'no-voice'
        ? {
            title: t(`系统里没有${lang === 'zh' ? '中文' : '英文'}语音包`, `No ${lang === 'zh' ? 'Chinese' : 'English'} voice installed`),
            body: t(
              '浏览器支持朗读，但本机缺少对应语言的语音，硬读会变成乱码式的发音。',
              'Read-aloud works, but this device has no matching voice, so it would mispronounce everything.',
            ),
            hint: platformHint(t),
          }
        : tts.status === 'empty'
          ? {
              title: t('这一章没有可朗读的正文', 'Nothing to read in this chapter'),
              body: t('本章几乎全是图表、代码和清单，换成文字版章节再听效果更好。', 'This chapter is mostly charts and code.'),
              hint: '',
            }
          : tts.status === 'failed'
            ? {
                title: t('朗读被系统中断了', 'Playback was interrupted'),
                body: t('有些浏览器会因切换标签页或锁屏停止语音。', 'Browsers stop speech when the tab is hidden or the screen locks.'),
                hint: t('点「继续」可以从当前段落重试。', 'Press resume to retry from the current paragraph.'),
              }
            : null;

  return (
    <div ref={barRef} className="player-bar" role="region" aria-label={t('听书播放器', 'Audiobook player')}>
      <div className="player-inner">
        {tts.status === 'loading' && (
          <div className="flex items-center gap-2.5 text-[0.8rem] text-[var(--text-soft)]">
            <span className="player-spinner" aria-hidden="true" />
            {t('正在准备朗读…', 'Preparing the narration…')}
          </div>
        )}

        {notice && (
          <div className="player-notice">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[0.86rem] font-bold text-[var(--text)]">{notice.title}</div>
                <p className="mt-1 text-[0.76rem] leading-relaxed text-[var(--text-soft)]">{notice.body}</p>
                {notice.hint && (
                  <p className="mt-1.5 rounded-lg bg-[var(--surface-2)] px-2.5 py-1.5 text-[0.72rem] leading-relaxed text-[var(--muted)]">
                    {notice.hint}
                  </p>
                )}
              </div>
              <button type="button" className="icon-btn no-rotate !h-8 !w-8 flex-none" onClick={tts.stop} aria-label={t('关闭提示', 'Dismiss')}>
                <IconClose />
              </button>
            </div>
            {tts.status === 'no-voice' && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button type="button" className="btn btn-primary !py-1.5 !text-[0.74rem]" onClick={() => tts.playChapter(tts.chapterId!, { ignoreMissingVoice: true })}>
                  {t('用现有音色继续', 'Use the available voice')}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost !py-1.5 !text-[0.74rem]"
                  onClick={() => {
                    const next = lang === 'zh' ? 'en' : 'zh';
                    const id = tts.chapterId;
                    setLang(next);
                    window.setTimeout(() => {
                      if (id) tts.playChapter(id, { ignoreMissingVoice: true });
                    }, 220);
                  }}
                >
                  {t(`改用${lang === 'zh' ? '英文' : '中文'}朗读`, `Switch to ${lang === 'zh' ? 'English' : 'Chinese'}`)}
                </button>
              </div>
            )}
            {tts.status === 'failed' && (
              <button type="button" className="btn btn-primary mt-2.5 !py-1.5 !text-[0.74rem]" onClick={tts.toggle}>
                {t('继续朗读', 'Resume')}
              </button>
            )}
          </div>
        )}

        {!notice && tts.status !== 'loading' && (
          <>
            <div className="player-meta">
              <div className="flex min-w-0 items-center gap-2">
                <span className="truncate text-[0.8rem] font-bold text-[var(--text)]">{label}</span>
                <span className="player-state" aria-live="polite">
                  {tts.status === 'playing' ? t('朗读中', 'Playing') : t('已暂停', 'Paused')}
                </span>
              </div>
              <div className="mt-1.5 flex items-center gap-2">
                <span className="player-track" aria-hidden="true">
                  <i style={{ width: `${progress}%` }} />
                </span>
                <span className="font-mono text-[0.62rem] text-[var(--muted)]">
                  {tts.index + 1}/{tts.total}
                </span>
              </div>
            </div>

            <div className="player-controls">
              <button type="button" className="icon-btn no-rotate !h-8 !w-8" onClick={() => tts.playNeighbour(-1)} disabled={atFirstChapter} aria-label={t('朗读上一章', 'Play previous chapter')}>
                <IconChapter back />
              </button>
              <button type="button" className="icon-btn no-rotate" onClick={() => tts.step(-1)} aria-label={t('上一段', 'Previous paragraph')}>
                <IconSkip back />
              </button>
              <button type="button" className="player-play" onClick={tts.toggle} aria-label={tts.status === 'playing' ? t('暂停', 'Pause') : t('继续', 'Play')}>
                {tts.status === 'playing' ? <IconPause /> : <IconPlay />}
              </button>
              <button type="button" className="icon-btn no-rotate" onClick={() => tts.step(1)} aria-label={t('下一段', 'Next paragraph')}>
                <IconSkip />
              </button>
              <button type="button" className="icon-btn no-rotate !h-8 !w-8" onClick={() => tts.playNeighbour(1)} disabled={atLastChapter} aria-label={t('朗读下一章', 'Play next chapter')}>
                <IconChapter />
              </button>
            </div>

            <div className="player-options">
              <label className="player-field">
                <span className="sr-only">{t('语速', 'Speed')}</span>
                <select value={String(tts.rate)} onChange={(e) => tts.setRate(Number(e.target.value))} aria-label={t('朗读语速', 'Reading speed')}>
                  {[0.75, 1, 1.25, 1.5, 1.75].map((rate) => (
                    <option key={rate} value={String(rate)}>
                      {rate === 1 ? t('正常语速', 'Normal') : `${rate}×`}
                    </option>
                  ))}
                </select>
              </label>

              {chapterVoices.length > 1 && (
                <label className="player-field player-field--voice">
                  <span className="sr-only">{t('音色', 'Voice')}</span>
                  <select
                    value={tts.voiceURI}
                    onChange={(e) => {
                      tts.setVoiceURI(e.target.value);
                      if (tts.chapterId) tts.playChapter(tts.chapterId);
                    }}
                    aria-label={t('选择音色', 'Choose voice')}
                  >
                    <option value="">{t('系统默认音色', 'System default')}</option>
                    {chapterVoices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              <label className="player-switch" title={t('听完本章自动接着读下一章', 'Automatically continue with the next chapter')}>
                <input type="checkbox" checked={tts.autoNext} onChange={(e) => tts.setAutoNext(e.target.checked)} />
                <span className="player-switch__track" aria-hidden="true" />
                <span className="player-switch__label">{t('自动联播', 'Auto-play next')}</span>
              </label>

              <button type="button" className="icon-btn no-rotate !h-8 !w-8" onClick={tts.stop} aria-label={t('停止朗读', 'Stop reading')}>
                <IconClose />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
