import { useLang } from '../i18n/LangContext';
import { chapters, parts } from '../content/chapters';
import { useTts } from '../lib/TtsContext';
import { Reveal } from './Reveal';

function HeadphonesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.6 10.4V8a5.4 5.4 0 0 1 10.8 0v2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="1.2" y="9.4" width="3.2" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11.6" y="9.4" width="3.2" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ChapterGrid() {
  const { lang, t } = useLang();
  const tts = useTts();

  return (
    <section className="container-x pb-16 pt-4" aria-labelledby="chapter-grid-title">
      <Reveal>
        <div className="mb-7 flex flex-wrap items-end justify-between gap-3 border-b border-[var(--line)] pb-4">
          <div>
            <div className="section-kicker mb-2">{t('全书目录', 'Contents')}</div>
            <h2 id="chapter-grid-title" className="section-title">
              {t('14 章，四个篇章', '14 chapters, four parts')}
            </h2>
          </div>
          <p className="max-w-[420px] text-[0.82rem] leading-relaxed text-[var(--muted)]">
            {t(
              '点卡片进入章节阅读；卡片右下角的耳机按钮可以直接开始听这一章。',
              'Open a card to read it, or hit the headphone button to listen instead.',
            )}
          </p>
        </div>
      </Reveal>

      {parts.map((part, partIndex) => (
        <div key={part.label.en} className="mb-9 last:mb-0">
          <Reveal delay={partIndex * 40}>
            <div className="mb-3.5 flex items-center gap-3">
              <span className="font-mono text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[var(--primary-strong)]">
                {String(partIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-[0.92rem] font-bold text-[var(--text)]">{part.label[lang]}</span>
              <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
            </div>
          </Reveal>

          <div className="grid gap-3.5 sm:grid-cols-2">
            {part.ids.map((id, index) => {
              const chapter = chapters.find((item) => item.id === id);
              if (!chapter) return null;
              const listening = tts.chapterId === id && tts.status !== 'idle';
              const wide = part.ids.length % 2 === 1 && index === part.ids.length - 1;
              return (
                <Reveal key={id} delay={index * 40} className={wide ? 'sm:col-span-2' : undefined}>
                  <article className="card chapter-card">
                    <a href={`#${id}`} className="chapter-card__link">
                      <span className="chapter-card__num">{chapter.num}</span>
                      <h3 className="chapter-card__title">{chapter.title[lang]}</h3>
                    </a>
                    <p className="chapter-card__summary">{chapter.summary[lang]}</p>
                    <div className="chapter-card__foot">
                      <span className="chapter-card__go">
                        {t('开始阅读', 'Read')}
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="M3 8h9M8.4 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      <button
                        type="button"
                        className={`listen-btn ${listening ? 'is-active' : ''}`}
                        onClick={() => tts.playChapter(id)}
                        aria-label={t(`听第 ${chapter.num} 章`, `Listen to chapter ${chapter.num}`)}
                        title={tts.supported ? t('听本章', 'Listen to this chapter') : t('这台设备暂不支持朗读', 'Read-aloud unavailable here')}
                      >
                        <HeadphonesIcon />
                        <span>{t('听', 'Listen')}</span>
                      </button>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
