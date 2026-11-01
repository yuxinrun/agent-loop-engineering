import { useEffect, useState } from 'react';
import { useT } from '../i18n/LangContext';
import { useTts } from '../lib/TtsContext';

export function BackToTop() {
  const t = useT();
  const tts = useTts();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-[var(--line-strong)] bg-[var(--surface)] text-[var(--primary-strong)] shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-[var(--shadow-hover)] ${
        show ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
      style={tts.open ? { bottom: 'calc(var(--player-h, 0px) + 22px)' } : undefined}
      aria-label={t('回到顶部', 'Back to top')}
      title={t('回到顶部', 'Back to top')}
    >
      <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path d="M10 15.5v-11M5.2 9.3 10 4.5l4.8 4.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
