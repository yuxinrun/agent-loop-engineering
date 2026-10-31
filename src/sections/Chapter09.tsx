import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { useLang } from '../i18n/LangContext';

type SpanRow = {
  label: string;
  kind: 'agent' | 'llm' | 'tool' | 'check';
  start: number;
  dur: number;
  note?: { zh: string; en: string };
};

const idealRows: SpanRow[] = [
  { label: 'agent.run', kind: 'agent', start: 0, dur: 5100 },
  { label: 'llm.plan', kind: 'llm', start: 20, dur: 880 },
  { label: 'tool.search_docs', kind: 'tool', start: 940, dur: 650 },
  { label: 'llm.read_results', kind: 'llm', start: 1620, dur: 780 },
  { label: 'tool.read_file', kind: 'tool', start: 2430, dur: 520 },
  { label: 'llm.patch', kind: 'llm', start: 2980, dur: 700 },
  { label: 'tool.run_tests', kind: 'tool', start: 3710, dur: 800 },
  { label: 'check.acceptance', kind: 'check', start: 4540, dur: 300 },
  { label: 'agent.finish', kind: 'agent', start: 4880, dur: 90 },
];

const runawayRows: SpanRow[] = [
  { label: 'agent.run', kind: 'agent', start: 0, dur: 85590 },
  { label: 'llm.plan', kind: 'llm', start: 15, dur: 900 },
  { label: 'tool.fetch_page', kind: 'tool', start: 950, dur: 2100 },
  { label: 'llm.retry', kind: 'llm', start: 3100, dur: 800 },
  { label: 'tool.fetch_page', kind: 'tool', start: 3950, dur: 2050 },
  { label: 'llm.retry', kind: 'llm', start: 6050, dur: 760 },
  {
    label: 'fetch_page ×168',
    kind: 'tool',
    start: 6900,
    dur: 75200,
    note: { zh: '同一工具、同一参数，无人叫停', en: 'Same tool, same args, no one calls stop' },
  },
  {
    label: 'agent.continue',
    kind: 'agent',
    start: 85200,
    dur: 300,
    note: { zh: '“never give up” 生效了', en: '“never give up” works as written' },
  },
];

const spanFields = [
  {
    field: 'trace_id / span_id',
    why: { zh: '把一次任务的所有模型调用、工具调用串成一棵树', en: 'Tie every model and tool call for one task into a tree' },
    example: '4bf9… / 91c2…',
  },
  {
    field: 'turn',
    why: { zh: '知道这是第几轮，才能定位“从哪一轮开始变坏”', en: 'Know which turn things started going wrong' },
    example: '7',
  },
  {
    field: 'prompt_version',
    why: { zh: '提示词改版常常是行为突变的根因', en: 'Prompt changes are a common root cause of behavior shifts' },
    example: 'planner-v12',
  },
  {
    field: 'tool.args_hash',
    why: { zh: '检测停滞：连续三次相同 hash 就是无进展', en: 'Stall detection: three identical hashes mean no progress' },
    example: '9f2c…',
  },
  {
    field: 'tool.result_hash',
    why: { zh: '检测无效重试：结果没变，说明这一步白做', en: 'Detect useless retries: an unchanged result means the step did nothing' },
    example: 'b71e…',
  },
  {
    field: 'stop_reason',
    why: { zh: '区分正常完成、预算耗尽、停滞与人工中止', en: 'Separate success from budget, stall and manual abort' },
    example: 'stalled',
  },
  {
    field: 'tokens / cost_usd',
    why: { zh: '把成本归因到轮次、工具和任务类型', en: 'Attribute cost to turns, tools and task types' },
    example: '48,210 / 0.083',
  },
];

