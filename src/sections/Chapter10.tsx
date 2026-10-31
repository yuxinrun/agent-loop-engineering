import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { useLang } from '../i18n/LangContext';

const TURNS = Array.from({ length: 21 }, (_, i) => i);
const PRICE = 0.08;
const GROWTH = 0.03;
const CAP_TURN = 12;
const BUDGET = 3;

function turnCost(turn: number) {
  return PRICE + GROWTH * (turn - 1);
}

function cumulative(turn: number) {
  return TURNS.slice(1, turn + 1).reduce((sum, t) => sum + turnCost(t), 0);
}

function CostChart() {
  const { lang, t } = useLang();
  const width = 620;
  const height = 280;
  const padL = 40;
  const padR = 16;
  const padT = 22;
  const padB = 32;
  const yMax = 9;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const x = (turn: number) => padL + (turn / 20) * plotW;
  const y = (usd: number) => padT + plotH - (usd / yMax) * plotH;

  const uncappedPath = TURNS.map((turn) => `${x(turn).toFixed(1)},${y(cumulative(turn)).toFixed(1)}`).join(' ');
  const cappedTurns = TURNS.filter((turn) => turn <= CAP_TURN);
  const cappedPath = cappedTurns.map((turn) => `${x(turn).toFixed(1)},${y(cumulative(turn)).toFixed(1)}`).join(' ');
  const endUncapped = cumulative(20);
  const endCapped = cumulative(CAP_TURN);

  return (
    <div className="figure">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="chip chip-primary font-mono">{t('累计成本曲线', 'CUMULATIVE COST')}</span>
        <span className="text-[0.68rem] text-[var(--muted)]">
          {t('示意：单轮成本随上下文增长', 'Illustrative: per-turn cost grows with context')}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={t('无上限与 12 轮硬停的累计成本对比图', 'Cumulative cost with and without a 12-turn cap')}>
        {[0, 2, 4, 6, 8].map((tick) => (
          <g key={tick}>
            <line x1={padL} y1={y(tick)} x2={width - padR} y2={y(tick)} stroke="var(--line)" opacity="0.5" />
            <text x={padL - 6} y={y(tick) + 3} textAnchor="end" fontSize="9" fill="var(--muted)">
              ${tick}
            </text>
          </g>
        ))}

        <line x1={padL} y1={y(BUDGET)} x2={width - padR} y2={y(BUDGET)} stroke="var(--accent)" strokeDasharray="6 4" strokeWidth="1.3" />
        <text x={width - padR - 2} y={y(BUDGET) - 5} textAnchor="end" fontSize="9" fill="var(--accent)" fontWeight="600">
          {t('预算 $3', 'Budget $3')}
        </text>

        <polyline points={uncappedPath} fill="none" stroke="var(--danger)" strokeWidth="2.2" strokeLinejoin="round" />
        <polyline points={cappedPath} fill="none" stroke="var(--ok)" strokeWidth="2.2" strokeLinejoin="round" />

        <circle cx={x(20)} cy={y(endUncapped)} r="3.5" fill="var(--danger)" />
        <text x={x(20) - 4} y={y(endUncapped) - 8} textAnchor="end" fontSize="9" fill="var(--danger)" fontWeight="700">
          ${endUncapped.toFixed(2)}
        </text>

        <circle cx={x(CAP_TURN)} cy={y(endCapped)} r="3.5" fill="var(--ok)" />
        <text x={x(CAP_TURN) + 4} y={y(endCapped) + 13} fontSize="9" fill="var(--ok)" fontWeight="700">
          {t('12 轮硬停 · ', 'Hard stop at 12 · ')}${endCapped.toFixed(2)}
        </text>

        {[0, 5, 10, 15, 20].map((turn) => (
          <text key={turn} x={x(turn)} y={height - 10} textAnchor="middle" fontSize="9" fill="var(--muted)">
            {turn}
          </text>
        ))}
        <text x={width / 2} y={height - 0.5} textAnchor="middle" fontSize="8" fill="var(--muted)">
          {t('轮次', 'Turn')}
        </text>
      </svg>
      <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-2">
        <span className="flex items-center gap-1.5 text-[0.7rem] text-[var(--muted)]">
          <i className="h-0.5 w-5 bg-[var(--danger)]" aria-hidden="true" />
          {t('无上限：越转越贵', 'Uncapped: each turn costs more')}
        </span>
        <span className="flex items-center gap-1.5 text-[0.7rem] text-[var(--muted)]">
          <i className="h-0.5 w-5 bg-[var(--ok)]" aria-hidden="true" />
          {t('12 轮硬停', '12-turn hard stop')}
        </span>
      </div>
      <figcaption className="figure-caption">
        {t(
          '图 10-1：每一轮都要重新发送上下文，单轮成本随轮次上升，累计成本近似二次增长。上限不是省钱技巧，是成本模型的一部分。',
          'Figure 10-1: every turn resends the context, so per-turn cost rises and cumulative cost grows roughly quadratically. A cap is not a trick; it is part of the cost model.',
        )}
      </figcaption>
    </div>
  );
}

