import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { useLang } from '../i18n/LangContext';

const stops = [
  {
    key: 'explicit',
    label: { zh: '显式停止', en: 'Explicit stop' },
    example: {
      zh: '模型调用 `finish` 工具；测试全绿；验收脚本返回 0',
      en: 'The model calls a `finish` tool; tests pass; an acceptance script returns 0',
    },
    good: { zh: '信号明确，可审计', en: 'Clear, auditable signal' },
    risk: { zh: '模型可能过早宣布完成', en: 'The model may declare victory early' },
    tone: 'var(--ok)',
  },
  {
    key: 'implicit',
    label: { zh: '隐式停止', en: 'Implicit stop' },
    example: {
      zh: '这一轮没有工具调用，只有最终文本',
      en: 'No tool calls this turn, only final text',
    },
    good: { zh: '实现简单，兼容多数 SDK', en: 'Simple and compatible with most SDKs' },
    risk: { zh: '模型可能“忘了”调用工具', en: 'The model may simply “forget” to use a tool' },
    tone: 'var(--primary)',
  },
  {
    key: 'safety',
    label: { zh: '兜底停止', en: 'Safety stop' },
    example: {
      zh: '`maxIterations`、token 预算、墙钟时间、连续停滞检测、人工取消',
      en: '`maxIterations`, token budget, wall clock, stall detection, human abort',
    },
    good: { zh: '保证最坏情况有上限', en: 'Bounds the worst case' },
    risk: { zh: '截断时任务可能只做了一半', en: 'The task may be only half done when cut off' },
    tone: 'var(--accent)',
  },
];

const flow = [
  {
    q: { zh: '验收证据满足了吗？', en: 'Is the acceptance evidence satisfied?' },
    y: { zh: '成功停止', en: 'Stop: success' },
    tone: 'ok',
  },
  {
    q: { zh: '收到明确的完成信号？', en: 'Is there an explicit finish signal?' },
    y: { zh: '成功停止', en: 'Stop: success' },
    tone: 'ok',
  },
  {
    q: { zh: '连续 3 次相同 tool + args？', en: 'Same tool + args three times in a row?' },
    y: { zh: '停滞停止，换策略或交人', en: 'Stop: stalled — change strategy or escalate' },
    tone: 'warn',
  },
  {
    q: { zh: '预算 / 时间 / 取消信号触发？', en: 'Budget, time or abort signal hit?' },
    y: { zh: '兜底停止，保留现场', en: 'Stop: safety — preserve the scene' },
    tone: 'danger',
  },
];

