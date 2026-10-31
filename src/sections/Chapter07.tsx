import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { useLang } from '../i18n/LangContext';

const steps = [
  {
    who: { zh: '用户 → Agent', en: 'User → Agent' },
    what: { zh: '给出目标、约束和可接受的副作用范围', en: 'Provide the goal, constraints and acceptable side effects' },
    tone: 'var(--primary)',
  },
  {
    who: { zh: 'Agent → 中断点', en: 'Agent → Interrupt' },
    what: { zh: '生成计划或准备调用高风险工具，调用 interrupt 暂停', en: 'Produce a plan or prepare a risky tool call, then call interrupt' },
    tone: 'var(--accent)',
  },
  {
    who: { zh: '中断点 → 用户', en: 'Interrupt → User' },
    what: { zh: '状态被持久化；审批界面显示计划、影响范围和回滚方式', en: 'State is persisted; the approval UI shows the plan, blast radius and rollback' },
    tone: 'var(--teal)',
  },
  {
    who: { zh: '用户 → 中断点', en: 'User → Interrupt' },
    what: { zh: '通过 / 修改计划 / 拒绝，三种结果都能恢复执行', en: 'Approve, edit the plan, or reject — all three can resume execution' },
    tone: 'var(--ok)',
  },
  {
    who: { zh: '中断点 → Agent', en: 'Interrupt → Agent' },
    what: { zh: '用 Command(resume=...) 把人工决策送回图里', en: 'Send the human decision back into the graph with Command(resume=...)' },
    tone: 'var(--primary)',
  },
  {
    who: { zh: 'Agent → 工具', en: 'Agent → Tools' },
    what: { zh: '按批准后的计划执行；结果写回持久化状态', en: 'Execute the approved plan; write results back to durable state' },
    tone: 'var(--accent)',
  },
];

const risky = [
  { zh: '付款、退款、转账', en: 'Payments, refunds, transfers' },
  { zh: '删除数据或文件', en: 'Deleting data or files' },
  { zh: '向外发送邮件 / 消息', en: 'Sending external email or messages' },
  { zh: '发布到生产环境', en: 'Deploying to production' },
  { zh: '修改权限与密钥', en: 'Changing permissions or secrets' },
  { zh: '调用第三方写入 API', en: 'Calling third-party write APIs' },
  { zh: '执行任意 shell 命令', en: 'Running arbitrary shell commands' },
  { zh: '签署合同或做出承诺', en: 'Signing contracts or making commitments' },
];

