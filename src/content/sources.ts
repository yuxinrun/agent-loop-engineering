export type Bilingual<T = string> = { zh: T; en: T };

export type SourceGroup = 'anthropic' | 'openai' | 'langchain' | 'microsoft' | 'aws' | 'cn' | 'community';

export type Source = {
  id: string;
  group: SourceGroup;
  org: string;
  title: Bilingual;
  note: Bilingual;
  url: string;
  domain: string;
};

export const sources: Source[] = [
  {
    id: 'anthropic-agents',
    group: 'anthropic',
    org: 'Anthropic',
    title: { zh: 'Building Effective Agents', en: 'Building Effective Agents' },
    note: {
      zh: 'Agent 与 workflow 的边界，以及「简单、可组合」的工程原则。',
      en: 'Where agents end and workflows begin, plus the case for simple, composable patterns.',
    },
    url: 'https://www.anthropic.com/engineering/building-effective-agents',
    domain: 'anthropic.com',
  },
  {
    id: 'anthropic-loops',
    group: 'anthropic',
    org: 'Claude',
    title: { zh: 'Loop Engineering: Getting Started with Loops', en: 'Loop Engineering: Getting Started with Loops' },
    note: {
      zh: 'Claude Code 团队的循环入门：turn / goal / time / proactive 四类触发方式。',
      en: 'The Claude Code team on loop engineering: turn-, goal-, time- and proactive-based loops.',
    },
    url: 'https://claude.com/blog/getting-started-with-loops',
    domain: 'claude.com',
  },
  {
    id: 'claude-sdk-loop',
    group: 'anthropic',
    org: 'Claude Agent SDK',
    title: { zh: 'How the agent loop works', en: 'How the agent loop works' },
    note: {
      zh: '官方文档：接收 prompt、评估、调用工具、重复，以及停止条件。',
      en: 'Official docs: receive a prompt, evaluate, call tools, repeat — and how the loop stops.',
    },
    url: 'https://code.claude.com/docs/en/agent-sdk/agent-loop',
    domain: 'code.claude.com',
  },
  {
    id: 'anthropic-sdk-agents',
    group: 'anthropic',
    org: 'Anthropic',
    title: { zh: 'Building agents with the Claude Agent SDK', en: 'Building agents with the Claude Agent SDK' },
    note: {
      zh: '把 Claude Code 的循环拆成：收集上下文、执行操作、验证结果、重复。',
      en: 'The Claude Code loop broken down: gather context, take action, verify work, repeat.',
    },
    url: 'https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk',
    domain: 'anthropic.com',
  },
  {
    id: 'claude-sdk-overview',
    group: 'anthropic',
    org: 'Claude Agent SDK',
    title: { zh: 'Agent SDK overview', en: 'Agent SDK overview' },
    note: {
      zh: '工具、hooks、权限、session、subagent 与上下文压缩的官方入口。',
      en: 'Official entry point for tools, hooks, permissions, sessions, subagents and compaction.',
    },
    url: 'https://code.claude.com/docs/en/agent-sdk/overview',
    domain: 'code.claude.com',
  },
  {
    id: 'anthropic-context',
    group: 'anthropic',
    org: 'Anthropic',
    title: { zh: 'Effective context engineering for AI agents', en: 'Effective context engineering for AI agents' },
    note: {
      zh: '为什么上下文不是越长越好，以及压缩、隔离与工具设计的关系。',
      en: 'Why more context is not always better, and how compaction and isolation fit in.',
    },
    url: 'https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents',
    domain: 'anthropic.com',
  },
  {
    id: 'openai-guide',
    group: 'openai',
    org: 'OpenAI',
    title: { zh: 'A Practical Guide to Building AI Agents', en: 'A Practical Guide to Building AI Agents' },
    note: {
      zh: '从客户部署中总结的 Agent 设计、编排、护栏与落地建议。',
      en: 'Agent design, orchestration, guardrails and rollout lessons distilled from customer deployments.',
    },
    url: 'https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf',
    domain: 'openai.com',
  },
  {
    id: 'openai-tools',
    group: 'openai',
    org: 'OpenAI Agents SDK',
    title: { zh: 'Tools · OpenAI Agents SDK', en: 'Tools · OpenAI Agents SDK' },
    note: {
      zh: '函数工具、Agents as tools、工具命名与审批门禁的官方文档。',
      en: 'Function tools, agents-as-tools, namespacing and approval gates.',
    },
    url: 'https://openai.github.io/openai-agents-python/tools/',
    domain: 'openai.github.io',
  },
  {
    id: 'openai-orchestrating',
    group: 'openai',
    org: 'OpenAI Cookbook',
    title: { zh: 'Orchestrating Agents: Routines and Handoffs', en: 'Orchestrating Agents: Routines and Handoffs' },
    note: {
      zh: '用 routine 处理常规路径，用 handoff 把任务交给更合适的 Agent。',
      en: 'Routines for the common path, handoffs for routing work to a better-suited agent.',
    },
    url: 'https://cookbook.openai.com/examples/orchestrating_agents',
    domain: 'cookbook.openai.com',
  },
  {
    id: 'langgraph-hitl',
    group: 'langchain',
    org: 'LangChain',
    title: { zh: 'Human-in-the-loop', en: 'Human-in-the-loop' },
    note: {
      zh: 'LangGraph 的 interrupt / resume 与人工审批工作流。',
      en: 'LangGraph interrupt / resume patterns for human approval workflows.',
    },
    url: 'https://docs.langchain.com/oss/python/langgraph/human-in-the-loop',
    domain: 'docs.langchain.com',
  },
  {
    id: 'langgraph-interrupts',
    group: 'langchain',
    org: 'LangChain',
    title: { zh: 'Interrupts', en: 'Interrupts' },
    note: {
      zh: '如何暂停图执行、持久化状态，再用 Command(resume=...) 恢复。',
      en: 'Pause graph execution, persist state, then resume with Command(resume=...).',
    },
    url: 'https://docs.langchain.com/oss/python/langgraph/interrupts',
    domain: 'docs.langchain.com',
  },
  {
    id: 'langgraph-platform',
    group: 'langchain',
    org: 'LangChain',
    title: { zh: 'LangGraph Platform', en: 'LangGraph Platform' },
    note: {
      zh: '持久化执行、流式输出与水平扩展的部署层。',
      en: 'Durable execution, streaming and horizontal scaling for deployed graphs.',
    },
    url: 'https://docs.langchain.com/langgraph-platform',
    domain: 'docs.langchain.com',
  },
  {
    id: 'microsoft-agent-framework',
    group: 'microsoft',
    org: 'Microsoft Learn',
    title: { zh: 'Microsoft Agent Framework Overview', en: 'Microsoft Agent Framework Overview' },
    note: {
      zh: '长时运行、人在回路、状态管理与工作流的官方概览。',
      en: 'Official overview of long-running work, human-in-the-loop, state and workflows.',
    },
    url: 'https://learn.microsoft.com/en-us/agent-framework/overview/',
    domain: 'learn.microsoft.com',
  },
  {
    id: 'microsoft-harness',
    group: 'microsoft',
    org: 'Microsoft Learn',
    title: { zh: 'Compare Copilot Studio agent harnesses', en: 'Compare Copilot Studio agent harnesses' },
    note: {
      zh: '什么时候用确定性工作流，什么时候用 agentic loop。',
      en: 'When to use deterministic workflows versus an agentic loop.',
    },
    url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/guidance/choose-harness',
    domain: 'learn.microsoft.com',
  },
  {
    id: 'aws-agentcore-blog',
    group: 'aws',
    org: 'AWS Machine Learning Blog',
    title: {
      zh: 'Debugging production agents with Amazon Bedrock AgentCore Observability',
      en: 'Debugging production agents with Amazon Bedrock AgentCore Observability',
    },
    note: {
      zh: '177 个 span 的失控循环，以及「never give up」prompt 的真实事故。',
      en: 'The 177-span runaway loop and the real incident caused by a “never give up” prompt.',
    },
    url: 'https://aws.amazon.com/blogs/machine-learning/debugging-production-agents-with-amazon-bedrock-agentcore-observability/',
    domain: 'aws.amazon.com',
  },
  {
    id: 'aws-agentcore-docs',
    group: 'aws',
    org: 'AWS Documentation',
    title: { zh: 'Observability for AgentCore resources', en: 'Observability for AgentCore resources' },
    note: {
      zh: '用 OpenTelemetry 采集 trace、指标与日志的配置方式。',
      en: 'Configure traces, metrics and logs with OpenTelemetry.',
    },
    url: 'https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/observability-configure.html',
    domain: 'docs.aws.amazon.com',
  },
  {
    id: 'tongyi-deepresearch',
    group: 'cn',
    org: 'Alibaba Tongyi',
    title: { zh: 'Tongyi DeepResearch', en: 'Tongyi DeepResearch' },
    note: {
      zh: '通义开源的深度研究 Agent，展示长任务中的规划、检索与综合。',
      en: 'Tongyi’s open deep-research agent for planning, retrieval and synthesis on long tasks.',
    },
    url: 'https://github.com/Alibaba-NLP/DeepResearch',
    domain: 'github.com',
  },
  {
    id: 'volcengine-agentkit',
    group: 'cn',
    org: 'Volcengine',
    title: { zh: '火山引擎 AgentKit 文档', en: 'Volcengine AgentKit documentation' },
    note: {
      zh: '企业级 Agent 平台：身份权限、安全隔离与观测底座。',
      en: 'Enterprise agent platform covering identity, isolation and observability.',
    },
    url: 'https://www.volcengine.com/docs/6458/1297468',
    domain: 'volcengine.com',
  },
  {
    id: 'infoq-deerflow-hitl',
    group: 'cn',
    org: 'InfoQ',
    title: { zh: '从 AI Agent 到 Agentic AI：开源如何助力开发者解决行业痛点', en: 'From AI Agents to Agentic AI: how open source helps' },
    note: {
      zh: 'DeerFlow 的 Edit Plan 人机协作设计。',
      en: 'DeerFlow’s Edit Plan human-in-the-loop design.',
    },
    url: 'https://www.infoq.cn/article/J8FBphU8gCYBdHaQ09hs',
    domain: 'infoq.cn',
  },
  {
    id: 'infoq-deerflow-open',
    group: 'cn',
    org: 'InfoQ',
    title: { zh: '字节跳动 Deep Research 项目正式开源', en: 'ByteDance open-sources its Deep Research project' },
    note: {
      zh: 'DeerFlow 基于 LangGraph 的多 Agent 架构与计划修订。',
      en: 'DeerFlow’s LangGraph-based multi-agent architecture and plan revision.',
    },
    url: 'https://www.infoq.cn/article/u2p2ov5adpedh4cl26qo',
    domain: 'infoq.cn',
  },
  {
    id: 'ui-tars',
    group: 'cn',
    org: 'ByteDance Seed',
    title: { zh: 'UI-TARS', en: 'UI-TARS' },
    note: {
      zh: '面向 GUI 操作的端到端 Agent 模型，观察—行动循环的另一种形态。',
      en: 'An end-to-end GUI agent model — another shape of the observe–act loop.',
    },
    url: 'https://github.com/bytedance/UI-TARS',
    domain: 'github.com',
  },
  {
    id: 'dataiku-observability',
    group: 'community',
    org: 'Dataiku',
    title: { zh: 'Why traditional observability misses AI agent failure', en: 'Why traditional observability misses AI agent failure' },
    note: {
      zh: 'Agent 会「活着出错」，传统 uptime 监控看不见决策层故障。',
      en: 'Agents stay up while going wrong; uptime monitoring cannot see decision-level failures.',
    },
    url: 'https://www.dataiku.com/blog/traditional-observability-misses-ai-agent-failure',
    domain: 'dataiku.com',
  },
];

