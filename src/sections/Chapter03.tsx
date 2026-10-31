import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { useLang } from '../i18n/LangContext';

const shapes = [
  {
    key: 'goal',
    glyph: '◎',
    color: 'var(--primary)',
    name: { zh: '目标驱动 Loop', en: 'Goal-based loop' },
    trigger: { zh: '用户给出一个可验收的目标', en: 'A user hands over a verifiable goal' },
    stop: { zh: '验收标准被证据满足', en: 'Evidence satisfies the acceptance criteria' },
    use: { zh: '深度研究、修 Bug、数据清洗', en: 'Deep research, bug fixing, data cleanup' },
    primitive: { zh: 'planner + tools + verifier', en: 'planner + tools + verifier' },
    line: {
      zh: '「把这个仓库的测试修绿。」目标清晰，成功可验证，循环自己知道什么时候收工。',
      en: '“Get this repo’s test suite green.” Clear goal, verifiable success, the loop knows when to stop.',
    },
    trap: {
      zh: '验收标准写成「让它更好」——这等于没有标准。',
      en: 'Writing the acceptance criterion as “make it better” — which is no criterion at all.',
    },
  },
  {
    key: 'event',
    glyph: '⚡',
    color: 'var(--accent)',
    name: { zh: '事件触发 Loop', en: 'Event / trigger loop' },
    trigger: { zh: 'cron、webhook、队列消息', en: 'cron, webhook, queue message' },
    stop: { zh: '事件被处理，且副作用幂等', en: 'The event is handled, with idempotent side effects' },
    use: { zh: '收件箱分拣、告警初筛、日报', en: 'Inbox triage, alert screening, daily digests' },
    primitive: { zh: 'scheduler + queue + idempotency key', en: 'scheduler + queue + idempotency key' },
    line: {
      zh: '不是人来找 Agent，而是事件来找 Agent。难点从「会不会做」变成「会不会重复做」。',
      en: 'The agent does not wait for a person; events find it. The hard part shifts from capability to duplication.',
    },
    trap: {
      zh: '重试导致同一封邮件被回复三次。幂等键不是可选项。',
      en: 'Retries reply to the same email three times. An idempotency key is not optional.',
    },
  },
  {
    key: 'review',
    glyph: '✎',
    color: 'var(--teal)',
    name: { zh: '迭代 / 评审 Loop', en: 'Iterative / review loop' },
    trigger: { zh: '产出一版草稿或补丁', en: 'A draft or patch exists' },
    stop: { zh: '评审通过，或达到轮次上限', en: 'A reviewer approves, or the round limit is reached' },
    use: { zh: '文案、设计稿、代码评审、合同', en: 'Copy, design, code review, contracts' },
    primitive: { zh: 'critic + rubric + interrupt', en: 'critic + rubric + interrupt' },
    line: {
      zh: '生成和评判分开：一个模型写，另一个按 rubric 挑刺，人只在关键节点拍板。',
      en: 'Separate generation from judgment: one model writes, another critiques against a rubric, a human decides at key gates.',
    },
    trap: {
      zh: '让同一个模型给自己的作业打分，它永远给 95 分。',
      en: 'Letting the same model grade its own homework. It always gives itself 95.',
    },
  },
  {
    key: 'self',
    glyph: '↻',
    color: 'var(--chart-4)',
    name: { zh: '自我改进 Loop', en: 'Self-improving loop' },
    trigger: { zh: '评测失败或发现可复用模式', en: 'An eval failure or a reusable pattern' },
    stop: { zh: '改动通过回归评测并被版本化', en: 'The change passes regression evals and is versioned' },
    use: { zh: '提示词优化、技能库沉淀、路由策略', en: 'Prompt optimization, skill libraries, routing policies' },
    primitive: { zh: 'eval harness + versioned prompt + memory', en: 'eval harness + versioned prompt + memory' },
    line: {
      zh: '循环优化的不是这次任务，而是「下次做这类任务的能力」。它必须有一条独立的评测流水线。',
      en: 'The loop optimizes not this task but the ability to do this class of task next time. It needs an independent eval pipeline.',
    },
    trap: {
      zh: '没有回归评测就自动改提示词，等于让 Agent 自己给自己动手术。',
      en: 'Auto-editing prompts without regression evals is letting the agent operate on itself.',
    },
  },
  {
    key: 'auto',
    glyph: '∞',
    color: 'var(--danger)',
    name: { zh: '长时自治 Loop', en: 'Autonomous task loop' },
    trigger: { zh: '一个跨越数小时甚至数天的目标', en: 'A goal spanning hours or days' },
    stop: { zh: '预算耗尽、需要审批、或目标达成', en: 'Budget exhausted, approval needed, or goal reached' },
    use: { zh: '大规模迁移、浏览器操作、持续监控', en: 'Large migrations, browser operations, continuous monitoring' },
    primitive: { zh: 'durable state + checkpoint + budget guard', en: 'durable state + checkpoint + budget guard' },
    line: {
      zh: '它能自己活很久，所以你必须假设：进程会挂、上下文会丢、钱会烧完。',
      en: 'It can live for a long time, so assume the process dies, context is lost, and money runs out.',
    },
    trap: {
      zh: '没有 checkpoint 的长任务，一崩就从头再来，顺便再烧一遍钱。',
      en: 'A long task without checkpoints restarts from zero after a crash — and burns the budget again.',
    },
  },
];