const fuses = [
  {
    key: 'iterations',
    name: 'maxIterations',
    caps: { zh: '最多转几圈', en: 'How many turns' },
    when: { zh: '进入下一轮之前', en: 'Before entering the next turn' },
    pitfall: { zh: '设得太低，正常任务被截断', en: 'Too low truncates legitimate work' },
  },
  {
    key: 'tokens',
    name: 'maxTokens',
    caps: { zh: '累计输入 + 输出 token', en: 'Cumulative input + output tokens' },
    when: { zh: '每次模型调用前 / 后', en: 'Before or after each model call' },
    pitfall: { zh: '只限单次输出，不限累计', en: 'Capping one response but not the total' },
  },
  {
    key: 'wallclock',
    name: 'maxWallClockMs',
    caps: { zh: '墙钟总时长', en: 'Total wall-clock time' },
    when: { zh: '每轮检查，配合超时中断', en: 'Every turn, paired with a timeout' },
    pitfall: { zh: '无法中断正在进行的调用', en: 'Cannot interrupt an in-flight call' },
  },
  {
    key: 'abort',
    name: 'AbortSignal',
    caps: { zh: '外部取消信号', en: 'External cancellation' },
    when: { zh: '用户点停止、上游断连', en: 'User hits stop, upstream disconnects' },
    pitfall: { zh: '创建了 signal 却没传进 SDK', en: 'Creating the signal but never passing it to the SDK' },
  },
];

const tiers = [
  {
    tier: { zh: '路由器', en: 'Router' },
    model: { zh: '小模型 / 规则', en: 'Small model / rules' },
    job: { zh: '分类、意图识别、选择工具集', en: 'Classify, detect intent, select a toolset' },
    share: '5–10%',
  },
  {
    tier: { zh: '规划器', en: 'Planner' },
    model: { zh: '大模型', en: 'Large model' },
    job: { zh: '拆解目标、制定计划、处理分歧', en: 'Decompose goals, plan, resolve ambiguity' },
    share: '40–50%',
  },
  {
    tier: { zh: '执行器', en: 'Executor' },
    model: { zh: '中模型', en: 'Medium model' },
    job: { zh: '调用工具、按步骤执行、整理结果', en: 'Call tools, execute steps, organize results' },
    share: '30–40%',
  },
  {
    tier: { zh: '验证器', en: 'Verifier' },
    model: { zh: '独立中模型 + 测试', en: 'Independent model + tests' },
    job: { zh: '按 rubric 挑刺，不参与生成', en: 'Critique against a rubric without generating' },
    share: '10–15%',
  },
  {
    tier: { zh: '摘要器', en: 'Summarizer' },
    model: { zh: '小模型', en: 'Small model' },
    job: { zh: '压缩上下文、生成决策记录', en: 'Compact context, produce decision records' },
    share: '5%',
  },
];

const budgetCode = `import type { ModelClient } from "./model"; // 你的 SDK 适配层

const controller = new AbortController();
const budget = {
  maxIterations: 12,
  maxTokens: 120_000,
  maxWallClockMs: 120_000,
  signal: controller.signal,
};

let usedTokens = 0;
const startedAt = Date.now();

for (let turn = 1; turn <= budget.maxIterations; turn++) {
  if (budget.signal.aborted) throw new Error("ABORTED");
  if (Date.now() - startedAt > budget.maxWallClockMs) {
    controller.abort("wall_clock");
    throw new Error("WALL_CLOCK_EXCEEDED");
  }

  const response = await model.call(messages, { signal: budget.signal });
  usedTokens += response.usage.input + response.usage.output;

  if (usedTokens > budget.maxTokens) {
    controller.abort("token_budget");
    throw new Error("TOKEN_BUDGET_EXCEEDED");
  }

  if (response.type === "finish") return response.answer;
  messages.push(...response.messages);
}

throw new Error("ITERATION_LIMIT");`;

