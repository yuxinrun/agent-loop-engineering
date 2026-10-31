import { useMemo, useState, type ReactNode } from 'react';
import { useT } from '../i18n/LangContext';

type CodeBlockProps = {
  code: string;
  language?: string;
  filename?: string;
  caption?: string;
};

const KEYWORDS = new Set([
  'and', 'as', 'assert', 'async', 'await', 'break', 'case', 'catch', 'class', 'const',
  'continue', 'def', 'default', 'del', 'elif', 'else', 'except', 'export', 'extends',
  'false', 'finally', 'for', 'from', 'function', 'if', 'import', 'in', 'instanceof',
  'interface', 'let', 'new', 'None', 'not', 'null', 'or', 'pass', 'raise', 'return',
  'static', 'super', 'switch', 'this', 'throw', 'true', 'try', 'type', 'typeof', 'var',
  'void', 'while', 'with', 'yield', 'true', 'false', 'undefined', 'readonly', 'satisfies',
]);

const TOKEN_RE =
  /(#.*|\/\/.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*|\s+|[^\s])/g;

function highlightLine(line: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let match: RegExpExecArray | null;
  let index = 0;
  TOKEN_RE.lastIndex = 0;

  while ((match = TOKEN_RE.exec(line))) {
    const text = match[0];
    let cls = '';

    if (text.startsWith('#') || text.startsWith('//')) {
      cls = 'tok-comment';
    } else if (/^["'`]/.test(text)) {
      cls = 'tok-string';
    } else if (/^\d/.test(text)) {
      cls = 'tok-number';
    } else if (/^[A-Za-z_$]/.test(text)) {
      const rest = line.slice(TOKEN_RE.lastIndex);
      if (KEYWORDS.has(text)) cls = 'tok-keyword';
      else if (/^\s*\(/.test(rest)) cls = 'tok-function';
      else if (/^[A-Z]/.test(text)) cls = 'tok-type';
    } else if (/^[{}()[\];:,.<>=+\-*/!&|?]/.test(text)) {
      cls = 'tok-punc';
    }

    nodes.push(
      <span key={`${index}-${text}`} className={cls || undefined}>
        {text}
      </span>,
    );
    index += 1;
  }

  if (nodes.length === 0) nodes.push(<span key="empty"> </span>);
  return nodes;
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export function CodeBlock({ code, language = 'python', filename, caption }: CodeBlockProps) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const lines = useMemo(() => code.replace(/\n$/, '').split('\n'), [code]);
  const rendered = useMemo(() => lines.map((line) => highlightLine(line)), [lines]);

  const onCopy = async () => {
    const ok = await copyText(code);
    if (!ok) return;
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <figure className="my-2 min-w-0">
      <div className="code-shell min-w-0">
        <div className="code-head">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="code-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="code-title">
              {filename || language}
              <span className="ml-2 rounded border border-[#334155] px-1 py-0.5 text-[0.58rem] uppercase tracking-wider text-[#94a3b8]">
                {language}
              </span>
            </span>
          </div>
          <button type="button" className="copy-btn" onClick={onCopy} aria-live="polite">
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M2 6.2 4.6 9 10 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('已复制', 'Copied')}
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <rect x="4" y="4" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
                  <path d="M8 3.2V2.6A1.6 1.6 0 0 0 6.4 1H2.6A1.6 1.6 0 0 0 1 2.6v3.8A1.6 1.6 0 0 0 2.6 8h.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                </svg>
                {t('复制', 'Copy')}
              </>
            )}
          </button>
        </div>
        <div className="code-body">
          <div className="code-lines" aria-hidden="true">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <pre className="code-pre" tabIndex={0} aria-label={filename || language}>
            <code>
              {rendered.map((nodes, i) => (
                <span key={i} className="block min-h-[1.75em]">
                  {nodes}
                </span>
              ))}
            </code>
          </pre>
        </div>
      </div>
      {caption && <figcaption className="figure-caption text-left">{caption}</figcaption>}
    </figure>
  );
}
