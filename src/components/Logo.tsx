type LogoProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 36, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <path d="M30 6.4A18 18 0 0 1 41.6 18" />
        <path d="M41.6 30A18 18 0 0 1 30 41.6" />
        <path d="M18 41.6A18 18 0 0 1 6.4 30" />
        <path d="M6.4 18A18 18 0 0 1 18 6.4" />
      </g>
      <g stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9">
        <path d="m39.4 12.2-3.4.5.6 3.4" />
        <path d="m35.8 39.4-.5-3.4-3.4.6" />
        <path d="m8.6 35.8 3.4-.5-.6-3.4" />
        <path d="m12.2 8.6.5 3.4 3.4-.6" />
      </g>
      <g fill="currentColor">
        <circle cx="24" cy="5.5" r="2.4" />
        <circle cx="42.5" cy="24" r="2.4" />
        <circle cx="24" cy="42.5" r="2.4" />
        <circle cx="5.5" cy="24" r="2.4" />
      </g>
      <rect x="16.5" y="16.5" width="15" height="15" rx="4.2" stroke="currentColor" strokeWidth="2.1" />
      <path
        d="M20.5 25.4h2.4l1.2-3.4 2.2 6.2 1.3-2.8h2.4"
        stroke="var(--accent)"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoLockup({ compact = false }: { compact?: boolean }) {
  return (
    <a
      href="#top"
      className="group flex items-center gap-2.5 rounded-xl py-1 text-[var(--text)] no-underline"
      aria-label="Agent Loop Engineering — back to top"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[11px] border border-[var(--line)] bg-[var(--surface)] text-[var(--primary)] shadow-[var(--shadow-sm)] transition-colors group-hover:border-[var(--primary)]">
        <LogoMark size={26} />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[0.82rem] font-bold tracking-tight text-[var(--text)]">
            Agent Loop Engineering
          </span>
          <span className="mt-1 block font-mono text-[0.58rem] tracking-[0.12em] text-[var(--muted)]">
            FIELD GUIDE · 14 CHAPTERS
          </span>
        </span>
      )}
    </a>
  );
}
