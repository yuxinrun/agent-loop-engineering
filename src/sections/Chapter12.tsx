import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { useLang } from '../i18n/LangContext';

const rows = [
  {
    name: 'Claude Agent SDK',
    kind: { zh: 'Harness / SDK', en: 'Harness / SDK' },
    core: { zh: 'Agent 循环 + 工具 + hooks + 权限 + 子 Agent', en: 'Agent loop + tools + hooks + permissions + subagents' },
    strong: { zh: '编码、文件系统、本地自动化；开箱即用的循环', en: 'Coding, filesystem and local automation; a ready-made loop' },
    caution: { zh: '与 Claude 生态绑定较深', en: 'Tied closely to the Claude ecosystem' },
  },
  {
    name: 'OpenAI Agents SDK',
    kind: { zh: 'Harness / SDK', en: 'Harness / SDK' },
    core: { zh: 'Agent、handoff、guardrail、session、tracing', en: 'Agents, handoffs, guardrails, sessions, tracing' },
    strong: { zh: '多 Agent 路由、任务交接、工具审批', en: 'Multi-agent routing, handoffs, tool approvals' },
    caution: { zh: '对比时注意与编排层的职责重叠', en: 'Watch the overlap with orchestration layers' },
  },
  {
    name: 'LangGraph',
    kind: { zh: '编排层', en: 'Orchestration' },
    core: { zh: '图状态、checkpoint、interrupt、持久化执行', en: 'Graph state, checkpoints, interrupts, durable execution' },
    strong: { zh: '复杂分支、人在回路、长时任务恢复', en: 'Complex branching, HITL, long-running recovery' },
    caution: { zh: '简单线性循环会被抽象拖重', en: 'A simple linear loop gets weighed down by abstraction' },
  },
  {
    name: 'Microsoft Agent Framework',
    kind: { zh: '编排层', en: 'Orchestration' },
    core: { zh: 'Agent + workflow、状态管理、长时运行', en: 'Agents + workflows, state management, long-running work' },
    strong: { zh: '.NET / Azure 企业栈；工作流与 Agent 混合', en: '.NET / Azure enterprise stack; mixed workflows and agents' },
    caution: { zh: '生态收益与生态约束并存', en: 'Ecosystem benefits come with ecosystem constraints' },
  },
  {
    name: '火山引擎 AgentKit',
    kind: { zh: '平台层', en: 'Platform' },
    core: { zh: '身份权限、安全隔离、观测与部署底座', en: 'Identity, isolation, observability and deployment' },
    strong: { zh: '国内企业私有化部署与合规场景', en: 'Private deployment and compliance in China' },
    caution: { zh: '平台能力越强，迁移成本越高', en: 'The stronger the platform, the higher the migration cost' },
  },
  {
    name: 'Tongyi DeepResearch',
    kind: { zh: '参考实现', en: 'Reference implementation' },
    core: { zh: '规划、检索、综合的多 Agent 研究流程', en: 'Planning, retrieval and synthesis across agents' },
    strong: { zh: '学习深度研究的循环与角色拆分', en: 'Learn the loop and role split of deep research' },
    caution: { zh: '是架构参考，不是通用编排框架', en: 'An architecture reference, not a general orchestrator' },
  },
  {
    name: 'UI-TARS',
    kind: { zh: 'GUI 模型', en: 'GUI model' },
    core: { zh: '看屏幕、理解界面、输出操作动作', en: 'See the screen, understand the UI, emit actions' },
    strong: { zh: '桌面 / 浏览器自动化；观察—行动循环', en: 'Desktop / browser automation; observe–act loop' },
    caution: { zh: '不是编排框架，需要外层循环配合', en: 'Not an orchestrator; it needs an outer loop' },
  },
];

