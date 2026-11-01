import { useLang } from '../i18n/LangContext';
import { useTts } from '../lib/TtsContext';
import { TocNav } from './TocNav';

export function Sidebar({ activeId }: { activeId: string }) {
  const { t } = useLang();
  const tts = useTts();

  return (
    <aside
      className="sidebar-surface fixed bottom-0 left-0 top-[68px] z-30 hidden w-[306px] flex-col border-r border-[var(--line)] lg:flex"
      style={tts.open ? { paddingBottom: 'calc(var(--player-h, 0px) + 12px)' } : undefined}
      aria-label={t('章节目录', 'Table of contents')}
    >
      <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
        <a
          href="#/"
          className="group flex items-center gap-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[var(--muted)] no-underline transition-colors hover:text-[var(--primary-strong)]"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H4M7.6 4 3.6 8l4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('目录', 'Contents')}
        </a>
        <span className="chip !px-2 !py-0.5 !text-[0.6rem]">{t('14 章', '14 ch')}</span>
      </div>
      <div className="toc-scroll flex-1 overflow-y-auto px-3 py-4">
        <TocNav activeId={activeId} />
      </div>
      <div className="border-t border-[var(--line)] p-3.5">
        <a
          href="#ch13"
          className="card-hover flex items-center gap-2.5 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 no-underline"
        >
          <span className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-strong)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8.4 6.2 11.6 13 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block text-[0.74rem] font-semibold text-[var(--text)]">
              {t('上线前，勾一遍清单', 'Run the checklist')}
            </span>
            <span className="mt-0.5 block text-[0.62rem] text-[var(--muted)]">
              {t('11 项保险丝', '11 safety checks')}
            </span>
          </span>
        </a>
      </div>
    </aside>
  );
}