function GateDiagram() {
  const { lang, t } = useLang();

  return (
    <div className="figure">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <span className="chip chip-primary font-mono">{t('HITL 时序', 'HITL SEQUENCE')}</span>
        <span className="text-[0.7rem] text-[var(--muted)]">
          {t('暂停不是结束，状态还在', 'Pausing is not ending; state persists')}
        </span>
      </div>
      <div className="overflow-x-auto">
        <svg viewBox="0 0 780 300" className="min-w-[660px] w-full" role="img" aria-label={t('人在回路的审批时序图', 'Sequence diagram of human-in-the-loop approval')}>
          {[
            { x: 80, label: t('用户', 'User') },
            { x: 300, label: 'Agent' },
            { x: 520, label: t('中断点', 'Interrupt') },
            { x: 710, label: t('工具', 'Tools') },
          ].map((actor) => (
            <g key={actor.x}>
              <rect x={actor.x - 52} y="8" width="104" height="28" rx="8" fill="var(--surface-2)" stroke="var(--line)" />
              <text x={actor.x} y="26" textAnchor="middle" fontSize="11" fill="var(--text)" fontWeight="600">
                {actor.label}
              </text>
              <line x1={actor.x} y1="36" x2={actor.x} y2="282" stroke="var(--line)" strokeDasharray="4 5" />
            </g>
          ))}

          <rect x="272" y="58" width="288" height="180" rx="10" fill="var(--accent-soft)" opacity="0.45" stroke="var(--accent)" strokeDasharray="4 4" />
          <text x="416" y="76" textAnchor="middle" fontSize="9" fill="var(--accent)" fontWeight="700">
            {t('执行暂停，状态写入 checkpointer', 'EXECUTION PAUSED · STATE CHECKPOINTED')}
          </text>

          {[
            { y: 96, from: 80, to: 300, label: t('目标 + 约束', 'Goal + constraints'), color: 'var(--primary)' },
            { y: 126, from: 300, to: 520, label: t('计划 / 高风险调用', 'Plan / risky call'), color: 'var(--primary)' },
            { y: 156, from: 520, to: 80, label: t('审批请求', 'Approval request'), color: 'var(--accent)' },
            { y: 186, from: 80, to: 520, label: t('通过 / 编辑 / 拒绝', 'Approve / edit / reject'), color: 'var(--ok)' },
            { y: 216, from: 520, to: 300, label: 'Command(resume=...)', color: 'var(--teal)' },
            { y: 246, from: 300, to: 710, label: t('执行已批准动作', 'Execute approved action'), color: 'var(--primary)' },
          ].map((arrow) => {
            const dir = arrow.to > arrow.from ? 1 : -1;
            const tipX = arrow.to - dir * 4;
            return (
              <g key={arrow.y}>
                <line x1={arrow.from} y1={arrow.y} x2={tipX - dir * 5} y2={arrow.y} stroke={arrow.color} strokeWidth="1.6" />
                <polygon
                  points={`${tipX},${arrow.y} ${tipX - dir * 6},${arrow.y - 3.5} ${tipX - dir * 6},${arrow.y + 3.5}`}
                  fill={arrow.color}
                />
                <text x={(arrow.from + arrow.to) / 2} y={arrow.y - 5} textAnchor="middle" fontSize="9" fill={arrow.color} fontWeight="600">
                  {arrow.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <figcaption className="figure-caption">
        {t(
          '图 7-1：LangGraph 风格的中断—审批—恢复。关键在于状态持久化，人可以在几小时后回来继续。',
          'Figure 7-1: LangGraph-style interrupt–approve–resume. The key is durable state, so a human can return hours later.',
        )}
      </figcaption>
    </div>
  );
}

const hitlCode = `from typing import TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import InMemorySaver

class State(TypedDict):
    request: str
    plan: list[str]
    approved: bool

def plan_node(state: State):
    return {"plan": make_plan(state["request"])}

def approval_node(state: State):
    # 图在这里暂停；恢复时本节点会从头执行，
    # 所以 interrupt 之前的副作用必须幂等。
    decision = interrupt({
        "type": "approve_plan",
        "plan": state["plan"],
        "actions": ["send_email", "update_crm"],
    })
    return {
        "approved": decision["approved"],
        "plan": decision.get("plan", state["plan"]),
    }

def execute_node(state: State):
    if not state["approved"]:
        return {}
    return {"result": execute(state["plan"])}

builder = StateGraph(State)
builder.add_node("plan", plan_node)
builder.add_node("approve", approval_node)
builder.add_node("execute", execute_node)
builder.add_edge(START, "plan")
builder.add_edge("plan", "approve")
builder.add_edge("approve", "execute")
builder.add_edge("execute", END)

graph = builder.compile(checkpointer=InMemorySaver())
config = {"configurable": {"thread_id": "req-42"}}

graph.invoke({"request": "给客户退款"}, config)          # 第一次：停在 interrupt
graph.invoke(Command(resume={"approved": True}), config)  # 人审后：恢复执行`;

export function Chapter07() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'HUMAN',
      title: '人在回路（HITL）',
      p1: '「全自动」是一个很诱人的词。但现实是：有些动作不该由 Agent 独自决定。退款多少、邮件发给谁、能不能删这张表——这些决定错的成本，远高于多问一句的成本。',
      p2: '人在回路不是加一个「确定吗？」的弹窗。它是一套完整的暂停、持久化、审批、恢复机制：Agent 在关键点停下来，状态被保存，人可以几小时后回来，改完再继续。没有持久化，人一离开，任务就死了。',
      p3: 'LangGraph 的做法是 interrupt：在节点里调用 `interrupt(payload)`，图的执行暂停，payload 交给前端。人做出决策后，用 `Command(resume=decision)` 恢复。这里有一个容易踩的坑：恢复时节点会从头执行，所以 interrupt 之前的代码必须幂等，不能在里面扣款或发消息。',
      p4: '审批界面要给出三样东西：Agent 想做什么、影响范围有多大、出问题怎么回滚。只说「是否批准」是在逼人盲签。更好的设计是把计划摊开，允许人直接编辑，比如把「发给全部用户」改成「先发给测试组」。',
      p5: 'DeerFlow 的 Edit Plan 是个好例子：研究计划生成后，人可以先修改再执行，而不是等 Agent 跑完一整轮才发现方向错了。把人工介入放在计划层，比放在结果层便宜得多。',
      p6: '另一个真实风险是审批疲劳。每个动作都弹窗，人很快就会闭眼点「通过」，HITL 退化成 HITL（Human In The Loop，但人已经睡着了）。把审批集中在不可逆、高金额、跨边界的动作上，低风险操作批量放行。',
      p7: '最后，人工决策本身也要被记录：谁批的、什么时候批的、改了什么。HITL 的价值不只是拦住错误，更是让责任和上下文可追溯。',
      calloutTitle: '默认需要审批的八类动作',
      callout:
        '破坏性、不可逆、涉及钱、涉及外部可见性、涉及权限、涉及法律承诺——满足任何一条，就应该有一个人工闸门，而不是一句「模型觉得没问题」。',
      tableHead: ['模式', '人做什么', '适用场景'],
      rows: [
        ['批准 / 拒绝', '看计划，点通过或打回', '高风险工具调用、发布'],
        ['编辑', '直接修改计划或参数再执行', '研究计划、回复草稿'],
        ['补充输入', '提供 Agent 缺失的信息', '权限、偏好、业务规则'],
        ['逐条审阅', '对每个子动作单独放行', '批量写操作、外部 API'],
        ['升级处理', '转交给更专业的人或系统', '超出 Agent 能力边界'],
      ],
      codeCaption: {
        zh: 'LangGraph interrupt / resume 骨架；`make_plan`、`execute` 由你的业务实现。',
        en: 'LangGraph interrupt / resume skeleton; `make_plan` and `execute` come from your domain.',
      },
      riskyTitle: '这八类动作，别让 Agent 自己拍板',
    },
    en: {
      kicker: 'HUMAN',
      title: 'Human in the loop',
      p1: '“Fully autonomous” is a seductive phrase. Reality says otherwise: some actions should not be decided by an agent alone. How much to refund, who receives the email, whether this table can be dropped — the cost of a wrong decision far exceeds the cost of asking.',
      p2: 'Human-in-the-loop is not a “are you sure?” popup. It is a complete pause–persist–approve–resume mechanism: the agent stops at a key point, state is saved, a human can return hours later, edit, and continue. Without persistence, the task dies the moment the human walks away.',
      p3: 'LangGraph does this with interrupt: call `interrupt(payload)` inside a node, execution pauses, and the payload goes to the UI. After a decision, resume with `Command(resume=decision)`. One easy trap: on resume the node re-executes from the start, so code before interrupt must be idempotent. Do not charge a card or send a message there.',
      p4: 'An approval UI must show three things: what the agent wants to do, the blast radius, and how to roll back. Asking “approve?” alone forces a blind signature. Better: lay out the plan and let the human edit it — change “send to all users” into “send to the test group first.”',
      p5: 'DeerFlow’s Edit Plan is a good example: after the research plan is generated, a human can revise it before execution, instead of discovering the wrong direction after a full run. Intervening at the plan layer is much cheaper than at the result layer.',
      p6: 'Another real risk is approval fatigue. Pop up a dialog for every action and people will soon click approve with their eyes closed; HITL degrades into a human who is technically in the loop but asleep. Concentrate approvals on irreversible, high-value, boundary-crossing actions, and batch low-risk ones.',
      p7: 'Finally, record the human decision itself: who approved, when, and what changed. The value of HITL is not only stopping mistakes; it is making responsibility and context traceable.',
      calloutTitle: 'Eight actions that should require approval by default',
      callout:
        'Destructive, irreversible, involving money, externally visible, touching permissions, or creating legal commitments — if any applies, there should be a human gate, not a “the model thinks it is fine.”',
      tableHead: ['Pattern', 'What the human does', 'Best for'],
      rows: [
        ['Approve / reject', 'Read the plan, approve or send back', 'Risky tool calls, releases'],
        ['Edit', 'Modify the plan or arguments, then execute', 'Research plans, reply drafts'],
        ['Supply input', 'Provide information the agent lacks', 'Permissions, preferences, business rules'],
        ['Item-by-item', 'Release each sub-action individually', 'Bulk writes, external APIs'],
        ['Escalate', 'Hand off to a specialist or system', 'Beyond the agent’s boundary'],
      ],
      codeCaption: {
        zh: 'LangGraph interrupt / resume 骨架；`make_plan`、`execute` 由你的业务实现。',
        en: 'LangGraph interrupt / resume skeleton; `make_plan` and `execute` come from your domain.',
      },
      riskyTitle: 'Eight actions the agent should not decide alone',
    },
  }[lang];

  return (
    <Section
      id="ch7"
      num="07"
      title={c.title}
      kicker={c.kicker}
      sources={['langgraph-hitl', 'langgraph-interrupts', 'infoq-deerflow-hitl', 'langgraph-platform']}
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

      <GateDiagram />

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

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <CodeBlock code={hitlCode} language="python" filename="hitl_graph.py" caption={c.codeCaption[lang]} />
        <div className="card p-4">
          <h3 className="mb-2 text-[0.92rem] font-bold text-[var(--text)]">{c.riskyTitle}</h3>
          <ul className="grid gap-1.5">
            {risky.map((item) => (
              <li key={item.en} className="flex items-start gap-2 text-[0.78rem] leading-relaxed text-[var(--text-soft)]">
                <span className="mt-1 text-[var(--accent)]" aria-hidden="true">
                  ▲
                </span>
                {item[lang]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Callout tone="warn" title={c.calloutTitle} icon="🖐️">
        {c.callout}
      </Callout>

      <Callout tone="teal" title={lang === 'zh' ? 'DeerFlow 的 Edit Plan' : 'DeerFlow’s Edit Plan'} icon="📝">
        {lang === 'zh'
          ? 'DeerFlow 在深度研究流程里把计划交给用户修改后再执行。这个设计的妙处在于：人改的是「方向」，不是「结果」；成本低，而且保留了人的判断。'
          : 'DeerFlow lets the user revise the research plan before execution. The beauty is that the human changes the direction, not the output: cheap, and it preserves human judgment.'}
      </Callout>
    </Section>
  );
}