const decisions = [
  {
    q: { zh: '一步就能确定性地完成？', en: 'Can one deterministic step finish it?' },
    a: { zh: '不是 Loop，写普通代码或 workflow', en: 'Not a loop — write plain code or a workflow' },
    tone: 'muted',
  },
  {
    q: { zh: '由时间表或外部事件触发？', en: 'Triggered by a schedule or external event?' },
    a: { zh: '事件触发 Loop', en: 'Event / trigger loop' },
    tone: 'accent',
  },
  {
    q: { zh: '每一版产出都需要人评审？', en: 'Does every output need human review?' },
    a: { zh: '迭代 / 评审 Loop', en: 'Iterative / review loop' },
    tone: 'teal',
  },
  {
    q: { zh: '成功与否能被自动验证？', en: 'Can success be verified automatically?' },
    a: { zh: '目标驱动 Loop', en: 'Goal-based loop' },
    tone: 'primary',
  },
  {
    q: { zh: '要优化的是「下次怎么做」？', en: 'Are you optimizing how to do it next time?' },
    a: { zh: '自我改进 Loop', en: 'Self-improving loop' },
    tone: 'warn',
  },
  {
    q: { zh: '任务会持续数小时以上，且路径不确定？', en: 'Will it run for hours with an uncertain path?' },
    a: { zh: '长时自治 Loop（必须配预算闸）', en: 'Autonomous loop — with a hard budget guard' },
    tone: 'danger',
  },
];

