import { useEffect, useState } from 'react';
import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { useLang } from '../i18n/LangContext';
import { usePrefersReducedMotion } from '../lib/hooks';

function LoopRing() {
  const { lang, t } = useLang();
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);

  const steps = [
    {
      title: { zh: '收集上下文', en: 'Gather context' },
      short: { zh: '收集', en: 'Context' },
      desc: {
        zh: '先看清牌面：读关键文件、搜代码、查数据、回忆上一轮状态。上下文不是越多越好，而是越相关越好。',
        en: 'Read the table: open the right files, search the codebase, query data, recall the last state. More context is not better; more relevant context is.',
      },
      risk: {
        zh: '还没读关键文件，模型就开始下结论。',
        en: 'The model concludes before reading the file that matters.',
      },
    },
    {
      title: { zh: '执行操作', en: 'Take action' },
      short: { zh: '行动', en: 'Action' },
      desc: {
        zh: '调用工具、改文件、跑命令、发请求。一次做一个可验证的小动作，别一口气改十个文件然后祈祷。',
        en: 'Call tools, edit files, run commands, make requests. Prefer one verifiable action at a time over changing ten files and praying.',
      },
      risk: {
        zh: '参数靠猜、批量修改、没有回滚点。',
        en: 'Guessed arguments, giant edits, no rollback point.',
      },
    },
    {
      title: { zh: '验证结果', en: 'Verify work' },
      short: { zh: '验证', en: 'Verify' },
      desc: {
        zh: '跑测试、看 lint、校验 schema、截图、让独立 reviewer 再看一眼。验证要能产出证据，而不是模型说「我觉得行」。',
        en: 'Run tests, lint, validate schemas, take screenshots, ask an independent reviewer. Verification must produce evidence, not “I think it works.”',
      },
      risk: {
        zh: '没跑测试就宣布完成，只相信模型自述。',
        en: 'Declaring done without running tests; trusting the model’s self-report.',
      },
    },
    {
      title: { zh: '重复或停止', en: 'Repeat or stop' },
      short: { zh: '循环', en: 'Loop' },
      desc: {
        zh: '把证据和验收标准比对：继续、换路、交给人，还是停。循环的智商，主要体现在这一步。',
        en: 'Compare evidence against the acceptance criteria: continue, change strategy, hand off, or stop. This is where loop intelligence actually lives.',
      },
      risk: {
        zh: '没有停止条件；同一个动作反复重试。',
        en: 'No stop condition; retrying the same action forever.',
      },
    },
  ];

  useEffect(() => {
    if (reduced || !auto) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % 4), 3600);
    return () => window.clearInterval(id);
  }, [reduced, auto]);

  const current = steps[active];
  const positions = [
    { left: '50%', top: '0%' },
    { left: '100%', top: '50%' },
    { left: '50%', top: '100%' },
    { left: '0%', top: '50%' },
  ];

  const arcs = [
    'M200 50 A150 150 0 0 1 350 200',
    'M350 200 A150 150 0 0 1 200 350',
    'M200 350 A150 150 0 0 1 50 200',
    'M50 200 A150 150 0 0 1 200 50',
  ];

  return (
    <div className="figure">
      <div className="grid items-center gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="relative mx-auto w-full max-w-[400px] px-10 py-10">
          <div className="relative aspect-square">
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <circle cx="200" cy="200" r="150" fill="none" stroke="var(--line)" strokeWidth="1" />
              {arcs.map((d, i) => (
                <path
                  key={d}
                  d={d}
                  fill="none"
                  stroke={i === active ? 'var(--primary)' : 'var(--line-strong)'}
                  strokeWidth={i === active ? 3 : 1.4}
                  strokeLinecap="round"
                  style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                />
              ))}
            </svg>

            <div className="absolute left-1/2 top-1/2 flex h-[44%] w-[44%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-center shadow-[var(--shadow-card)]">
              <span className="font-mono text-[0.6rem] tracking-[0.15em] text-[var(--muted)]">
                0{active + 1} / 04
              </span>
              <span className="mt-1 max-w-[92%] text-[0.82rem] font-bold leading-tight text-[var(--text)]">
                {current.title[lang]}
              </span>
              <span className="mt-1.5 text-[0.58rem] text-[var(--muted)]">
                {t('点击节点查看', 'Click a node')}
              </span>
            </div>

            {steps.map((step, i) => (
              <button
                key={step.short.en}
                type="button"
                onClick={() => {
                  setActive(i);
                  setAuto(false);
                }}
                className={`absolute z-10 flex w-[86px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 rounded-xl border px-2 py-2 shadow-[var(--shadow-sm)] transition-all duration-300 ${
                  i === active
                    ? 'scale-105 border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-contrast)] shadow-[0_10px_24px_-14px_var(--primary)]'
                    : 'border-[var(--line)] bg-[var(--surface)] text-[var(--text)] hover:border-[var(--primary)]'
                }`}
                style={{ left: positions[i].left, top: positions[i].top }}
                aria-pressed={i === active}
                aria-label={`${t('第', 'Step')} ${i + 1}: ${step.title[lang]}`}
              >
                <span className={`font-mono text-[0.58rem] ${i === active ? 'opacity-80' : 'text-[var(--muted)]'}`}>
                  0{i + 1}
                </span>
                <span className="text-[0.7rem] font-bold leading-tight">{step.short[lang]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="chip chip-primary font-mono">
              {t('第', 'STEP')} 0{active + 1}
            </span>
            <button
              type="button"
              onClick={() => setAuto((v) => !v)}
              className="text-[0.64rem] font-semibold text-[var(--muted)] transition-colors hover:text-[var(--primary-strong)]"
              aria-pressed={auto}
            >
              {auto ? t('暂停自动播放', 'Pause auto-play') : t('恢复自动播放', 'Resume auto-play')}
            </button>
          </div>
          <h3 className="text-[1.05rem] font-bold text-[var(--text)]">{current.title[lang]}</h3>
          <p className="mt-2 text-[0.84rem] leading-[1.8] text-[var(--text-soft)]">{current.desc[lang]}</p>
          <div className="mt-4 rounded-lg border border-[color-mix(in_srgb,var(--accent)_25%,var(--line))] bg-[var(--accent-soft)] px-3 py-2.5">
            <div className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--accent)]">
              {t('失败信号', 'Failure signal')}
            </div>
            <div className="mt-1 text-[0.76rem] leading-relaxed text-[var(--text-soft)]">{current.risk[lang]}</div>
          </div>
        </div>
      </div>
      <figcaption className="figure-caption">
        {t(
          '图 2-1：Claude Code 的四步反馈环。点击任意节点查看细节，循环每 3.6 秒自动前进。',
          'Figure 2-1: Claude Code’s four-step loop. Click a node for details; it advances every 3.6 seconds.',
        )}
      </figcaption>
    </div>
  );
}

export function Chapter02() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'ANATOMY',
      title: 'Loop 的解剖学：四步反馈环',
      p1: 'Claude Code 的官方文档把 Agent 的循环拆成四步：收集上下文 → 执行操作 → 验证结果 → 重复。听起来像废话，但每一步都可能成为事故现场。',
      p2: '收集上下文是「先看清牌面」。读哪个文件、搜什么关键词、上一轮工具返回了什么、用户原始约束是什么。上下文不是越多越好，塞满 128K 不会让模型更聪明，只会让它更迷茫。',
      p3: '执行操作是「真的动手」。调用工具、改文件、跑命令、发请求。关键是让每个动作都可验证、可回滚：一次只改一个小地方，比一口气重写十个文件然后祈祷要靠谱得多。',
      p4: '验证结果是整条循环里最容易被省略、也最不能省略的一步。模型说「我做完了」只是观点；测试绿了、类型检查过了、截图对上了，才是证据。没有验证的 Agent，就是在盲飞。',
      p5: '最后一步不是简单的「再来一次」，而是带着新证据做决策：继续推进、换一条路、交给人，还是停下。循环的智商，主要体现在这里。',
      p6: '把这四步画成环，你会发现一个反直觉的事实：Agent 的能力上限，往往不取决于模型多强，而取决于验证环节有多硬。一个会跑测试的普通模型，通常比一个只会自我感觉良好的强模型更可靠。',
      calloutTitle: '最小可用的循环',
      callout:
        '至少给 Agent 两个工具：一个用来「改变世界」（写文件、发请求），一个用来「检查世界」（跑测试、读回结果）。只有前者，它会自信地犯错；只有后者，它什么也做不成。',
      tableHead: ['步骤', '它在问什么', '没有它会怎样'],
      tableRows: [
        ['收集上下文', '我现在知道什么？还缺什么？', '基于旧信息瞎猜'],
        ['执行操作', '下一步做什么，才能推进目标？', '只说不做，或乱做'],
        ['验证结果', '我怎么证明这一步真的成功了？', '把幻觉当成果交付'],
        ['重复或停止', '继续、换路、交人，还是收工？', '无限循环或过早结束'],
      ],
    },
    en: {
      kicker: 'ANATOMY',
      title: 'Anatomy of a loop: the four-step cycle',
      p1: 'Claude Code’s documentation breaks the agent loop into four steps: gather context → take action → verify work → repeat. It sounds obvious, but every step is a potential incident scene.',
      p2: 'Gathering context means reading the table first: which file to open, what to search, what the last tool returned, what constraints the user gave. More context is not better. Filling 128K does not make a model smarter; it makes it more lost.',
      p3: 'Taking action means actually doing something: call a tool, edit a file, run a command, make a request. Keep each action verifiable and reversible. Changing one small thing beats rewriting ten files and praying.',
      p4: 'Verification is the step most often skipped and least safe to skip. “I finished” is an opinion; green tests, passing type checks and matching screenshots are evidence. An agent without verification is flying blind.',
      p5: 'The last step is not simply “do it again.” It is a decision made with new evidence: keep going, change strategy, hand off to a human, or stop. The intelligence of the loop lives here.',
      p6: 'Draw these four steps as a ring and a counterintuitive fact appears: an agent’s ceiling often depends less on model strength than on how hard the verification step is. A modest model that runs tests is usually more reliable than a brilliant one that only feels good about itself.',
      calloutTitle: 'Minimum viable loop',
      callout:
        'Give the agent at least two tools: one to change the world (write a file, send a request) and one to inspect the world (run tests, read the result back). With only the first, it confidently makes mistakes; with only the second, it does nothing.',
      tableHead: ['Step', 'The question it asks', 'Without it'],
      tableRows: [
        ['Gather context', 'What do I know? What is missing?', 'Guessing from stale information'],
        ['Take action', 'What is the next move toward the goal?', 'All talk, or random edits'],
        ['Verify work', 'How do I prove this step actually worked?', 'Shipping hallucinations'],
        ['Repeat or stop', 'Continue, change path, hand off, or finish?', 'Infinite loop or premature exit'],
      ],
    },
  }[lang];

  return (
    <Section
      id="ch2"
      num="02"
      title={c.title}
      kicker={c.kicker}
      sources={['claude-sdk-loop', 'anthropic-sdk-agents']}
    >
      <div className="prose-block">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
        <p>{c.p3}</p>
        <p>{c.p4}</p>
        <p>{c.p5}</p>
        <p>{c.p6}</p>
      </div>

      <LoopRing />

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              {c.tableHead.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {c.tableRows.map((row) => (
              <tr key={row[0]}>
                {row.map((cell, i) => (
                  <td key={cell} className={i === 0 ? 'font-semibold text-[var(--text)]' : ''}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="teal" title={c.calloutTitle} icon="🧰">
        {c.callout}
      </Callout>
    </Section>
  );
}
