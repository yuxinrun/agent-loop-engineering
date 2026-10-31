import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { useLang } from '../i18n/LangContext';
import { sources, sourceGroups, sourceById, type SourceGroup } from '../content/sources';

const groupIcon: Record<SourceGroup, string> = {
  anthropic: '◎',
  openai: '◍',
  langchain: '⌘',
  microsoft: '▦',
  aws: '☁',
  cn: '◈',
  community: '◇',
};

const readingPath = ['anthropic-loops', 'claude-sdk-loop', 'anthropic-agents', 'openai-guide', 'langgraph-hitl', 'aws-agentcore-blog'];

export function Chapter14() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'SOURCES',
      title: '延伸阅读与一手来源',
      p1: '这一页是整站的出处库。所有关键结论都尽量指向可点击的一手材料：官方文档、工程博客、开源仓库。二手总结可以帮你建立直觉，但真要落地，最后还是得回到原文。',
      p2: '阅读顺序建议从「循环是什么」开始，再看「Claude Code 的四步环」，然后用「Building Effective Agents」校准 Agent 与 workflow 的边界。之后按你的场景选读：做工具看 OpenAI，做人工审批看 LangGraph，做生产观测看 AWS。',
      p3: '所有链接在整理时都做了可达性核对。少数社区文章无法确认原文或链接已失效，因此没有放进来——宁可少一条来源，也不给一条死链或编造的引用。',
      p4: '如果你只读三篇：Claude 的 loops 入门、Claude Agent SDK 的 agent loop 文档、以及 AWS 那篇 177 个 span 的事故复盘。它们分别回答「怎么开始」「循环怎么转」「转坏了怎么查」。',
      countLabel: '篇一手材料',
      groupLabel: '组来源',
      pathTitle: '如果只有半小时，按这个顺序读',
      pathHint: '从概念到事故，六篇建立完整心智模型',
      verified: '已核对可达性',
      open: '打开原文',
      noteTitle: '关于来源的一个小声明',
      note:
        '本站不使用无法核实的社区文章来支撑关键结论。个别在选题阶段提到的社区文章（例如无法确认原文的 Agentic Engineering Guide 章节、Growth Engineer 的失败模式清单、OpenLegion 的调试文章）没有列入，以免出现死链或伪造引用。若你手上有稳定的一手链接，欢迎替换进来。',
      sourceCount: (n: number) => `${n} 篇`,
    },
    en: {
      kicker: 'SOURCES',
      title: 'Further reading and primary sources',
      p1: 'This page is the site’s source library. Key claims point to clickable primary material wherever possible: official docs, engineering blogs, open-source repositories. Secondary summaries build intuition, but shipping work eventually sends you back to the source.',
      p2: 'Read in this order: what a loop is, then Claude Code’s four-step cycle, then Building Effective Agents to calibrate the agent/workflow boundary. After that, follow your use case: OpenAI for tools, LangGraph for human approval, AWS for production observability.',
      p3: 'Every link was checked for reachability while writing. A few community articles could not be confirmed or had dead links, so they are not included — better one source fewer than a dead link or a fabricated citation.',
      p4: 'If you only read three: Claude’s intro to loops, the Claude Agent SDK agent-loop docs, and AWS’s 177-span postmortem. They answer “how to start,” “how the loop turns,” and “how to debug when it turns wrong.”',
      countLabel: 'primary sources',
      groupLabel: 'source groups',
      pathTitle: 'Half an hour? Read these in order',
      pathHint: 'From concept to incident: six pieces for a complete mental model',
      verified: 'Reachability checked',
      open: 'Open source',
      noteTitle: 'A small note on sourcing',
      note:
        'This site does not use unverifiable community articles to support key claims. A few community pieces mentioned during planning (for example an unconfirmed Agentic Engineering Guide chapter, a Growth Engineer failure-mode list and an OpenLegion debugging article) are omitted to avoid dead links or fabricated citations. If you have stable primary links, swap them in.',
      sourceCount: (n: number) => `${n}`,
    },
  }[lang];

  return (
    <Section id="ch14" num="14" title={c.title} kicker={c.kicker} sources={[]}>
      <div className="prose-block">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
        <p>{c.p3}</p>
        <p>{c.p4}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="chip chip-primary font-mono">
          {sources.length} {c.countLabel}
        </span>
        <span className="chip font-mono">
          {sourceGroups.length} {c.groupLabel}
        </span>
        <span className="chip font-mono">{c.verified}</span>
      </div>

      <div className="card p-4">
        <div className="mb-3">
          <h3 className="text-[0.98rem] font-bold text-[var(--text)]">{c.pathTitle}</h3>
          <p className="mt-0.5 text-[0.72rem] text-[var(--muted)]">{c.pathHint}</p>
        </div>
        <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {readingPath.map((id, index) => {
            const source = sourceById(id);
            if (!source) return null;
            return (
              <li key={id}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-hover flex h-full gap-2 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-2.5 no-underline"
                >
                  <span className="mt-0.5 font-mono text-[0.66rem] font-bold text-[var(--primary-strong)]">0{index + 1}</span>
                  <span className="min-w-0">
                    <span className="block text-[0.76rem] font-semibold leading-snug text-[var(--text)]">{source.title[lang]}</span>
                    <span className="mt-0.5 block font-mono text-[0.58rem] text-[var(--muted)]">{source.org}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="space-y-6">
        {sourceGroups.map((group) => {
          const groupSources = sources.filter((source) => source.group === group.key);
          return (
            <div key={group.key}>
              <div className="mb-2.5 flex flex-wrap items-baseline gap-2">
                <span className="font-mono text-[1rem] text-[var(--primary)]" aria-hidden="true">
                  {groupIcon[group.key]}
                </span>
                <h3 className="text-[0.95rem] font-bold text-[var(--text)]">{group.label[lang]}</h3>
                <span className="chip font-mono text-[0.6rem]">{c.sourceCount(groupSources.length)}</span>
                <span className="text-[0.7rem] text-[var(--muted)]">{group.hint[lang]}</span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {groupSources.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card card-hover group flex flex-col p-3.5 no-underline"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-[var(--muted)]">{source.org}</span>
                      <span className="font-mono text-[0.58rem] text-[var(--muted)]">{source.domain}</span>
                    </div>
                    <span className="mt-1.5 text-[0.84rem] font-bold leading-snug text-[var(--text)] transition-colors group-hover:text-[var(--primary-strong)]">
                      {source.title[lang]}
                    </span>
                    <span className="mt-1.5 text-[0.74rem] leading-relaxed text-[var(--text-soft)]">{source.note[lang]}</span>
                    <span className="mt-auto pt-2 text-[0.64rem] font-semibold text-[var(--primary-strong)] opacity-80">
                      {c.open} ↗
                    </span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <Callout tone="info" title={c.noteTitle} icon="📚">
        {c.note}
      </Callout>

      <div className="rounded-xl border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] p-4 text-center">
        <p className="text-[0.8rem] text-[var(--text-soft)]">
          {lang === 'zh'
            ? '读到这儿，你已经具备了把循环跑起来、停下来、算清账、查明白的全部基础。剩下的，是去写第一个 while。'
            : 'By now you have everything to run a loop, stop it, count the cost and debug it. What remains is to write the first while.'}
        </p>
        <a href="#ch1" className="btn btn-primary mt-3 inline-flex">
          {lang === 'zh' ? '回到第一章，重新看一遍' : 'Back to chapter one'}
        </a>
      </div>
    </Section>
  );
}
