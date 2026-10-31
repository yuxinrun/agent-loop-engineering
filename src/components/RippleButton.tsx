import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type MouseEvent, type ReactNode } from 'react';

function addRipple(event: MouseEvent<HTMLElement>) {
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const span = document.createElement('span');
  span.className = 'ripple';
  span.style.width = `${size}px`;
  span.style.height = `${size}px`;
  span.style.left = `${event.clientX - rect.left - size / 2}px`;
  span.style.top = `${event.clientY - rect.top - size / 2}px`;
  el.appendChild(span);
  window.setTimeout(() => span.remove(), 650);
}

type Common = {
  children: ReactNode;
  className?: string;
};

export function RippleLink({
  children,
  className = '',
  onClick,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  return (
    <a
      {...rest}
      ref={ref}
      className={className}
      onClick={(event) => {
        addRipple(event);
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}

export function RippleButton({
  children,
  className = '',
  onClick,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={className}
      onClick={(event) => {
        addRipple(event);
        onClick?.(event);
      }}
    >
      {children}
    </button>
  );
}
