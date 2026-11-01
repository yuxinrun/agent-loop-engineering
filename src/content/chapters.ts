import type { Bilingual } from './sources';

export type ChapterMeta = {
  id: string;
  num: string;
  title: Bilingual;
  short: Bilingual;
  summary: Bilingual;
};

export const chapters: ChapterMeta[] = [
  {
    id: 'ch1',
    num: '01',
    title: { zh: '世界观：从一次 API 调用到 Agent 循环', en: 'From one API call to an agent loop' },
    short: { zh: '从一次调用到循环', en: 'From call to loop' },
    summary: {
      zh: '先把「一次模型调用」和「一个会自己转的循环」分清楚，再谈工程。',
      en: 'Tell one model call apart from a loop that keeps calling itself.',
    },
  },
  {
    id: 'ch2',
    num: '02',
    title: { zh: 'Loop 的解剖学：四步反馈环', en: 'Anatomy of a loop: the four-step cycle' },
    short: { zh: '四步反馈环', en: 'The four-step cycle' },
    summary: {
      zh: 'Context → Action → Verify → Loop，逐步看清每一次决策发生在哪。',
      en: 'Context, action, verify, loop: see where each decision actually happens.',
    },
  },
  {
    id: 'ch3',
    num: '03',
    title: { zh: 'Loop 的五种形态', en: 'Five shapes of loops' },
    short: { zh: '五种 Loop 形态', en: 'Five loop shapes' },
    summary: {
      zh: '从单轮 ReAct 到多智能体编排，配一棵选型决策树。',
      en: 'From a single ReAct turn to multi-agent orchestration, with a decision tree.',
    },
  },
  {
    id: 'ch4',
    num: '04',
    title: { zh: '停止条件的艺术', en: 'The art of stopping' },
    short: { zh: '停止条件', en: 'Stopping' },
    summary: {
      zh: '什么时候必须踩刹车：轮次上限、预算、停滞检测，以及 177 个 span 的教训。',
      en: 'When to hit the brakes: turn caps, budgets, stall detection and the 177-span lesson.',
    },
  },
  {
    id: 'ch5',
    num: '05',
    title: { zh: '上下文窗口生存指南', en: 'Surviving the context window' },
    short: { zh: '上下文生存', en: 'Context survival' },
    summary: {
      zh: '上下文是稀缺资源：压缩、检索、外置记忆，别让它先撑爆。',
      en: 'Context is scarce: compaction, retrieval and external memory before it overflows.',
    },
  },
  {
    id: 'ch6',
    num: '06',
    title: { zh: '工具与 ACI 设计', en: 'Tools and ACI design' },
    short: { zh: '工具与 ACI', en: 'Tools & ACI' },
    summary: {
      zh: '工具是写给模型看的接口，描述含糊等于替它把坑挖好。',
      en: 'Tools are interfaces written for the model; vague descriptions are pre-dug traps.',
    },
  },
  {
    id: 'ch7',
    num: '07',
    title: { zh: '人在回路（HITL）', en: 'Human in the loop' },
    short: { zh: '人在回路', en: 'Human in the loop' },
    summary: {
      zh: '在关键节点把方向盘交回给人：interrupt、审批与恢复执行。',
      en: 'Hand the wheel back where it matters: interrupts, approvals and resuming.',
    },
  },
  {
    id: 'ch8',
    num: '08',
    title: { zh: '失败模式图鉴', en: 'A field guide to failure modes' },
    short: { zh: '失败模式图鉴', en: 'Failure modes' },
    summary: {
      zh: '七种典型翻车姿势：卡片正面是症状，翻过来是解法。',
      en: 'Seven classic ways to fail: symptom on the front, fix on the back.',
    },
  },
  {
    id: 'ch9',
    num: '09',
    title: { zh: '可观测性与调试', en: 'Observability and debugging' },
    short: { zh: '可观测性', en: 'Observability' },
    summary: {
      zh: '看不见就修不好：trace、span 与重放，把黑盒拆开给自己看。',
      en: 'You cannot fix what you cannot see: traces, spans and replay for your own loop.',
    },
  },
  {
    id: 'ch10',
    num: '10',
    title: { zh: '成本与性能工程', en: 'Cost and performance engineering' },
    short: { zh: '成本与性能', en: 'Cost & performance' },
    summary: {
      zh: '钱烧在哪一目了然，四道保险丝把账单压回预算内。',
      en: 'See exactly where the money burns, then clamp it with four fuses.',
    },
  },
  {
    id: 'ch11',
    num: '11',
    title: { zh: '三个实战案例', en: 'Three production case studies' },
    short: { zh: '三个实战案例', en: 'Case studies' },
    summary: {
      zh: '邮件助理、深度研究、代码修复：三个能直接抄走骨架的生产场景。',
      en: 'Email assistant, deep research and code fixing: three skeletons worth copying.',
    },
  },
  {
    id: 'ch12',
    num: '12',
    title: { zh: '框架横评', en: 'Framework comparison' },
    short: { zh: '框架横评', en: 'Frameworks' },
    summary: {
      zh: 'LangGraph、Agent SDK 还是自研循环？按分层地图一次看清。',
      en: 'LangGraph, an agent SDK or your own loop? Read the layered map first.',
    },
  },
  {
    id: 'ch13',
    num: '13',
    title: { zh: '落地 Checklist', en: 'Shipping checklist' },
    short: { zh: '落地 Checklist', en: 'Checklist' },
    summary: {
      zh: '上线前 11 项自检，全部勾完会掉彩带。',
      en: 'Eleven pre-launch checks. Finish them all and confetti happens.',
    },
  },
  {
    id: 'ch14',
    num: '14',
    title: { zh: '延伸阅读与一手来源', en: 'Further reading and primary sources' },
    short: { zh: '延伸阅读', en: 'Further reading' },
    summary: {
      zh: '全站引用的一手来源库，外加三条推荐阅读路径。',
      en: 'The primary-source library behind this guide, plus three reading paths.',
    },
  },
];

export const parts: { label: Bilingual; ids: string[] }[] = [
  {
    label: { zh: '地基', en: 'Foundations' },
    ids: ['ch1', 'ch2', 'ch3'],
  },
  {
    label: { zh: '控制', en: 'Control' },
    ids: ['ch4', 'ch5', 'ch6', 'ch7'],
  },
  {
    label: { zh: '生产', en: 'Production' },
    ids: ['ch8', 'ch9', 'ch10'],
  },
  {
    label: { zh: '实战', en: 'Practice' },
    ids: ['ch11', 'ch12', 'ch13', 'ch14'],
  },
];

export const chapterIds = chapters.map((chapter) => chapter.id);
