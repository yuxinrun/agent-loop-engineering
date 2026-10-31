import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Section } from '../components/Section';
import { useLang } from '../i18n/LangContext';
import { useLocalStorage, usePrefersReducedMotion } from '../lib/hooks';

const items = [
  {
    key: 'stop',
    title: { zh: '三层停止条件齐全', en: 'All three stop layers exist' },
    detail: {
      zh: '显式完成信号、隐式结束、兜底上限，至少各有一条。',
      en: 'An explicit finish signal, an implicit end, and a safety cap — at least one of each.',
    },
    proof: { zh: '证据：finish 工具 + maxIterations', en: 'Proof: a finish tool + maxIterations' },
  },
  {
    key: 'fuses',
    title: { zh: '四道保险丝已接上', en: 'All four fuses are wired' },
    detail: {
      zh: 'maxIterations、maxTokens、maxWallClockMs、AbortSignal 都传到了实际调用里。',
      en: 'maxIterations, maxTokens, maxWallClockMs and AbortSignal all reach the actual calls.',
    },
    proof: { zh: '证据：预算对象被传入模型与工具', en: 'Proof: the budget object is passed into models and tools' },
  },
  {
    key: 'stall',
    title: { zh: '有停滞检测', en: 'Stall detection exists' },
    detail: {
      zh: '对 tool + args 做规范化哈希，连续 3 次相同就停或换策略。',
      en: 'Canonical hash of tool + args; three consecutive matches stop or change strategy.',
    },
    proof: { zh: '证据：日志里能看到 fingerprint', en: 'Proof: fingerprints are visible in logs' },
  },
  {
    key: 'schema',
    title: { zh: '工具 schema 严格、错误可读', en: 'Strict tool schemas, readable errors' },
    detail: {
      zh: '参数有类型与范围校验；错误返回 code、retryable、hint。',
      en: 'Parameters have type and range validation; errors return code, retryable and hint.',
    },
    proof: { zh: '证据：非法参数被挡在业务逻辑外', en: 'Proof: invalid arguments are rejected before business logic' },
  },
  {
    key: 'hitl',
    title: { zh: '高风险动作有人工闸门', en: 'A human gate on high-risk actions' },
    detail: {
      zh: '付款、删除、外发、发布等动作，需要审批或明确的策略放行。',
      en: 'Payments, deletes, external sends and releases need approval or an explicit policy.',
    },
    proof: { zh: '证据：审批日志含操作者与时间', en: 'Proof: approval logs include actor and time' },
  },
  {
    key: 'idempotent',
    title: { zh: '副作用幂等', en: 'Side effects are idempotent' },
    detail: {
      zh: '同一个事件重投三次，不会发三封邮件、扣三次款。',
      en: 'Deliver the same event three times; no three emails and no three charges.',
    },
    proof: { zh: '证据：幂等键覆盖所有写操作', en: 'Proof: idempotency keys cover every write' },
  },
  {
    key: 'context',
    title: { zh: '上下文有治理策略', en: 'Context has a governance strategy' },
    detail: {
      zh: '有裁剪或摘要阈值；重要状态落在文件、数据库或工单里。',
      en: 'There are prune/summarize thresholds; important state lives in files, databases or tickets.',
    },
    proof: { zh: '证据：长任务不会无限膨胀', en: 'Proof: long tasks do not grow without bound' },
  },
  {
    key: 'trace',
    title: { zh: '有 trace 和决策日志', en: 'Traces and decision logs exist' },
    detail: {
      zh: '每个 span 记录轮次、提示词版本、工具哈希、token、停止原因。',
      en: 'Each span records turn, prompt version, tool hashes, tokens and stop reason.',
    },
    proof: { zh: '证据：能从一次失败还原因果链', en: 'Proof: a failure can be traced back through a causal chain' },
  },
  {
    key: 'behavior',
    title: { zh: '有行为级验收测试', en: 'Behavior-level acceptance tests exist' },
    detail: {
      zh: '不只测函数，还测「用户想要的结果」，并保留独立验证者。',
      en: 'Test not just functions but the outcome the user wanted; keep an independent verifier.',
    },
    proof: { zh: '证据：验收用例来自真实需求', en: 'Proof: acceptance cases come from real requirements' },
  },
  {
    key: 'tiering',
    title: { zh: '模型分层且成本可归因', en: 'Model tiering and attributable cost' },
    detail: {
      zh: '路由、规划、执行、验证用不同层级；成本能按任务与轮次拆开。',
      en: 'Routing, planning, execution and verification use different tiers; cost is split by task and turn.',
    },
    proof: { zh: '证据：账单能回答「谁花的」', en: 'Proof: the bill answers “who spent it”' },
  },
  {
    key: 'recover',
    title: { zh: '失败可诊断、可回滚', en: 'Failures are diagnosable and reversible' },
    detail: {
      zh: '截断时返回中间状态；每个危险步骤前有 checkpoint。',
      en: 'Truncation returns an intermediate state; every risky step has a checkpoint.',
    },
    proof: { zh: '证据：回滚演练真的跑过', en: 'Proof: a rollback drill actually ran' },
  },
];

function Confetti({ burst }: { burst: number }) {
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const pieces = useRef(
    Array.from({ length: 64 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 3.4 + Math.random() * 2.2,
      rotate: Math.random() * 720 - 360,
      color: ['#0ea5e9', '#f97316', '#0d9488', '#fbbf24', '#f87171', '#38bdf8'][i % 6],
      width: 5 + Math.random() * 5,
      height: 9 + Math.random() * 8,
    })),
  ).current;

  useEffect(() => {
    if (burst === 0 || reduced) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 6500);
    return () => window.clearTimeout(timeout);
  }, [burst, reduced]);

  if (!visible) return null;

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden="true">
      {pieces.map((piece, index) => (
        <span
          key={`${burst}-${index}`}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            background: piece.color,
            width: piece.width,
            height: piece.height,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            rotate: `${piece.rotate}deg`,
          }}
        />
      ))}
    </div>,
    document.body,
  );
}

