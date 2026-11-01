import { useLang } from '../i18n/LangContext';
import { chapters } from '../content/chapters';
import { useTts } from '../lib/TtsContext';

function HeadphonesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.6 10.4V8a5.4 5.4 0 0 1 10.8 0v2.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <rect x="1.2" y="9.4" width="3.2" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11.6" y="9.4" width="3.2" height="5" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function ChapterBar({ id }: { id: string }) {
  const { lang, t } = useLang();
  const tts = useTts();
  const at = chapters.findIndex((chapter) => chapter.id === id);
  const chapter = chapters[at];

  if (!chapter) return null;

  const reading = tts.chapterId === id && (tts.status === 'playing' || tts.status === 'paused');

  return (
    <div className="chapter-bar">
      <a href="#/" className="chapter-bar__back">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M13 8H4M7.6 4 3.6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {t('全部章节', 'All chapters')}
      </a>
      <span className="chapter-bar__title">
        {t(`第 ${chapter.num} 章`, `CH ${chapter.num}`)}
        <span className="chapter-bar__dot" aria-hidden="true" />
        {chapter.short[lang]}
      </span>
      <button
        type="button"
        className={`listen-btn ${reading ? 'is-active' : ''}`}
        onClick={() => tts.playChapter(id)}
        title={tts.supported ? undefined : t('这台设备暂不支持朗读，点一下看说明', 'Read-aloud is unavailable here; click to see why')}
      >
        <HeadphonesIcon />
        <span>
          {reading
            ? t('朗读中', 'Playing')
            : tts.status === 'loading' && tts.chapterId === id
              ? t('准备中', 'Preparing')
              : t('听本章', 'Listen')}
        </span>
      </button>
    </div>
  );
}

export function ChapterPager({ id }: { id: string }) {
  const { lang, t } = useLang();
  const at = chapters.findIndex((chapter) => chapter.id === id);
  const prev = at > 0 ? chapters[at - 1] : undefined;
  const next = at >= 0 && at < chapters.length - 1 ? chapters[at + 1] : undefined;

  if (at < 0) return null;

  return (
    <nav className="chapter-pager" aria-label={t('章节翻页', 'Chapter pager')}>
      {prev ? (
        <a href={`#${prev.id}`} className="pager-card">
          <span className="pager-card__dir">
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H4M7.6 4 3.6 8l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('上一章', 'Previous')}
          </span>
          <span className="pager-card__title">
            {prev.num} · {prev.title[lang]}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a href={`#${next.id}`} className="pager-card pager-card--next">
          <span className="pager-card__dir">
            {t('下一章', 'Next')}
            <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h9M8.4 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="pager-card__title">
            {next.num} · {next.title[lang]}
          </span>
        </a>
      )}
    </nav>
  );
}
