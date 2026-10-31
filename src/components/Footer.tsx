import { useLang } from '../i18n/LangContext';
import { LogoMark } from './Logo';

export function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-[var(--line)] py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <a href="#top" className="flex items-center gap-2.5 text-[var(--text)] no-underline">
            <span className="flex h-8 w-8 items-center justify-center rounded-[10px] border border-[var(--line)] bg-[var(--surface)] text-[var(--primary)]">
              <LogoMark size={22} />
            </span>
            <span className="text-[0.78rem] font-bold">Agent Loop Engineering</span>
          </a>
          <p className="mt-2 max-w-[420px] text-[0.7rem] leading-relaxed text-[var(--muted)]">
            {t(
              '一份关于智能体循环工程的实战笔记。引用内容版权归原作者，链接均指向官方或原始页面。',
              'Field notes on engineering agent loops. Quoted material belongs to its authors; links point to official or original pages.',
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-[0.72rem] text-[var(--muted)]">
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
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-[var(--line)] pt-5 text-[0.66rem] text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <span> © 2026 鱼心快跑 · Yuxin Rush, Bugs Gone · Made with ❤️ by 鱼心</span>
        <span className="font-mono text-[0.6rem] tracking-wide opacity-70">
          CONTEXT → ACTION → VERIFY → LOOP
        </span>
      </div>
    </footer>
  );
}