export function Chapter13() {
  const { lang } = useLang();
  const reduced = usePrefersReducedMotion();
  const [checked, setChecked] = useLocalStorage<Record<string, boolean>>('ale:checklist', {});
  const [burst, setBurst] = useState(0);
  const [celebrate, setCelebrate] = useState(false);
  const prevCount = useRef<number | null>(null);

  const count = items.filter((item) => checked[item.key]).length;
  const total = items.length;
  const percent = Math.round((count / total) * 100);
  const allDone = count === total;

  useEffect(() => {
    if (prevCount.current === null) {
      prevCount.current = count;
      return;
    }
    if (count === total && prevCount.current < total) {
      setBurst((value) => value + 1);
      setCelebrate(true);
    }
    if (count < total) setCelebrate(false);
    prevCount.current = count;
  }, [count, total]);

  const c = {
    zh: {
      kicker: 'SHIP IT',
      title: '落地 Checklist',
      p1: '这一章没有新概念，只有一张出门前的清单。它不保证你的 Agent 一定聪明，但能保证它不会以最蠢的方式把预算烧光。',
      p2: '勾选状态会保存在本地浏览器，下次回来还在。全部勾完，会有一点小小的庆祝。',
      progress: '完成度',
      reset: '重置清单',
      done: '已完成',
      pending: '待办',
      celebrate: '🎉 恭喜，你的 Agent 已经比 80% 的线上 Demo 健壮了。',
      celebrateSub: '现在可以上线跑一小批真实流量了——记得继续看 trace。',
      hint: '凭直觉勾选不算数。每一项最好能指出对应的代码、配置或日志证据。',
      checkAll: '全部勾选',
    },
    en: {
      kicker: 'SHIP IT',
      title: 'Shipping checklist',
      p1: 'No new concepts here, only a pre-flight list. It will not guarantee your agent is smart, but it will keep it from burning the budget in the dumbest possible way.',
      p2: 'Checks are saved in your browser and will still be here next time. Tick everything and there is a small celebration.',
      progress: 'Progress',
      reset: 'Reset checklist',
      done: 'Done',
      pending: 'To do',
      celebrate: '🎉 Congrats — your agent is now sturdier than 80% of online demos.',
      celebrateSub: 'You can send a small slice of real traffic now. Keep watching the traces.',
      hint: 'Gut feeling does not count. Every item should point to code, config or log evidence.',
      checkAll: 'Check all',
    },
  }[lang];

  return (
    <Section id="ch13" num="13" title={c.title} kicker={c.kicker} sources={['anthropic-agents', 'openai-guide', 'aws-agentcore-blog']}>
      <Confetti burst={burst} />

      <div className="prose-block">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
      </div>

      <div className="card overflow-hidden">
        <div className="border-b border-[var(--line)] bg-[var(--surface-2)] p-4">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[0.82rem] font-bold text-[var(--text)]">
              {c.progress} · {count} / {total}
            </span>
            <span className="font-mono text-[0.78rem] font-bold text-[var(--primary-strong)]">{percent}%</span>
          </div>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={count}
            aria-label={c.progress}
          >
            <div className="progress-fill" style={{ width: `${percent}%` }} />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[0.68rem] text-[var(--muted)]">{c.hint}</span>
            <button
              type="button"
              onClick={() => {
                setChecked({});
                setCelebrate(false);
              }}
              className="text-[0.68rem] font-semibold text-[var(--muted)] underline decoration-dotted underline-offset-2 transition-colors hover:text-[var(--accent)]"
            >
              {c.reset}
            </button>
          </div>
        </div>

        <div className="space-y-2 p-3 md:p-4">
          {items.map((item, index) => {
            const isChecked = Boolean(checked[item.key]);
            return (
              <label key={item.key} className={`check-row ${isChecked ? 'checked' : ''}`}>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isChecked}
                  onChange={() =>
                    setChecked((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key],
                    }))
                  }
                />
                <span className="check-box" aria-hidden="true">
                  {isChecked && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6.2 4.6 9 10 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[0.6rem] text-[var(--muted)]">{String(index + 1).padStart(2, '0')}</span>
                    <span className={`text-[0.86rem] font-bold ${isChecked ? 'text-[var(--text)]' : 'text-[var(--text-soft)]'}`}>
                      {item.title[lang]}
                    </span>
                    <span className={`chip ${isChecked ? 'chip-primary' : ''} font-mono text-[0.58rem]`}>
                      {isChecked ? c.done : c.pending}
                    </span>
                  </span>
                  <span className="mt-1 block text-[0.76rem] leading-relaxed text-[var(--muted)]">{item.detail[lang]}</span>
                  <span className="mt-1 block font-mono text-[0.64rem] text-[var(--primary-strong)]">{item.proof[lang]}</span>
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {celebrate && (
        <div className="rounded-xl border border-[var(--ok)] bg-[color-mix(in_srgb,var(--ok)_8%,var(--surface))] p-4 text-center">
          <div className="text-[1rem] font-bold text-[var(--text)]">{c.celebrate}</div>
          <div className="mt-1 text-[0.78rem] text-[var(--text-soft)]">{c.celebrateSub}</div>
        </div>
      )}

      {reduced && allDone && (
        <p className="text-center text-[0.72rem] text-[var(--muted)]">
          {lang === 'zh' ? '（已根据系统设置关闭彩带动画）' : '(Confetti is off because of your reduced-motion setting.)'}
        </p>
      )}
    </Section>
  );
}
