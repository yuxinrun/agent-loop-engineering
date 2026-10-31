import type { ReactNode } from 'react';

type CalloutProps = {
  title?: string;
  tone?: 'info' | 'warn' | 'danger' | 'ok' | 'teal';
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

const toneClass = {
  info: '',
  warn: 'callout-warn',
  danger: 'callout-danger',
  ok: 'callout-ok',
  teal: 'callout-teal',
} as const;

export function Callout({ title, tone = 'info', icon, children, className = '' }: CalloutProps) {
  return (
    <div className={`callout ${toneClass[tone]} ${className}`}>
      {title && (
        <div className="callout-title">
          {icon && <span aria-hidden="true">{icon}</span>}
          <span>{title}</span>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
