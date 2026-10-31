import { useEffect, useState } from 'react';
import { useLang } from '../i18n/LangContext';
import { useTheme } from '../lib/hooks';
import { LogoLockup, LogoMark } from './Logo';
import { TocNav } from './TocNav';

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.4" stroke="currentColor" strokeWidth="1.5" />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M10 1.8v2M10 16.2v2M1.8 10h2M16.2 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M15.8 4.2l-1.4 1.4M5.6 14.4l-1.4 1.4" />
      </g>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M16.4 12.3A6.8 6.8 0 0 1 7.7 3.6a6.8 6.8 0 1 0 8.7 8.7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLang();
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? t('切换到白天模式', 'Switch to light mode') : t('切换到黑夜模式', 'Switch to dark mode')}
      title={theme === 'dark' ? t('白天模式', 'Light mode') : t('黑夜模式', 'Dark mode')}
    >
      <span key={theme} className="theme-icon flex">
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}

function LangToggle() {
  const { lang, setLang, t } = useLang();
  return (
    <div
      className="flex items-center gap-0.5 rounded-full border border-[var(--line)] p-0.5"
      aria-label={t('切换语言', 'Switch language')}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="ml-1 text-[var(--muted)] transition-transform duration-300"
        style={{ transform: lang === 'en' ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M2.5 9h13M9 2.5c2 2 2 11 0 13M9 2.5c-2 2-2 11 0 13" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      <button
        type="button"
        onClick={() => setLang('zh')}
        aria-pressed={lang === 'zh'}
        className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold transition-colors ${
          lang === 'zh'
            ? 'bg-[var(--primary-soft)] text-[var(--primary-strong)]'
            : 'text-[var(--muted)] hover:text-[var(--text)]'
        }`}
      >
        中
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`rounded-full px-2.5 py-1 text-[0.68rem] font-bold transition-colors ${
          lang === 'en'
            ? 'bg-[var(--primary-soft)] text-[var(--primary-strong)]'
            : 'text-[var(--muted)] hover:text-[var(--text)]'
        }`}
      >
        EN
      </button>
    </div>
  );
}

export function Navbar({ activeId }: { activeId: string }) {
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <header className="nav-surface fixed inset-x-0 top-0 z-50 border-b border-[var(--line)]">
        <div className="mx-auto flex h-[68px] max-w-[1600px] items-center justify-between gap-3 px-5 sm:px-7">
          <LogoLockup />
          <div className="flex items-center gap-2">
            <a
              href="#ch13"
              className="hidden items-center gap-1.5 rounded-full border border-[var(--line)] px-3.5 py-2 text-[0.72rem] font-semibold text-[var(--text-soft)] no-underline transition-colors hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary-strong)] md:flex"
            >
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8.4 6.2 11.6 13 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('Checklist', 'Checklist')}
            </a>
            <LangToggle />
            <ThemeToggle />
            <button
              type="button"
              className="icon-btn no-rotate lg:hidden"
              onClick={() => setOpen(true)}
              aria-label={t('打开章节目录', 'Open chapter menu')}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 5.5h14M3 10h14M3 14.5h14" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label={t('章节目录', 'Chapter menu')}>
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/45 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label={t('关闭目录', 'Close menu')}
          />
          <div id="mobile-menu" className="drawer-slide absolute inset-y-0 left-0 flex w-[86%] max-w-[350px] flex-col border-r border-[var(--line)] bg-[var(--bg)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[var(--primary)] text-[var(--primary-contrast)]">
                  <LogoMark size={23} />
                </span>
                <span className="text-xs font-bold">Agent Loop Engineering</span>
              </div>
              <button
                type="button"
                className="icon-btn no-rotate !h-8 !w-8"
                onClick={() => setOpen(false)}
                aria-label={t('关闭目录', 'Close menu')}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="toc-scroll flex-1 overflow-y-auto px-3 py-4">
              <TocNav activeId={activeId} onNavigate={() => setOpen(false)} />
            </div>
            <div className="border-t border-[var(--line)] px-4 py-3 text-[0.68rem] text-[var(--muted)]">
              {t('从第 1 章开始，大约 45 分钟读完。', 'About 45 minutes, start to finish.')}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
