import { useLang } from '../i18n/LangContext';
import { sourceById } from '../content/sources';

type SourceChipProps = {
  id: string;
  compact?: boolean;
};

export function SourceChip({ id, compact = false }: SourceChipProps) {
  const { lang, t } = useLang();
  const source = sourceById(id);
  if (!source) return null;

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="source-chip"
      title={source.note[lang]}
      aria-label={`${t('来源', 'Source')}: ${source.title[lang]}`}
    >
      <span aria-hidden="true">📖</span>
      <span>
        {compact ? source.org : `${source.org} · ${source.title[lang]}`}
      </span>
      <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path
          d="M3 9L9 3M9 3H4.5M9 3V7.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