function DecisionTree() {
  const { lang, t } = useLang();

  return (
    <div className="figure">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="chip chip-primary font-mono">{t('决策树', 'DECISION TREE')}</span>
        <span className="text-[0.7rem] text-[var(--muted)]">
          {t('从上往下问，命中即停', 'Ask top to bottom; stop at the first match')}
        </span>
      </div>

      <ol className="relative space-y-2.5">
        <span
          aria-hidden="true"
          className="absolute bottom-6 left-[15px] top-6 w-px bg-[var(--line-strong)] sm:left-[17px]"
        />
        {decisions.map((item, i) => (
          <li key={item.q.en} className="relative flex items-start gap-3">
            <span
              className="relative z-10 mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] font-mono text-[0.68rem] font-bold text-[var(--muted)] sm:h-9 sm:w-9"
              aria-hidden="true"
            >
              Q{i + 1}
            </span>
            <div className="grid min-w-0 flex-1 gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <span className="text-[0.8rem] font-semibold leading-snug text-[var(--text)]">
                {item.q[lang]}
              </span>
              <span className="hidden text-[var(--muted)] sm:block" aria-hidden="true">
                →
              </span>
              <span
                className={`justify-self-start rounded-lg px-2.5 py-1.5 text-[0.74rem] font-semibold sm:justify-self-end ${
                  item.tone === 'muted'
                    ? 'bg-[var(--surface-2)] text-[var(--muted)]'
                    : item.tone === 'danger'
                      ? 'bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-[var(--danger)]'
                      : item.tone === 'warn'
                        ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                        : item.tone === 'teal'
                          ? 'bg-[var(--teal-soft)] text-[var(--teal)]'
                          : item.tone === 'accent'
                            ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
                            : 'bg-[var(--primary-soft)] text-[var(--primary-strong)]'
                }`}
              >
                {item.a[lang]}
              </span>
            </div>
          </li>
        ))}
      </ol>

      <figcaption className="figure-caption">
        {t(
          '图 3-1：先判断「要不要 Loop」，再判断「是哪种 Loop」。大部分事故，是在第一步就选错了。',
          'Figure 3-1: decide whether you need a loop, then which shape. Most incidents start with a wrong answer to the first question.',
        )}
      </figcaption>
    </div>
  );
}