function Waterfall({
  title,
  subtitle,
  max,
  rows,
  tone,
}: {
  title: string;
  subtitle: string;
  max: number;
  rows: SpanRow[];
  tone: 'ok' | 'danger';
}) {
  const { lang, t } = useLang();
  const colors = {
    agent: 'var(--chart-1)',
    llm: 'var(--chart-3)',
    tool: 'var(--chart-2)',
    check: 'var(--ok)',
  };

  return (
    <div className="card min-w-0 p-3.5">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <h3 className="text-[0.8rem] font-bold" style={{ color: tone === 'ok' ? 'var(--ok)' : 'var(--danger)' }}>
          {title}
        </h3>
        <span className="font-mono text-[0.62rem] text-[var(--muted)]">{subtitle}</span>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[500px]">
          <div className="grid grid-cols-[112px_1fr] gap-2">
            <span />
            <div className="relative h-5 border-b border-[var(--line)]">
              {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
                <span
                  key={ratio}
                  className="absolute top-0 font-mono text-[0.56rem] text-[var(--muted)]"
                  style={{ left: `${ratio * 100}%`, transform: ratio === 1 ? 'translateX(-100%)' : ratio === 0 ? 'none' : 'translateX(-50%)' }}
                >
                  {(max * ratio / 1000).toFixed(ratio === 1 ? 0 : 1)}s
                </span>
              ))}
            </div>
          </div>
          {rows.map((row, index) => {
            const left = (row.start / max) * 100;
            const width = Math.max((row.dur / max) * 100, 1.2);
            return (
              <div key={`${row.label}-${index}`} className="grid grid-cols-[112px_1fr] items-center gap-2 py-[3px]">
                <span className="truncate font-mono text-[0.6rem] text-[var(--text-soft)]" title={row.label}>
                  {row.label}
                </span>
                <div className="relative h-[18px] rounded-[4px] bg-[var(--surface-2)]">
                  <span
                    className="absolute top-1/2 h-[11px] -translate-y-1/2 rounded-[3px]"
                    style={{ left: `${left}%`, width: `${width}%`, background: colors[row.kind], opacity: row.kind === 'agent' ? 0.55 : 0.9 }}
                    title={`${row.label} · ${row.start}–${row.start + row.dur}ms`}
                  />
                  {row.note && (
                    <span
                      className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pl-1 text-[0.54rem] font-semibold"
                      style={{ left: `${Math.min(left + width, 62)}%`, color: 'var(--danger)' }}
                    >
                      {row.note[lang]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 border-t border-dashed border-[var(--line)] pt-2">
        {[
          { key: 'agent', label: t('Agent', 'Agent') },
          { key: 'llm', label: t('模型调用', 'LLM call') },
          { key: 'tool', label: t('工具调用', 'Tool call') },
          { key: 'check', label: t('验证', 'Verification') },
        ].map((item) => (
          <span key={item.key} className="flex items-center gap-1 text-[0.6rem] text-[var(--muted)]">
            <i
              className="inline-block h-2 w-2 rounded-[2px]"
              style={{ background: colors[item.key as keyof typeof colors] }}
              aria-hidden="true"
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

const eventCode = `{
  "trace_id": "4bf9c1…",
  "span_id": "91c2a7…",
  "parent_span_id": "1d40be…",
  "turn": 7,
  "prompt_version": "planner-v12",
  "model": "your-model-id",
  "tool": {
    "name": "fetch_page",
    "args_hash": "9f2c41d0…",
    "result_hash": "b71e88a3…"
  },
  "stop_reason": "tool_use",
  "tokens": { "input": 48210, "output": 612 },
  "cost_usd": 0.083,
  "latency_ms": 2314,
  "decision": "检索连续失败两次，切换为直接读取已知 URL"
}`;

export function Chapter09() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'OBSERVE',
      title: '可观测性与调试',
      p1: 'Agent 出问题时，最没用的一句话是「它为什么这样？」。你需要的是证据：第几轮、调用了什么、参数是什么、返回了什么、花了多少 token、为什么停。没有这些，调试就是猜。',
      p2: '传统监控盯三件事：是否存活、延迟、错误率。但 Agent 会「活着出错」——服务 200、延迟正常、错误率为零，行为却是错的。Dataiku 的文章把这叫传统可观测性的盲区：它看得见系统挂了，看不见决策歪了。',
      p3: '你需要 trace，而不是日志。一次任务是一条 trace，里面有嵌套的 span：Agent 轮次 → 模型调用 → 工具调用 → 检索 → 验证。OpenTelemetry 已经有一套面向生成式 AI 的语义约定，AgentCore 这类平台也直接基于 OTel 采集。',
      p4: '每个 span 至少记七样东西：轮次、提示词版本、模型、工具名与参数哈希、结果哈希、token 与成本、停止原因。参数哈希用来发现停滞，结果哈希用来发现「白做」——调用成功了，但世界没有变化。',
      p5: '调试时不要从第一行日志读起，先找「第一个坏掉的 span」。它之前的证据大概率是干净的，它之后都是连锁反应。然后对比预期和实际：参数对不对、返回是不是空、验证是不是根本没跑。',
      p6: 'AWS 的复盘里，一次异常请求产生了 177 个 span、总耗时 85,590 毫秒。瀑布图一拉开，问题一目了然：同一个 `fetch_page` 反复出现，几乎占满了整条时间线。再往上追，根因是系统提示词里的「never give up」。',
      p7: '这就是可观测性的真正价值：它不只告诉你「慢了」，还告诉你「慢在哪一环、为什么没停」。有瀑布图，177 个 span 是一个故事；没有瀑布图，它只是 177 行日志。',
      p8: '最后，把决策也记下来。不是记模型的完整思维链，而是记一句可审计的决策摘要：「检索失败两次，切换到直接读取」。将来复盘时，这句话比一万个 token 的内心戏更有用。',
      tableHead: ['字段', '为什么重要', '示例'],
      rows: spanFields.map((f) => [f.field, f.why[lang], f.example]),
      idealTitle: '理想 trace：有验证，有终点',
      runawayTitle: '失控 trace：177 个 span，85,590 ms',
      idealSub: '9 spans · 5.1s',
      runawaySub: '177 spans · 85.6s',
      eventTitle: '一条可审计的决策事件',
      codeCaption: {
        zh: '不记录完整思维链，只记录可复核的决策证据；字段名可按你的 OTel 后端调整。',
        en: 'Do not log full chain-of-thought; log reviewable decision evidence. Field names can follow your OTel backend.',
      },
      calloutTitle: '日志回答「发生了什么」，trace 回答「为什么」',
      callout:
        '只记日志，你得到一串孤立事件；记 trace，你得到因果链。再加一个决策摘要，你才能回答那个最重要的问题：它当时为什么选了这条路？',
    },
    en: {
      kicker: 'OBSERVE',
      title: 'Observability and debugging',
      p1: 'When an agent misbehaves, the least useful question is “why did it do that?” You need evidence: which turn, what tool, which arguments, what came back, how many tokens, and why it stopped. Without that, debugging is guessing.',
      p2: 'Traditional monitoring watches three things: uptime, latency, error rate. But agents “stay up while going wrong” — HTTP 200, normal latency, zero errors, wrong behavior. Dataiku calls this the blind spot of traditional observability: it sees the system go down, not the decision go sideways.',
      p3: 'You need traces, not logs. One task is one trace, with nested spans: agent turn → model call → tool call → retrieval → verification. OpenTelemetry has semantic conventions for generative AI, and platforms like AgentCore collect directly over OTel.',
      p4: 'Every span should record at least seven things: turn, prompt version, model, tool name and argument hash, result hash, tokens and cost, stop reason. The argument hash detects stalls; the result hash detects “work for nothing” — the call succeeded, but the world did not change.',
      p5: 'When debugging, do not start at the first log line. Find the first broken span. Evidence before it is probably clean; everything after is fallout. Then compare expectation with reality: were the arguments right, was the result empty, did verification ever run?',
      p6: 'In AWS’s postmortem, one anomalous request produced 177 spans over 85,590 ms. Open the waterfall and the story is obvious: the same `fetch_page` repeats and fills nearly the whole timeline. Follow it upward and the root cause is a system prompt saying “never give up.”',
      p7: 'That is the real value of observability: it does not just say “slow,” it says “which link, and why it never stopped.” With a waterfall, 177 spans are a story. Without one, they are 177 lines of log.',
      p8: 'Finally, record decisions. Not the full chain of thought, but one auditable summary: “retrieval failed twice; switch to reading known URLs.” In a future postmortem, that sentence beats ten thousand tokens of inner monologue.',
      tableHead: ['Field', 'Why it matters', 'Example'],
      rows: spanFields.map((f) => [f.field, f.why[lang], f.example]),
      idealTitle: 'A healthy trace: verification, then a finish',
      runawayTitle: 'A runaway trace: 177 spans, 85,590 ms',
      idealSub: '9 spans · 5.1s',
      runawaySub: '177 spans · 85.6s',
      eventTitle: 'An auditable decision event',
      codeCaption: {
        zh: '不记录完整思维链，只记录可复核的决策证据；字段名可按你的 OTel 后端调整。',
        en: 'Do not log full chain-of-thought; log reviewable decision evidence. Field names can follow your OTel backend.',
      },
      calloutTitle: 'Logs say what happened; traces say why',
      callout:
        'Logs give you isolated events. Traces give you a causal chain. Add a decision summary and you can finally answer the most important question: why did it choose this path?',
    },
  }[lang];

  return (
    <Section id="ch9" num="09" title={c.title} kicker={c.kicker} sources={['aws-agentcore-blog', 'aws-agentcore-docs', 'dataiku-observability']}>
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

      <div className="grid gap-3 xl:grid-cols-2">
        <Waterfall title={c.idealTitle} subtitle={c.idealSub} max={5200} rows={idealRows} tone="ok" />
        <Waterfall title={c.runawayTitle} subtitle={c.runawaySub} max={85590} rows={runawayRows} tone="danger" />
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
                  <td key={cell} className={i === 0 ? 'font-mono text-[0.76rem] font-semibold text-[var(--text)]' : ''}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="mb-2 text-[1.05rem] font-bold text-[var(--text)]">{c.eventTitle}</h3>
        <CodeBlock code={eventCode} language="json" filename="decision-event.json" caption={c.codeCaption[lang]} />
      </div>

      <Callout tone="teal" title={c.calloutTitle} icon="🔭">
        {c.callout}
      </Callout>
    </Section>
  );
}
