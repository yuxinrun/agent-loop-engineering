import { useLang } from '../i18n/LangContext';
import { chapters, parts } from '../content/chapters';

type TocNavProps = {
  activeId: string;
  onNavigate?: () => void;
};

export function TocNav({ activeId, onNavigate }: TocNavProps) {
  const { lang } = useLang();

  return (
    <nav aria-label={lang === 'zh' ? '章节导航' : 'Chapter navigation'}>
      {parts.map((part) => (
        <div key={part.label.en} className="mb-4 last:mb-0">
          <div className="mb-1.5 px-2 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
            {part.label[lang]}
          </div>
          <div className="space-y-0.5">
            {part.ids.map((id) => {
              const chapter = chapters.find((item) => item.id === id);
              if (!chapter) return null;
              return (
                <a
                  key={id}
                  href={`#${id}`}
                  className={`nav-link ${activeId === id ? 'active' : ''}`}
                  onClick={onNavigate}
                  aria-current={activeId === id ? 'true' : undefined}
                >
                  <span className="num">{chapter.num}</span>
                  <span>{chapter.short[lang]}</span>
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