export function Chapter03() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'TAXONOMY',
      title: 'Loop 的五种形态',
      p1: 'Claude 团队的循环入门文章按「什么启动它」把 loop 分成四类：一轮对话触发（turn-based）、目标触发（goal-based）、时间触发（time-based）、主动触发（proactive）。这个分法很好用，因为它把注意力从「Agent 能做什么」拉回到「谁按下了开始键」。',
      p2: '到了生产环境，我更愿意把它扩展成五种可辨认的形态。它们不是学术分类，而是五种不同的故障模型：触发方式决定幂等性，停止方式决定成本，适用场景决定你需要哪些基础设施。',
      p3: '第一类是目标驱动。用户给一个可验收的目标，循环自己跑到证据满足为止。它是最像「Agent」的形态，也是最容易被低估难度的形态：只要验收标准模糊一点，它就会在「差不多完成了」和「再改改」之间反复横跳。',
      p4: '第二类是事件触发。cron、webhook、队列消息按下开始键，Agent 处理完就退出。它看起来最简单，但真正的敌人是重复：网络超时、队列重投、人工重跑，都可能让同一件事发生三次。没有幂等键，你做的不是自动化，是自动化事故。',
      p5: '第三类是迭代 / 评审。先生成一版，再按 rubric 评判，改到通过或达到轮次上限。关键设计是「生成者」和「评判者」分离；让同一个模型给自己的作业打分，它永远觉得自己很棒。',
      p6: '第四类是自我改进。它优化的不是当前任务，而是「下次遇到同类任务的能力」：沉淀提示词、技能、路由策略。这类循环必须挂在独立评测流水线上，否则就是让 Agent 在没有麻醉的情况下给自己动手术。',
      p7: '第五类是长时自治。任务跨越数小时甚至数天，路径不确定，进程可能挂掉。它需要持久化状态、检查点和预算闸。没有这些，所谓自治只是「昂贵地从头再来」。',
      calloutTitle: '一个 Loop 只留一个主形态',
      callout:
        '五种形态可以嵌套，例如「事件触发 → 目标驱动 → 需要时转人工」。但每个 Loop 应该有一个明确的主形态。否则出事时，你连是哪一层在转都说不清。',
      tableHead: ['形态', '触发方式', '正常停止', '适用场景', '典型原语'],
      rows: shapes.map((s) => [s.name[lang], s.trigger[lang], s.stop[lang], s.use[lang], s.primitive[lang]]),
      detailTitle: '五种形态，五种翻车方式',
    },
    en: {
      kicker: 'TAXONOMY',
      title: 'Five shapes of loops',
      p1: 'The Claude team’s introduction to loops classifies loops by what starts them: turn-based, goal-based, time-based and proactive. It is a useful split because it moves attention from “what can the agent do” back to “who presses start.”',
      p2: 'In production I prefer to expand that into five recognizable shapes. They are not academic categories; they are five different failure models. The trigger determines idempotency, the stop condition determines cost, and the use case determines what infrastructure you need.',
      p3: 'The first is goal-based. A user gives a verifiable goal and the loop runs until evidence satisfies it. It is the most “agent-like” shape and the easiest to underestimate: blur the acceptance criteria and it will oscillate between “almost done” and “one more tweak” forever.',
      p4: 'The second is event-triggered. A cron job, webhook or queue message presses start; the agent handles it and exits. It looks simplest, but its real enemy is duplication: network timeouts, queue redelivery and manual reruns can make one event happen three times. Without an idempotency key, you have not built automation; you have built automated incidents.',
      p5: 'The third is iterative / review. Generate a draft, judge it against a rubric, revise until it passes or hits a round limit. The key design is separating the generator from the judge. Let the same model grade its own homework and it always thinks it did great.',
      p6: 'The fourth is self-improving. It optimizes not the current task but the ability to handle this class of task next time: prompts, skills, routing policies. It must hang off an independent eval pipeline. Otherwise the agent is operating on itself without anesthesia.',
      p7: 'The fifth is long-running autonomy. The task spans hours or days, the path is uncertain, and the process may die. It needs durable state, checkpoints and a budget guard. Without those, autonomy is just “restarting from scratch, expensively.”',
      calloutTitle: 'One primary shape per loop',
      callout:
        'Shapes can nest — event trigger → goal-based → escalate to a human. But every loop should have one primary shape. Otherwise, when it breaks, you cannot even tell which layer is spinning.',
      tableHead: ['Shape', 'Trigger', 'Normal stop', 'Use case', 'Typical primitives'],
      rows: shapes.map((s) => [s.name[lang], s.trigger[lang], s.stop[lang], s.use[lang], s.primitive[lang]]),
      detailTitle: 'Five shapes, five ways to fail',
    },
  }[lang];

  return (
    <Section
      id="ch3"
      num="03"
      title={c.title}
      kicker={c.kicker}
      sources={['anthropic-loops', 'anthropic-sdk-agents', 'anthropic-agents']}
    >
      <div className="prose-block">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
        <p>{c.p3}</p>
        <p>{c.p4}</p>
        <p>{c.p5}</p>
        <p>{c.p6}</p>
        <p>{c.p7}</p>
      </div>

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
            {c.rows.map((row) => (
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

      <div>
        <h3 className="mb-3 text-[1.05rem] font-bold text-[var(--text)]">{c.detailTitle}</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shapes.map((shape) => (
            <div key={shape.key} className="card card-hover flex flex-col p-4">
              <div className="mb-2 flex items-center gap-2">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-[1rem]"
                  style={{ background: 'var(--surface-2)', color: shape.color }}
                  aria-hidden="true"
                >
                  {shape.glyph}
                </span>
                <span className="text-[0.88rem] font-bold text-[var(--text)]">{shape.name[lang]}</span>
              </div>
              <p className="text-[0.78rem] leading-relaxed text-[var(--text-soft)]">{shape.line[lang]}</p>
              <p className="mt-2 border-t border-dashed border-[var(--line)] pt-2 text-[0.72rem] leading-relaxed text-[var(--muted)]">
                <span className="font-semibold text-[var(--accent)]">{lang === 'zh' ? '坑：' : 'Trap: '}</span>
                {shape.trap[lang]}
              </p>
            </div>
          ))}
        </div>
      </div>

      <DecisionTree />

      <Callout tone="warn" title={c.calloutTitle} icon="🧭">
        {c.callout}
      </Callout>
    </Section>
  );
}
