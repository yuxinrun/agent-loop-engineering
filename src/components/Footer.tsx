import { useLang } from '../i18n/LangContext';
import { LogoMark } from './Logo';

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-[var(--line)] pb-20 pt-10 sm:pb-10">
      <div className="flex flex-col gap-5 border-b border-[var(--line)] pb-6 sm:flex-row sm:items-center sm:justify-between">
        <a href="#top" className="group inline-flex items-center gap-3.5 no-underline">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-contrast)] transition-transform duration-500 group-hover:-rotate-6">
            <LogoMark size={30} />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-[0.95rem] font-bold tracking-[0.02em] text-[var(--text)] transition-colors group-hover:text-[var(--primary-strong)]">
              鱼心快跑
            </span>
            <span className="font-mono text-[0.72rem] tracking-[0.02em] text-[var(--muted)]">
              Yuxin Rush, Bugs Gone
            </span>
          </span>
        </a>
        <p className="max-w-[460px] text-[0.72rem] leading-relaxed text-[var(--muted)]">
          {t(
            'Agent Loop Engineering · 一份关于智能体循环工程的实战笔记。引用内容版权归原作者，链接均指向官方或原始页面。',
            'Agent Loop Engineering · Field notes on engineering agent loops. Quoted material belongs to its authors; links point to official or original pages.',
          )}
        </p>
      </div>

      <div className="flex flex-col gap-4 pt-5 text-[0.72rem] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="#ch1" className="transition-colors hover:text-[var(--primary-strong)]">
            {t('开始阅读', 'Start reading')}
          </a>
          <a href="#ch13" className="transition-colors hover:text-[var(--primary-strong)]">
            {t('Checklist', 'Checklist')}
          </a>
          <a href="#ch14" className="transition-colors hover:text-[var(--primary-strong)]">
            {t('来源', 'Sources')}
          </a>
          <a href="#top" className="transition-colors hover:text-[var(--primary-strong)]">
            {t('回到顶部', 'Back to top')}
          </a>
        </div>
        <span className="font-mono text-[0.62rem] tracking-[0.08em] text-[var(--muted)]">
          CONTEXT → ACTION → VERIFY → LOOP
        </span>
      </div>

      <div className="mt-5 border-t border-[var(--line)] pt-4 text-[0.66rem] text-[var(--muted)]">
        © 2026 鱼心快跑 · Yuxin Rush, Bugs Gone · Made with ❤️ by 鱼心
      </div>
    </footer>
  );
}
