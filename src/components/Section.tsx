import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import { SourceChip } from './SourceChip';
import { useLang } from '../i18n/LangContext';

type SectionProps = {
  id: string;
  num: string;
  title: string;
  kicker?: string;
  sources?: string[];
  children: ReactNode;
};

export function Section({ id, num, title, kicker, sources = [], children }: SectionProps) {
  const { t } = useLang();

  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-[var(--line)] py-14 first:border-t-0 md:py-20"
    >
      <Reveal>
        <div className="mb-7 md:mb-9">
          <div className="mb-3 flex items-center gap-3">
            <span className="chip chip-primary font-mono">
              {t('第', 'CH')} {num}
            </span>
            {kicker && <span className="section-kicker">{kicker}</span>}
          </div>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="space-y-7 md:space-y-8">{children}</div>
        {sources.length > 0 && (
          <div className="mt-9 flex flex-wrap items-center gap-2 border-t border-dashed border-[var(--line)] pt-4">
            <span className="mr-1 text-[0.68rem] font-semibold tracking-wide text-[var(--muted)]">
              {t('📖 来源', '📖 Sources')}
            </span>
            {sources.map((source) => (
              <SourceChip key={source} id={source} />
            ))}
          </div>
        )}
      </Reveal>
    </section>
  );
}