function StopFlow() {
  const { lang, t } = useLang();

  return (
    <div className="figure">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="chip chip-primary font-mono">{t('每轮收尾检查', 'END-OF-TURN CHECK')}</span>
        <span className="text-[0.7rem] text-[var(--muted)]">
          {t('任何一个命中，都不要再转下一圈', 'If any check hits, do not spin again')}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {flow.map((item, i) => (
          <div
            key={item.q.en}
            className="relative rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3.5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="font-mono text-[0.62rem] text-[var(--muted)]">CHECK 0{i + 1}</span>
              <span
                className="rounded-md px-2 py-0.5 text-[0.6rem] font-bold"
                style={{
                  color:
                    item.tone === 'ok'
                      ? 'var(--ok)'
                      : item.tone === 'warn'
                        ? 'var(--warn)'
                        : 'var(--danger)',
                  background:
                    item.tone === 'ok'
                      ? 'color-mix(in srgb, var(--ok) 10%, transparent)'
                      : item.tone === 'warn'
                        ? 'var(--accent-soft)'
                        : 'color-mix(in srgb, var(--danger) 10%, transparent)',
                }}
              >
                {t('是 → 停止', 'YES → STOP')}
              </span>
            </div>
            <p className="mt-2 text-[0.82rem] font-semibold leading-snug text-[var(--text)]">{item.q[lang]}</p>
            <p className="mt-1.5 text-[0.72rem] text-[var(--muted)]">{item.y[lang]}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-xl border border-dashed border-[var(--primary)] bg-[var(--primary-soft)] p-3 text-center">
        <span className="text-[0.78rem] font-semibold text-[var(--primary-strong)]">
          {t('全部为否 → 带着新证据进入下一轮', 'All no → carry the new evidence into the next turn')}
        </span>
      </div>

      <figcaption className="figure-caption">
        {t(
          '图 4-1：停止条件不是写在循环外面的 if，而是每一轮必须走的检查清单。',
          'Figure 4-1: stop conditions are not an if outside the loop; they are a checklist every turn must pass.',
        )}
      </figcaption>
    </div>
  );
}

const guardCode = `from dataclasses import dataclass, field
import hashlib, json, time

@dataclass
class Budget:
    max_iterations: int = 12
    max_wall_clock_s: int = 120
    max_stalls: int = 3
    started_at: float = field(default_factory=time.time)

def fingerprint(name: str, args: dict) -> str:
    # 排序后再哈希，避免参数顺序造成“看起来不一样”
    raw = json.dumps(args, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(f"{name}:{raw}".encode()).hexdigest()[:12]

def run_loop(task, model, tools, budget: Budget | None = None):
    budget = budget or Budget()
    messages = [{"role": "user", "content": task}]
    last_key, repeats = None, 0

    for step in range(1, budget.max_iterations + 1):
        if time.time() - budget.started_at > budget.max_wall_clock_s:
            return {"status": "timeout", "step": step, "messages": messages}

        action = model.next_action(messages)  # 由你注入的 SDK 适配层

        if action.type == "finish":
            return {"status": "done", "answer": action.answer, "step": step}

        key = fingerprint(action.tool, action.args)
        repeats = repeats + 1 if key == last_key else 1
        last_key = key

        if repeats >= budget.max_stalls:
            return {"status": "stalled", "key": key, "step": step}

        result = tools[action.tool](**action.args)
        messages.append({"role": "tool", "content": result})
        # 真实实现里还要检查 token 预算与外部 abort 信号

    return {"status": "budget_exhausted", "step": budget.max_iterations}`;

export function Chapter04() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'CONTROL',
      title: '停止条件的艺术',
      p1: '大模型没有「累」这个感觉。它不会因为转了三十圈而主动说「要不今天先到这」。循环之所以会停，只有一个原因：你写了一个让它停的条件。',
      p2: '停止条件分三层。第一层是显式停止：模型调用 finish 工具、测试全绿、验收脚本返回 0。这是最理想的信号，明确、可审计、能写进 CI。但它有个前提——验收标准本身得靠谱。',
      p3: '第二层是隐式停止：这一轮没有工具调用，只输出最终文本。几乎所有 SDK 都这么实现，简单有效。风险是模型有时会「忘了」调工具，直接编一个看起来很像答案的答案，然后优雅地停下。',
      p4: '第三层是兜底停止：最大轮次、token 预算、墙钟时间、人工取消。它不负责让任务成功，只负责保证最坏情况有上限。生产系统里，这一层不是可选项，是生死线。',
      p5: '三层之外，还有一个最隐蔽的杀手：停滞。Agent 没有报错，也没有超时，它在勤勤恳恳地重复同一个动作——读同一个文件、搜同一个关键词、调用同一个 API。每一轮都「成功」，整体却毫无进展。',
      p6: '检测方法很朴素：把工具名和参数做规范化哈希，连续三次完全一致就判定停滞。注意要排序参数键，否则 {"a":1,"b":2} 和 {"b":2,"a":1} 会被当成两件事。一旦命中，不要默默重试，要么注入一条「换个策略」的反馈，要么直接停机交人。',
      p7: 'AWS 的 AgentCore 可观测性复盘里有一个经典事故：一次请求产生了 177 个 span、耗时 85,590 毫秒，根因不是模型太笨，而是系统提示词里写了「never give up」。Agent 非常听话地永不放弃，于是永不停止。',
      p8: '这就是停止条件的第一性原理：你鼓励它坚持，就得同时告诉它什么情况算失败。否则「坚持」和「死循环」之间，只差一个没有写出来的边界。',
      calloutTitle: '把「永不放弃」换成「这样就算失败」',
      callout:
        '不要说「无论如何都要完成任务」。要说清楚：连续 3 次无进展就停；超过 12 轮就停；超过预算就停；需要权限就交人。鼓励要有，边界更要有。',
      tableHead: ['层级', '典型信号', '优点', '风险'],
      rows: stops.map((s) => [s.label[lang], s.example[lang], s.good[lang], s.risk[lang]]),
      codeCaption: {
        zh: '可运行骨架：模型适配层（model.next_action）由你注入，其余是纯 Python。',
        en: 'Runnable skeleton: inject the model adapter (model.next_action); everything else is plain Python.',
      },
      stallTitle: '停滞检测的四个细节',
      stallPoints: [
        {
          zh: '哈希前先规范化：参数键排序、去掉临时字段，避免「看起来不同、实质相同」。',
          en: 'Canonicalize before hashing: sort keys and drop volatile fields so “different” means different.',
        },
        {
          zh: '按「连续」计数，不是按总数。间隔出现的相同调用可能是合理重试。',
          en: 'Count consecutive repeats, not totals. The same call separated by progress may be a valid retry.',
        },
        {
          zh: '除了动作，还要看状态变化：文件是否变了、测试结果是否变了。',
          en: 'Watch state, not just actions: did files change? did test results change?',
        },
        {
          zh: '命中停滞不等于失败，先给一次换策略的机会，再停机。',
          en: 'Stall is not failure. Offer one chance to change strategy before stopping.',
        },
      ],
    },
    en: {
      kicker: 'CONTROL',
      title: 'The art of stopping',
      p1: 'A language model does not feel tired. It will not circle thirty times and suggest calling it a day. A loop stops for exactly one reason: you wrote a condition that makes it stop.',
      p2: 'Stop conditions come in three layers. The first is explicit: the model calls a finish tool, tests go green, an acceptance script exits 0. That is the ideal signal — clear, auditable, CI-friendly. Its precondition is that the acceptance criteria themselves are sound.',
      p3: 'The second is implicit: no tool calls this turn, only final text. Nearly every SDK implements it, and it is simple and effective. The risk is that the model sometimes “forgets” to call a tool, invents an answer that looks plausible, and stops gracefully.',
      p4: 'The third is safety: max iterations, token budget, wall clock, human abort. It is not responsible for making the task succeed; it is responsible for bounding the worst case. In production this layer is not optional. It is the lifeline.',
      p5: 'Beyond the three layers sits the quietest killer: stalling. No error, no timeout — the agent is diligently repeating the same action: reading the same file, searching the same keyword, calling the same API. Every turn “succeeds” while the whole makes no progress.',
      p6: 'The detection is simple: canonicalize the tool name and arguments into a hash. Three consecutive identical fingerprints means a stall. Sort the argument keys first, or {"a":1,"b":2} and {"b":2,"a":1} look different. When it hits, do not silently retry. Inject a “change strategy” message, or stop and escalate.',
      p7: 'AWS’s AgentCore observability postmortem has a classic incident: one request produced 177 spans over 85,590 ms. The root cause was not a weak model but a system prompt that said “never give up.” The agent obeyed and never stopped.',
      p8: 'That is the first principle of stopping: if you encourage persistence, you must also define failure. Otherwise the distance between “persistent” and “infinite loop” is one unwritten boundary.',
      calloutTitle: 'Replace “never give up” with “here is what counts as failure”',
      callout:
        'Do not say “finish the task no matter what.” Say: stop after three consecutive stalls; stop after twelve turns; stop when the budget is gone; ask a human when permissions are needed. Encourage, but bound.',
      tableHead: ['Layer', 'Typical signal', 'Strength', 'Risk'],
      rows: stops.map((s) => [s.label[lang], s.example[lang], s.good[lang], s.risk[lang]]),
      codeCaption: {
        zh: '可运行骨架：模型适配层（model.next_action）由你注入，其余是纯 Python。',
        en: 'Runnable skeleton: inject the model adapter (model.next_action); everything else is plain Python.',
      },
      stallTitle: 'Four details of stall detection',
      stallPoints: [
        {
          zh: '哈希前先规范化：参数键排序、去掉临时字段，避免「看起来不同、实质相同」。',
          en: 'Canonicalize before hashing: sort keys and drop volatile fields so “different” means different.',
        },
        {
          zh: '按「连续」计数，不是按总数。间隔出现的相同调用可能是合理重试。',
          en: 'Count consecutive repeats, not totals. The same call separated by progress may be a valid retry.',
        },
        {
          zh: '除了动作，还要看状态变化：文件是否变了、测试结果是否变了。',
          en: 'Watch state, not just actions: did files change? did test results change?',
        },
        {
          zh: '命中停滞不等于失败，先给一次换策略的机会，再停机。',
          en: 'Stall is not failure. Offer one chance to change strategy before stopping.',
        },
      ],
    },
  }[lang];

  return (
    <Section id="ch4" num="04" title={c.title} kicker={c.kicker} sources={['aws-agentcore-blog', 'claude-sdk-loop']}>
      <div className="prose-block">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
        <p>{c.p3}</p>
        <p>{c.p4}</p>
        <p>{c.p5}</p>
        <p>{c.p6}</p>
        <p>{c.p7}</p>
        <p>{c.p8}</p>
      </div>

      <StopFlow />

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

      <Callout tone="danger" title={c.calloutTitle} icon="🛑">
        {c.callout}
      </Callout>

      <div>
        <h3 className="mb-2 text-[1.05rem] font-bold text-[var(--text)]">{c.stallTitle}</h3>
        <ul className="prose-block list-disc">
          {c.stallPoints.map((point) => (
            <li key={point.en}>{point[lang]}</li>
          ))}
        </ul>
      </div>

      <CodeBlock code={guardCode} language="python" filename="guardrails.py" caption={c.codeCaption[lang]} />
    </Section>
  );
}