export function Chapter10() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'COST',
      title: '成本与性能工程',
      p1: 'Agent 的成本不是「单价 × 次数」这么简单。每一轮都要把历史上下文重新发给模型，轮次越多，单轮输入越大，累计成本接近二次增长。你不控制轮次，就是在给一条向上弯曲的曲线签字。',
      p2: '假设第一轮成本 8 美分，之后每轮因为上下文变长再多 3 美分。跑到第 20 轮，累计约 7.9 美元；在第 12 轮硬停，累计约 2.9 美元。差的不是一倍，是两倍多。而这还没算工具调用、检索和重试。',
      p3: '第一道保险丝是 `maxIterations`：最多转几圈。它最粗暴，也最有效。关键是配合「有意义的停止」——如果 12 轮还没完成，应该返回一个可诊断的中间状态，而不是静默截断。',
      p4: '第二道是 `maxTokens`：累计 token 预算。注意是累计，不是单次输出上限。很多团队只限制了模型的单次回答长度，却让输入 token 一路膨胀，账单该炸还是炸。',
      p5: '第三道是 `maxWallClockMs`：墙钟时间。它防的不是模型慢，而是卡住：工具不返回、网络挂起、重试风暴。时间闸必须配合超时中断，否则它只能在一轮结束后才发现「已经超时了」。',
      p6: '第四道是 `AbortSignal`：外部取消。用户点停止、上游断连、部署回滚，都应该能立刻叫停。最常见的 bug 是创建了 signal，却忘了把它传进模型和工具的调用里——于是取消按钮只是一个装饰。',
      p7: '控制成本还有两个杠杆。第一是模型分层：路由、抽取、摘要用小模型，规划和难题用大模型，验证器用独立模型。第二是减少重复：缓存提示词与检索结果、并行独立工具调用、把工具返回裁到必要字段。',
      p8: '最后记住：性能不是让 Agent 更快地转圈，而是让它更少地转圈。一次做对，比十次快速重试便宜得多。',
      calloutTitle: '成本是设计出来的，不是省出来的',
      callout:
        '在写第一行循环代码之前，就把四道保险丝接上。事后加预算，通常是在账单出来之后；事前加预算，才是工程。',
      tableHead: ['保险丝', '限制什么', '何时触发', '常见坑'],
      rows: fuses.map((f) => [f.name, f.caps[lang], f.when[lang], f.pitfall[lang]]),
      tierTitle: '模型分层：把贵的能力用在刀刃上',
      tierHead: ['层级', '模型', '职责', '成本占比'],
      tierRows: tiers.map((tier) => [tier.tier[lang], tier.model[lang], tier.job[lang], tier.share]),
      codeCaption: {
        zh: '四道保险丝的最小骨架；`model.call` 由你替换为实际 SDK。',
        en: 'A minimal skeleton for the four fuses; replace `model.call` with your actual SDK.',
      },
      extraTitle: '还有三个便宜的杠杆',
      extra: [
        { zh: '提示词缓存：稳定前缀缓存，能显著降低重复输入的单价。', en: 'Prompt caching: a stable prefix cuts the price of repeated input.' },
        { zh: '工具结果裁剪：只回传决策需要的字段，别把整页 HTML 塞回去。', en: 'Trim tool results to fields needed for the decision; do not return full HTML.' },
        { zh: '并行独立调用：互不依赖的工具并发执行，缩短墙钟但不增加 token。', en: 'Parallelize independent tools: shorter wall clock, no extra tokens.' },
      ],
    },
    en: {
      kicker: 'COST',
      title: 'Cost and performance engineering',
      p1: 'Agent cost is not “unit price × calls.” Every turn resends the history, so later turns have larger inputs and cumulative cost grows roughly quadratically. If you do not control turns, you are signing off on a curve that bends upward.',
      p2: 'Suppose turn one costs 8 cents, and each later turn costs 3 cents more as context grows. At turn 20, cumulative cost is about $7.90. Hard-stopped at 12, it is about $2.90. Not double — more than double. And that ignores tools, retrieval and retries.',
      p3: 'The first fuse is `maxIterations`: how many turns. It is blunt and effective. Pair it with a meaningful stop: if 12 turns are not enough, return a diagnosable intermediate state instead of silently truncating.',
      p4: 'The second is `maxTokens`: a cumulative token budget. Cumulative, not a per-response cap. Many teams limit answer length while input tokens balloon, and the bill still explodes.',
      p5: 'The third is `maxWallClockMs`: wall-clock time. It guards against getting stuck, not slow thinking: hung tools, stalled networks, retry storms. Pair it with timeout interruption, or it only discovers the overrun after a turn ends.',
      p6: 'The fourth is `AbortSignal`: external cancellation. A user hitting stop, an upstream disconnect, a rollback — all should halt immediately. The most common bug is creating the signal and forgetting to pass it into model and tool calls, making the cancel button decorative.',
      p7: 'Two more levers. First, model tiering: small models for routing, extraction and summaries; large models for planning and hard reasoning; an independent model for verification. Second, reduce repetition: cache prompts and retrieval, parallelize independent tools, trim tool results.',
      p8: 'Finally: performance is not making the agent spin faster; it is making it spin less. Getting it right once is cheaper than retrying quickly ten times.',
      calloutTitle: 'Cost is designed, not pinched',
      callout:
        'Wire the four fuses before writing the first loop line. Adding a budget afterward usually happens after the bill; adding it beforehand is engineering.',
      tableHead: ['Fuse', 'What it caps', 'When it fires', 'Common pitfall'],
      rows: fuses.map((f) => [f.name, f.caps[lang], f.when[lang], f.pitfall[lang]]),
      tierTitle: 'Model tiering: spend the expensive capability where it matters',
      tierHead: ['Tier', 'Model', 'Job', 'Cost share'],
      tierRows: tiers.map((tier) => [tier.tier[lang], tier.model[lang], tier.job[lang], tier.share]),
      codeCaption: {
        zh: '四道保险丝的最小骨架；`model.call` 由你替换为实际 SDK。',
        en: 'A minimal skeleton for the four fuses; replace `model.call` with your actual SDK.',
      },
      extraTitle: 'Three more cheap levers',
      extra: [
        { zh: '提示词缓存：稳定前缀缓存，能显著降低重复输入的单价。', en: 'Prompt caching: a stable prefix cuts the price of repeated input.' },
        { zh: '工具结果裁剪：只回传决策需要的字段，别把整页 HTML 塞回去。', en: 'Trim tool results to fields needed for the decision; do not return full HTML.' },
        { zh: '并行独立调用：互不依赖的工具并发执行，缩短墙钟但不增加 token。', en: 'Parallelize independent tools: shorter wall clock, no extra tokens.' },
      ],
    },
  }[lang];

  return (
    <Section id="ch10" num="10" title={c.title} kicker={c.kicker} sources={['anthropic-agents', 'aws-agentcore-blog', 'openai-guide']}>
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

      <CostChart />

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
                  <td key={cell} className={i === 0 ? 'font-mono text-[0.78rem] font-semibold text-[var(--text)]' : ''}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Callout tone="warn" title={c.calloutTitle} icon="💰">
        {c.callout}
      </Callout>

      <div>
        <h3 className="mb-3 text-[1.05rem] font-bold text-[var(--text)]">{c.tierTitle}</h3>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                {c.tierHead.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.tierRows.map((row) => (
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
      </div>

      <div>
        <h3 className="mb-2 text-[1.05rem] font-bold text-[var(--text)]">{c.extraTitle}</h3>
        <ul className="prose-block mb-3 list-disc">
          {c.extra.map((item) => (
            <li key={item.en}>{item[lang]}</li>
          ))}
        </ul>
        <CodeBlock code={budgetCode} language="typescript" filename="loop-budget.ts" caption={c.codeCaption[lang]} />
      </div>
    </Section>
  );
}
