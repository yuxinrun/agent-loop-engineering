import type { Bilingual } from './sources';

export type ChapterMeta = {
  id: string;
  num: string;
  title: Bilingual;
  short: Bilingual;
};

export const chapters: ChapterMeta[] = [
  {
    id: 'ch1',
    num: '01',
    title: { zh: '世界观：从一次 API 调用到 Agent 循环', en: 'From one API call to an agent loop' },
    short: { zh: '从一次调用到循环', en: 'From call to loop' },
  },
  {
    id: 'ch2',
    num: '02',
    title: { zh: 'Loop 的解剖学：四步反馈环', en: 'Anatomy of a loop: the four-step cycle' },
    short: { zh: '四步反馈环', en: 'The four-step cycle' },
  },
  {
    id: 'ch3',
    num: '03',
    title: { zh: 'Loop 的五种形态', en: 'Five shapes of loops' },
    short: { zh: '五种 Loop 形态', en: 'Five loop shapes' },
  },
  {
    id: 'ch4',
    num: '04',
    title: { zh: '停止条件的艺术', en: 'The art of stopping' },
    short: { zh: '停止条件', en: 'Stopping' },
  },
  {
    id: 'ch5',
    num: '05',
    title: { zh: '上下文窗口生存指南', en: 'Surviving the context window' },
    short: { zh: '上下文生存', en: 'Context survival' },
  },
  {
    id: 'ch6',
    num: '06',
    title: { zh: '工具与 ACI 设计', en: 'Tools and ACI design' },
    short: { zh: '工具与 ACI', en: 'Tools & ACI' },
  },
  {
    id: 'ch7',
    num: '07',
    title: { zh: '人在回路（HITL）', en: 'Human in the loop' },
    short: { zh: '人在回路', en: 'Human in the loop' },
  },
  {
    id: 'ch8',
    num: '08',
    title: { zh: '失败模式图鉴', en: 'A field guide to failure modes' },
    short: { zh: '失败模式图鉴', en: 'Failure modes' },
  },
  {
    id: 'ch9',
    num: '09',
    title: { zh: '可观测性与调试', en: 'Observability and debugging' },
    short: { zh: '可观测性', en: 'Observability' },
  },
  {
    id: 'ch10',
    num: '10',
    title: { zh: '成本与性能工程', en: 'Cost and performance engineering' },
    short: { zh: '成本与性能', en: 'Cost & performance' },
  },
  {
    id: 'ch11',
    num: '11',
    title: { zh: '三个实战案例', en: 'Three production case studies' },
    short: { zh: '三个实战案例', en: 'Case studies' },
  },
  {
    id: 'ch12',
    num: '12',
    title: { zh: '框架横评', en: 'Framework comparison' },
    short: { zh: '框架横评', en: 'Frameworks' },
  },
  {
    id: 'ch13',
    num: '13',
    title: { zh: '落地 Checklist', en: 'Shipping checklist' },
    short: { zh: '落地 Checklist', en: 'Checklist' },
  },
  {
    id: 'ch14',
    num: '14',
    title: { zh: '延伸阅读与一手来源', en: 'Further reading and primary sources' },
    short: { zh: '延伸阅读', en: 'Further reading' },
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