export const sourceGroups: { key: SourceGroup; label: Bilingual; hint: Bilingual }[] = [
  {
    key: 'anthropic',
    label: { zh: 'Anthropic / Claude', en: 'Anthropic / Claude' },
    hint: { zh: 'Agent 循环与上下文工程的一手材料。', en: 'Primary material on agent loops and context engineering.' },
  },
  {
    key: 'openai',
    label: { zh: 'OpenAI', en: 'OpenAI' },
    hint: { zh: 'Agent 设计指南、工具最佳实践与 handoff 编排。', en: 'Agent design guidance, tool practices and handoff orchestration.' },
  },
  {
    key: 'langchain',
    label: { zh: 'LangChain / LangGraph', en: 'LangChain / LangGraph' },
    hint: { zh: '图编排、中断恢复与持久化执行。', en: 'Graph orchestration, interrupts and durable execution.' },
  },
  {
    key: 'microsoft',
    label: { zh: 'Microsoft', en: 'Microsoft' },
    hint: { zh: '生产级 Agent 框架与 harness 选择。', en: 'Production agent framework and harness choices.' },
  },
  {
    key: 'aws',
    label: { zh: 'AWS', en: 'AWS' },
    hint: { zh: 'AgentCore 可观测性与真实事故复盘。', en: 'AgentCore observability and a real incident postmortem.' },
  },
  {
    key: 'cn',
    label: { zh: '国内一手资料', en: 'Chinese ecosystem' },
    hint: { zh: '通义、火山引擎、字节 DeerFlow 与 UI-TARS。', en: 'Tongyi, Volcengine, ByteDance DeerFlow and UI-TARS.' },
  },
  {
    key: 'community',
    label: { zh: '行业观察', en: 'Industry notes' },
    hint: { zh: '关于 Agent 可观测性盲区的补充视角。', en: 'A complementary view on observability blind spots.' },
  },
];

export const sourceById = (id: string) => sources.find((source) => source.id === id);
