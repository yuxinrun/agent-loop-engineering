import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { useLang } from '../i18n/LangContext';

const TURNS = Array.from({ length: 21 }, (_, i) => i);
const Y_MAX = 360;
const LIMIT = 128;

const layers = [
  { key: 'system', color: 'var(--chart-5)', label: { zh: '系统提示', en: 'System prompt' } },
  { key: 'conversation', color: 'var(--chart-1)', label: { zh: '对话', en: 'Conversation' } },
  { key: 'tools', color: 'var(--chart-2)', label: { zh: '工具返回', en: 'Tool output' } },
  { key: 'docs', color: 'var(--chart-3)', label: { zh: '检索资料', en: 'Retrieved docs' } },
];

function unmanagedValues(turn: number) {
  return {
    system: 12,
    conversation: 3 * turn,
    tools: 9 * turn,
    docs: 4 * turn,
  };
}

function managedValues(turn: number) {
  const phase = turn % 5;
  return {
    system: 12,
    conversation: 6 + 4 * phase,
    tools: 4 + 18 * phase,
    docs: 3 + 4 * phase,
  };
}

function StackChart({ managed }: { managed: boolean }) {
  const { lang, t } = useLang();
  const width = 560;
  const height = 250;
  const padL = 34;
  const padR = 10;
  const padT = 14;
  const padB = 26;
  const plotW = width - padL - padR;
  const plotH = height - padT - padB;
  const x = (turn: number) => padL + (turn / 20) * plotW;
  const y = (value: number) => padT + plotH - (Math.min(value, Y_MAX) / Y_MAX) * plotH;

  let cumulative = TURNS.map(() => 0);
  const areas = layers.map((layer) => {
    const lower = [...cumulative];
    const values = TURNS.map((turn) => (managed ? managedValues(turn) : unmanagedValues(turn))[layer.key as keyof ReturnType<typeof managedValues>]);
    cumulative = cumulative.map((base, i) => base + values[i]);
    const upper = [...cumulative];
    const top = upper.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`);
    const bottom = [...lower].reverse().map((v, i) => `${x(20 - i).toFixed(1)},${y(v).toFixed(1)}`);
    return { ...layer, points: [...top, ...bottom].join(' ') };
  });

  const finalTotal = cumulative[20];
  const limitY = y(LIMIT);

  return (
    <div className="min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="text-[0.74rem] font-bold"
          style={{ color: managed ? 'var(--ok)' : 'var(--danger)' }}
        >
          {managed ? t('压缩 + 交接后', 'With compaction + handoff') : t('什么都不做', 'Do nothing')}
        </span>
        <span className="font-mono text-[0.64rem] text-[var(--muted)]">
          {t('末期', 'End')} {finalTotal}K
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label={managed ? t('治理后的上下文占用堆叠面积图', 'Stacked context usage chart after compaction') : t('未治理的上下文占用堆叠面积图', 'Stacked context usage chart without compaction')}>
        <line x1={padL} y1={padT + plotH} x2={width - padR} y2={padT + plotH} stroke="var(--line)" />
        <line x1={padL} y1={padT} x2={padL} y2={padT + plotH} stroke="var(--line)" />

        {areas.map((area) => (
          <polygon key={area.key} points={area.points} fill={area.color} opacity="0.82" />
        ))}

        <line
          x1={padL}
          y1={limitY}
          x2={width - padR}
          y2={limitY}
          stroke="var(--danger)"
          strokeWidth="1.4"
          strokeDasharray="5 4"
        />
        <text x={width - padR - 2} y={limitY - 5} textAnchor="end" fontSize="9" fill="var(--danger)">
          {t('预算 128K', 'Budget 128K')}
        </text>

        {[0, 100, 200, 300].map((tick) => (
          <g key={tick}>
            <line x1={padL} y1={y(tick)} x2={width - padR} y2={y(tick)} stroke="var(--line)" opacity="0.35" />
            <text x={padL - 6} y={y(tick) + 3} textAnchor="end" fontSize="8.5" fill="var(--muted)">
              {tick}K
            </text>
          </g>
        ))}

        {[0, 5, 10, 15, 20].map((turn) => (
          <text key={turn} x={x(turn)} y={height - 8} textAnchor="middle" fontSize="8.5" fill="var(--muted)">
            {turn}
          </text>
        ))}

        {managed &&
          [5, 10, 15].map((turn) => (
            <g key={turn}>
              <line x1={x(turn)} y1={padT} x2={x(turn)} y2={padT + plotH} stroke="var(--primary)" strokeDasharray="2 4" opacity="0.55" />
              <text x={x(turn)} y={padT + 8} textAnchor="middle" fontSize="9" fill="var(--primary-strong)">
                ↺
              </text>
            </g>
          ))}
      </svg>
    </div>
  );
}

function ContextChart() {
  const { lang, t } = useLang();

  return (
    <div className="figure">
      <div className="grid gap-5 lg:grid-cols-2">
        <StackChart managed={false} />
        <StackChart managed />
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-dashed border-[var(--line)] pt-3">
        {layers.map((layer) => (
          <span key={layer.key} className="flex items-center gap-1.5 text-[0.7rem] text-[var(--muted)]">
            <i className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: layer.color }} aria-hidden="true" />
            {layer.label[lang]}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-[0.7rem] text-[var(--muted)]">
          <i className="inline-block h-0.5 w-4 bg-[var(--danger)]" aria-hidden="true" />
          {t('预算上限', 'Budget ceiling')}
        </span>
      </div>
      <figcaption className="figure-caption">
        {t(
          '图 5-1：同样是 20 轮，不治理会越过 128K 预算；每 5 轮压缩并交接一次，占用被锯齿状拉回安全区。',
          'Figure 5-1: over 20 turns, doing nothing crosses the 128K budget; compacting and handing off every five turns saws usage back into the safe zone.',
        )}
      </figcaption>
    </div>
  );
}

export function Chapter05() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'CONTEXT',
      title: '上下文窗口生存指南',
      p1: '上下文窗口是 Agent 的工作记忆。绝大多数新手会把它当仓库用：读完的文件塞进去，工具返回塞进去，历史对话也塞进去。几轮之后，窗口满了，Agent 开始变笨，但没人知道为什么。',
      p2: '128K 听起来很多，直到你发现：一个中型文件 20K，一次测试日志 10K，一个网页正文 8K。六轮之后，你已经在预算边缘反复横跳，而模型还在被要求「再仔细看看」。',
      p3: '第一种生存策略是裁剪（prune）。工具返回读完了就删掉正文，只留一句结论和一个可回查的引用；旧对话只保留决策和未决问题；固定的系统约束放在最前面，不要每轮重复。上下文不是越多越好，而是越相关越好。',
      p4: '第二种是摘要（summarize）。到阈值时做一次滚动压缩，但别让模型自由发挥。给它一个结构化模板：目标是什么、已确认的事实、做过的决策、失败的尝试、还没解决的问题。这样压出来的是状态，不是散文。',
      p5: '第三种是交接（handoff）。把子任务交给一个全新上下文的子 Agent，它只拿到一份简报，干完只返回压缩后的结果。主循环的上下文保持干净，子 Agent 的混乱留在自己的沙箱里。这是「隔离」而不是「更多记忆」。',
      p6: '压缩有代价：细节会丢。所以重要的产物要落到上下文之外——文件、数据库、工单、diff。Agent 可以忘，系统不能忘。真正可靠的记忆，是它可以随时重新读回来的东西。',
      p7: '工程上给自己留三档水位：60% 开始规划压缩，75% 必须压缩，90% 停止接新工具调用，先整理现场。别等爆了再想办法，那时候连「之前为什么这么改」都已经被挤出窗口了。',
      calloutTitle: '上下文是预算，不是仓库',
      callout:
        '每往窗口里放一段内容，都要问：它会影响下一步决策吗？如果不会，就别放。省下来的 token，不是省钱，是省下模型的注意力。',
      tableHead: ['策略', '具体做法', '代价', '最适合'],
      rows: [
        ['裁剪 Prune', '删旧工具输出、保留引用、最近 N 轮原文', '可能丢细节', '工具返回很长的任务'],
        ['摘要 Summarize', '结构化滚动摘要：目标、事实、决策、失败、待办', '摘要本身可能失真', '多轮长对话'],
        ['交接 Handoff', '子 Agent 隔离上下文，只回传压缩结果', '需要设计简报协议', '可拆分的子任务'],
        ['外置 Externalize', '文件、数据库、工单、diff 作为长期记忆', '需要读写与权限设计', '长时自治任务'],
      ],
      cardTitle: '压缩模板长这样',
      template: [
        ['目标', '用户到底要什么，验收标准是什么'],
        ['已确认事实', '读过的关键文件、接口、数据'],
        ['已做决策', '选了什么方案，为什么'],
        ['失败尝试', '试过但没用的路径，避免重蹈覆辙'],
        ['未决问题', '下一步必须回答的问题'],
        ['产物位置', '文件路径、PR、工单号'],
      ],
    },
    en: {
      kicker: 'CONTEXT',
      title: 'Surviving the context window',
      p1: 'The context window is the agent’s working memory. Most beginners treat it as a warehouse: dump in every file read, every tool result, every prior turn. A few turns later the window is full, the agent gets dumber, and nobody knows why.',
      p2: '128K sounds generous until you notice: a medium file is 20K, a test log is 10K, a web page is 8K. Six turns in, you are dancing on the budget line while still asking the model to “take another careful look.”',
      p3: 'The first survival strategy is pruning. Once a tool result has been read, drop the body and keep a conclusion plus a retrievable reference. Keep decisions and open questions from old turns, not the whole transcript. Put stable system constraints up front instead of repeating them. More context is not better; more relevant context is.',
      p4: 'The second is summarization. Compact at a threshold, but do not let the model freestyle. Give it a structured template: goal, confirmed facts, decisions, failed attempts, open questions. What comes out should be state, not prose.',
      p5: 'The third is handoff. Give a subtask to a sub-agent with a fresh context. It receives a brief, and returns only a compressed result. The main loop stays clean; the sub-agent’s mess stays in its own sandbox. This is isolation, not more memory.',
      p6: 'Compression has a cost: detail is lost. So persist important artifacts outside the context — files, databases, tickets, diffs. The agent may forget; the system must not. Reliable memory is something the agent can always read back.',
      p7: 'Set three watermarks: plan compaction at 60%, compact at 75%, and at 90% stop accepting new tool calls and tidy the scene. Do not wait for the overflow; by then even “why we changed this” has been pushed out of the window.',
      calloutTitle: 'Context is a budget, not a warehouse',
      callout:
        'Before adding anything to the window, ask: will this change the next decision? If not, leave it out. The tokens you save are not just money; they are model attention.',
      tableHead: ['Strategy', 'What it does', 'Cost', 'Best for'],
      rows: [
        ['Prune', 'Drop old tool bodies, keep references and the last N turns', 'May lose detail', 'Tasks with long tool output'],
        ['Summarize', 'Structured rolling summary: goal, facts, decisions, failures, open items', 'The summary can drift', 'Long multi-turn dialogue'],
        ['Handoff', 'Isolate a sub-agent and return only a compressed result', 'Needs a brief protocol', 'Splittable subtasks'],
        ['Externalize', 'Files, databases, tickets and diffs as long-term memory', 'Read/write and permission design', 'Long-running autonomy'],
      ],
      cardTitle: 'A compaction template',
      template: [
        ['Goal', 'What the user actually wants; the acceptance criteria'],
        ['Confirmed facts', 'Key files, interfaces and data already read'],
        ['Decisions', 'What was chosen and why'],
        ['Failed attempts', 'Paths that did not work, so they are not repeated'],
        ['Open questions', 'What must be answered next'],
        ['Artifacts', 'File paths, PRs, ticket IDs'],
      ],
    },
  }[lang];

  return (
    <Section
      id="ch5"
      num="05"
      title={c.title}
      kicker={c.kicker}
      sources={['anthropic-context', 'claude-sdk-overview', 'microsoft-agent-framework']}
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

      <ContextChart />

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

      <div className="card p-4">
        <h3 className="mb-3 text-[0.95rem] font-bold text-[var(--text)]">{c.cardTitle}</h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {c.template.map(([key, value]) => (
            <div key={key} className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2">
              <div className="font-mono text-[0.62rem] uppercase tracking-wider text-[var(--primary-strong)]">{key}</div>
              <div className="mt-0.5 text-[0.76rem] leading-relaxed text-[var(--text-soft)]">{value}</div>
            </div>
          ))}
        </div>
      </div>

      <Callout tone="teal" title={c.calloutTitle} icon="🧠">
        {c.callout}
      </Callout>
    </Section>
  );
}
