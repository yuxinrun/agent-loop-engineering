import { useLang } from '../i18n/LangContext';
import { usePrefersReducedMotion } from '../lib/hooks';
import { RippleLink } from './RippleButton';

function NodeGlyph({ kind }: { kind: 'context' | 'action' | 'verify' | 'loop' }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: '0 0 20 20',
    fill: 'none',
    'aria-hidden': true,
  } as const;
  if (kind === 'context') {
    return (
      <svg {...common}>
        <path d="m3.5 6.2 6.5-3 6.5 3-6.5 3-6.5-3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="m3.5 10 6.5 3 6.5-3M3.5 13.8l6.5 3 6.5-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'action') {
    return (
      <svg {...common}>
        <path d="M11.2 2.5 4.8 11h4.3l-.5 6.5L15.2 9h-4.3l.3-6.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    );
  }
  if (kind === 'verify') {
    return (
      <svg {...common}>
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
        <path d="m6.6 10.2 2.3 2.3 4.6-4.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <path d="M15.7 7.2A6.2 6.2 0 1 0 16 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.9 3.6v3.8h-3.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroLoop() {
  const { t } = useLang();
  const reduced = usePrefersReducedMotion();

  const nodes = [
    { kind: 'context' as const, label: t('上下文', 'Context'), sub: t('收集信息', 'Gather'), left: '50%', top: '0%' },
    { kind: 'action' as const, label: t('行动', 'Action'), sub: t('调用工具', 'Tool call'), left: '100%', top: '50%' },
    { kind: 'verify' as const, label: t('验证', 'Verify'), sub: t('检查结果', 'Check work'), left: '50%', top: '100%' },
    { kind: 'loop' as const, label: t('循环', 'Loop'), sub: t('决定下一步', 'Decide next'), left: '0%', top: '50%' },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[460px] px-12 py-12 sm:px-14 sm:py-14" aria-hidden="true">
      <div className="relative aspect-square w-full">
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
          <circle cx="200" cy="200" r="176" fill="none" stroke="var(--line)" strokeWidth="1" opacity="0.7" />
          <circle
            cx="200"
            cy="200"
            r="150"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.6"
            strokeOpacity="0.42"
            strokeDasharray="3 9"
            strokeLinecap="round"
            className="animate-dash"
          />
          <g fill="var(--primary)" opacity="0.5">
            <path d="m339 141-10-2 4-9Z" />
            <path d="m339 259 4 9-10 2Z" />
            <path d="m61 259 10 2-4 9Z" />
            <path d="m61 141-4-9 10-2Z" />
          </g>
          {!reduced && (
            <g>
              <circle r="13" fill="var(--accent)" opacity="0.12">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M200,50 A150,150 0 1,1 199.9,50"
                />
              </circle>
              <circle r="4.4" fill="var(--accent)">
                <animateMotion
                  dur="4s"
                  repeatCount="indefinite"
                  path="M200,50 A150,150 0 1,1 199.9,50"
                />
              </circle>
            </g>
          )}
        </svg>

        <div className="absolute left-1/2 top-1/2 flex h-[41%] w-[41%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-card)]">
          <span className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-[var(--muted)]">
            Agent Loop
          </span>
          <span className="mt-1.5 font-mono text-[0.72rem] font-semibold text-[var(--primary-strong)] sm:text-[0.8rem]">
            while (not done)
          </span>
          <span className="mt-1 text-[0.56rem] text-[var(--muted)]">
            {t('思考 → 行动 → 观察', 'think → act → observe')}
          </span>
        </div>

        {nodes.map((node, index) => (
          <div
            key={node.kind}
            className="absolute z-10"
            style={{ left: node.left, top: node.top, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="animate-breathe flex w-[106px] flex-col items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-2 py-2.5 text-center shadow-[var(--shadow-card)]"
              style={{ animationDelay: `${index * 1}s` }}
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-strong)]">
                <NodeGlyph kind={node.kind} />
              </span>
              <span className="text-[0.7rem] font-bold leading-tight text-[var(--text)]">{node.label}</span>
              <span className="text-[0.55rem] leading-tight text-[var(--muted)]">{node.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const { lang, t } = useLang();

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="hero-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative flex min-h-[calc(100vh-68px)] flex-col justify-center py-16 md:py-20 lg:min-h-[720px]">
        <div className="grid items-center gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:gap-6">
          <div className="max-w-[640px]">
            <div className="mb-5 flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--primary-strong)]">
                Field guide · 2026
              </span>
              <span className="h-1 w-1 rounded-full bg-[var(--line-strong)]" aria-hidden="true" />
              <span className="chip">{t('14 章 · 可交互', '14 chapters · interactive')}</span>
            </div>

            <h1 className="hero-title text-[var(--text)]">
              Agent{' '}
              <span className="text-[var(--primary)]">Loop</span>
              <br />
              {' '}Engineering
            </h1>

            <p className="mt-6 max-w-[580px] text-[1.16rem] font-semibold leading-[1.5] tracking-[-0.015em] text-[var(--text-soft)] md:text-[1.35rem]">
              {lang === 'zh' ? (
                <>
                  让你的 AI Agent
                  <br className="sm:hidden" />
                  会干活、会刹车、不烧钱。
                </>
              ) : (
                'Make your AI Agent work, stop, and not burn money.'
              )}
            </p>

            <p className="mt-4 max-w-[600px] text-[0.94rem] leading-[1.8] text-[var(--muted)] text-pretty md:text-[1rem]">
              {t(
                '不是写一个 prompt 就叫 Agent——真正的工程，在那个「思考 → 行动 → 观察 → 再来一次」的循环里。14 章，从世界观到停止条件、上下文、工具、HITL、可观测性与成本，最后落到一份能勾的 Checklist。',
                'Writing a prompt does not make an agent. The real engineering lives inside the loop: think → act → observe → go again. Fourteen chapters take you from first principles to stopping rules, context, tools, HITL, observability and cost — ending in a checklist you can actually run.',
              )}
            </p>

            <div className="mt-8 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center">
              <RippleLink href="#ch1" className="btn btn-primary">
                {t('从第一章开始', 'Start at chapter 1')}
                <span aria-hidden="true">→</span>
              </RippleLink>
              <RippleLink href="#ch13" className="btn btn-ghost">
                {t('直接跳到 Checklist', 'Jump to the checklist')}
              </RippleLink>
              <a
                href="#ch14"
                className="inline-flex items-center gap-1.5 px-2 py-2 text-[0.82rem] font-semibold text-[var(--muted)] no-underline transition-colors hover:text-[var(--primary-strong)]"
              >
                {t('延伸阅读', 'Further reading')}
                <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.7rem] text-[var(--muted)]">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                {t('14 章 · 约 45 分钟', '14 chapters · ~45 min')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--teal)]" />
                {t('图表 · 代码 · Checklist', 'Diagrams · code · checklist')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
                {t('中 / EN 双语', 'Bilingual 中 / EN')}
              </span>
            </div>

            <div className="mt-9 inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-[0.62rem] font-medium text-[var(--muted)] opacity-75">
              <span className="h-1 w-1 rounded-full bg-[var(--primary)]" />
              鱼心快跑 · Yuxin Rush
            </div>
          </div>

          <div className="animate-float">
            <HeroLoop />
            <p className="mt-1 text-center font-mono text-[0.62rem] tracking-[0.12em] text-[var(--muted)]">
              CONTEXT → ACTION → VERIFY → LOOP
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