const layers = [
  {
    label: { zh: '平台层', en: 'Platform' },
    hint: { zh: '部署、身份、隔离、观测', en: 'Deploy, identity, isolation, observability' },
    items: ['LangGraph Platform', 'Volcengine AgentKit'],
    color: 'var(--chart-4)',
  },
  {
    label: { zh: '编排层', en: 'Orchestration' },
    hint: { zh: '状态机、持久化、分支、中断', en: 'State machines, durability, branching, interrupts' },
    items: ['LangGraph', 'Microsoft Agent Framework'],
    color: 'var(--teal)',
  },
  {
    label: { zh: 'Harness / SDK', en: 'Harness / SDK' },
    hint: { zh: '循环、工具、权限、会话', en: 'Loop, tools, permissions, sessions' },
    items: ['Claude Agent SDK', 'OpenAI Agents SDK'],
    color: 'var(--primary)',
  },
  {
    label: { zh: '模型层', en: 'Model' },
    hint: { zh: '推理、生成、GUI 操作', en: 'Reasoning, generation, GUI actions' },
    items: ['Claude', 'GPT', 'UI-TARS'],
    color: 'var(--accent)',
  },
];

export function Chapter12() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'ECOSYSTEM',
      title: '框架横评',
      p1: '选框架很容易变成阵营之争。但真正决定你能不能上线的，不是 logo，而是四件事：能不能持久化暂停、能不能接人工审批、能不能看清每一步、能不能用上你要的模型。',
      p2: '先把层次分清。Claude Agent SDK 和 OpenAI Agents SDK 更靠上，直接提供 Agent 循环、工具、权限和会话，适合快速把循环跑起来。Claude 这一侧来自 Claude Code 的实战循环，文件、shell、hooks、子 Agent 是强项；OpenAI 这一侧把 handoff、guardrail、tracing 做成了第一等公民，适合多 Agent 路由。',
      p3: 'LangGraph 在更下一层，它关心的不是「一个 Agent 怎么想」，而是「多个步骤怎么持久地、可恢复地编排」。checkpoint、interrupt、图状态这些能力，在长时任务和复杂审批流里非常值钱；代价是抽象更重，简单线性循环会被拖慢。',
      p4: 'Microsoft Agent Framework 走的是企业工作流路线，Agent 和确定性 workflow 可以混着用，适合本来就深度使用 .NET / Azure 的团队。',
      p5: '国内生态里，火山引擎 AgentKit 更像平台层：身份、权限、隔离、观测、部署一起提供，适合企业私有化和合规场景。通义 DeepResearch 是一个很好的参考实现，让你看到规划、检索、综合怎么拆成多个角色；但它不是通用编排框架。UI-TARS 则是 GUI 模型，负责看屏幕、输出操作，外层仍然需要循环和护栏。',
      p6: '所以别拿它们直接比高低。模型、harness、编排层、平台层是四层东西，可以组合。一个常见组合是：Claude Agent SDK 做编码循环，LangGraph 做长时任务编排，AgentCore 或 AgentKit 做观测和部署。',
      p7: '选型时问三个问题：第一，你需要暂停几小时再恢复吗？需要，就优先看 LangGraph 这类持久化编排。第二，你的主战场是代码和文件吗？是，就从 Claude Agent SDK 起步。第三，你需要多 Agent 分工和 handoff 吗？需要，就看 OpenAI Agents SDK。',
      p8: '最后一个反直觉建议：先从最小的循环开始。很多团队引入重框架，是为了解决「还不知道会不会发生」的复杂度，结果先被框架本身拖住。循环跑通了，再按真实痛点加层。',
      layerTitle: '它们不在同一层',
      tableHead: ['名字', '类型', '核心抽象', '强项', '注意'],
      rows: rows.map((row) => [row.name, row.kind[lang], row.core[lang], row.strong[lang], row.caution[lang]]),
      calloutTitle: '什么时候不该用 LangGraph',
      callout:
        '如果你的循环只有两步、两个工具、不需要暂停恢复，也不需要在故障后从中间继续，那么一个普通的 while 循环加预算闸更清楚。图编排的价值在「状态复杂且需要持久化」时才兑现；为了架构图好看而引入它，通常会在调试时付出利息。',
    },
    en: {
      kicker: 'ECOSYSTEM',
      title: 'Framework comparison',
      p1: 'Choosing a framework easily turns into tribalism. What actually decides whether you ship is not the logo but four things: can it pause durably, can it take human approval, can you see every step, and can you use the model you need?',
      p2: 'Start by separating the layers. Claude Agent SDK and OpenAI Agents SDK sit higher: they provide the agent loop, tools, permissions and sessions, so you can get a loop running fast. Claude’s side comes from the battle-tested Claude Code loop, strong on files, shell, hooks and subagents. OpenAI’s side makes handoffs, guardrails and tracing first-class, strong for multi-agent routing.',
      p3: 'LangGraph sits lower. It cares less about “how one agent thinks” and more about “how multiple steps are orchestrated durably and resumably.” Checkpoints, interrupts and graph state are valuable for long-running tasks and complex approval flows; the price is heavier abstraction, which slows down a simple linear loop.',
      p4: 'Microsoft Agent Framework takes the enterprise workflow route: agents and deterministic workflows mix, which suits teams already deep in .NET / Azure.',
      p5: 'In the Chinese ecosystem, Volcengine AgentKit is more of a platform layer: identity, permissions, isolation, observability and deployment together, suited to private and compliant enterprise deployments. Tongyi DeepResearch is an excellent reference implementation showing how planning, retrieval and synthesis split across roles; it is not a general orchestrator. UI-TARS is a GUI model that sees the screen and emits actions; the outer loop and guardrails are still yours.',
      p6: 'So do not compare them as one ranking. Model, harness, orchestration and platform are four layers and can be combined. A common stack: Claude Agent SDK for the coding loop, LangGraph for long-running orchestration, AgentCore or AgentKit for observability and deployment.',
      p7: 'Ask three questions. First, do you need to pause for hours and resume? If yes, look at durable orchestrators like LangGraph. Second, is your main battlefield code and files? If yes, start with the Claude Agent SDK. Third, do you need multi-agent division of labor and handoffs? If yes, look at the OpenAI Agents SDK.',
      p8: 'One counterintuitive recommendation: start with the smallest loop. Many teams adopt a heavy framework to solve complexity that may never occur, and get stuck on the framework first. Get the loop working, then add layers for real pain.',
      layerTitle: 'They are not on the same layer',
      tableHead: ['Name', 'Type', 'Core abstraction', 'Strength', 'Caution'],
      rows: rows.map((row) => [row.name, row.kind[lang], row.core[lang], row.strong[lang], row.caution[lang]]),
      calloutTitle: 'When not to use LangGraph',
      callout:
        'If your loop has two steps, two tools, no pause/resume and no need to recover mid-run, a plain while loop with a budget guard is clearer. Graph orchestration pays off when state is complex and must be durable; adopting it for a prettier architecture diagram usually charges interest during debugging.',
    },
  }[lang];

  return (
    <Section
      id="ch12"
      num="12"
      title={c.title}
      kicker={c.kicker}
      sources={['claude-sdk-overview', 'openai-tools', 'langgraph-platform', 'microsoft-agent-framework', 'volcengine-agentkit', 'tongyi-deepresearch', 'ui-tars']}
    >
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

      <div className="figure">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="chip chip-primary font-mono">{lang === 'zh' ? '分层图' : 'LAYER MAP'}</span>
          <span className="text-[0.7rem] text-[var(--muted)]">
            {lang === 'zh' ? '可以组合，不是替代关系' : 'Composable, not substitutes'}
          </span>
        </div>
        <div className="space-y-2">
          {layers.map((layer) => (
            <div
              key={layer.label.en}
              className="flex flex-col gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 sm:flex-row sm:items-center"
              style={{ borderLeft: `3px solid ${layer.color}` }}
            >
              <div className="sm:w-[150px] sm:flex-none">
                <div className="text-[0.8rem] font-bold" style={{ color: layer.color }}>{layer.label[lang]}</div>
                <div className="text-[0.64rem] text-[var(--muted)]">{layer.hint[lang]}</div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {layer.items.map((item) => (
                  <span key={item} className="rounded-md border border-[var(--line)] bg-[var(--surface-2)] px-2 py-1 font-mono text-[0.68rem] text-[var(--text-soft)]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <figcaption className="figure-caption">
          {lang === 'zh'
            ? '图 12-1：把模型、harness、编排、平台放在同一张图上，很多「谁更强」的争论会自然消失。'
            : 'Figure 12-1: put model, harness, orchestration and platform on one map and many “which is better” debates dissolve.'}
        </figcaption>
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

      <Callout tone="warn" title={c.calloutTitle} icon="🧱">
        {c.callout}
      </Callout>
    </Section>
  );
}
