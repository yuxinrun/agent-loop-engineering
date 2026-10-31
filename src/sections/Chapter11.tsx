import { useState } from 'react';
import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { useLang } from '../i18n/LangContext';

const cases = [
  {
    key: 'email',
    icon: '✉️',
    name: { zh: '邮件助理', en: 'Email assistant' },
    tagline: {
      zh: '最经典的生产场景：读信、查历史、起草回复，但在发送前必须有人点头。',
      en: 'The classic production scenario: read, search history, draft a reply — but a human must approve before send.',
    },
    flow: [
      { title: { zh: '收信', en: 'Ingest' }, sub: { zh: 'webhook / 轮询', en: 'webhook / poll' } },
      { title: { zh: '分类', en: 'Classify' }, sub: { zh: '意图 + 风险', en: 'intent + risk' } },
      { title: { zh: '起草', en: 'Draft' }, sub: { zh: '查历史 + 生成', en: 'history + generate' } },
      { title: { zh: '人工审批', en: 'Approve' }, sub: { zh: 'interrupt', en: 'interrupt' } },
      { title: { zh: '发送 / 归档', en: 'Send / file' }, sub: { zh: '幂等键', en: 'idempotency key' } },
    ],
    tools: { zh: 'get_email、search_thread、draft_reply、send_email（需审批）、label', en: 'get_email, search_thread, draft_reply, send_email (approval), label' },
    stop: { zh: '审批通过或拒绝；最多 2 次改写', en: 'Approved or rejected; at most 2 revisions' },
    pitfalls: [
      { zh: '重试导致重复发送：发送前必须用消息 ID 做幂等。', en: 'Retries send twice: use the message ID as an idempotency key.' },
      { zh: '邮件正文是提示注入的温床：把外部内容当数据，不当指令。', en: 'Email bodies are prompt-injection territory: treat external content as data, not instructions.' },
      { zh: '自动发送没有人工闸门：第一次上线就应该强制审批。', en: 'Auto-send without a human gate: force approval on the first launch.' },
    ],
    code: `from langgraph.types import interrupt  # 或你所用框架的中断原语

KEY = "email:{message_id}:reply-v1"

def handle_email(message):
    thread = search_thread(message.thread_id)
    draft = draft_reply(message, thread)

    if not policy_check(draft):
        return escalate(message, reason="policy")

    decision = interrupt({
        "type": "approve_email",
        "to": message.sender,
        "draft": draft,
    })
    if not decision["approved"]:
        return {"status": "rejected", "message_id": message.id}

    if already_sent(KEY.format(message_id=message.id)):
        return {"status": "duplicate_skipped"}

    send_email(
        to=message.sender,
        body=decision.get("body", draft),
        idempotency_key=KEY.format(message_id=message.id),
    )
    label(message.id, "replied")
    return {"status": "sent"}`,
    codeCaption: {
      zh: '关键不是「会写邮件」，而是「不重复发、不擅自发、被注入也不听」。',
      en: 'The point is not writing email; it is not sending twice, not sending unapproved, and not obeying injections.',
    },
  },
  {
    key: 'research',
    icon: '🔎',
    name: { zh: '深度研究 Agent', en: 'Deep research agent' },
    tagline: {
      zh: '规划、检索、综合、评审四个角色分离；上下文隔离，引用可核查。',
      en: 'Planner, researcher, writer and reviewer are separated; context is isolated and citations are checkable.',
    },
    flow: [
      { title: { zh: '规划', en: 'Plan' }, sub: { zh: '拆子问题', en: 'split questions' } },
      { title: { zh: '并行检索', en: 'Research' }, sub: { zh: '子 Agent', en: 'sub-agents' } },
      { title: { zh: '证据整理', en: 'Synthesize' }, sub: { zh: '去重 + 引用', en: 'dedupe + cite' } },
      { title: { zh: '写作', en: 'Write' }, sub: { zh: '结构化草稿', en: 'structured draft' } },
      { title: { zh: '评审循环', en: 'Review' }, sub: { zh: 'rubric + 事实检查', en: 'rubric + fact check' } },
    ],
    tools: { zh: 'web_search、fetch_page、extract_claims、cite_check；每个子 Agent 独立预算', en: 'web_search, fetch_page, extract_claims, cite_check; each sub-agent has its own budget' },
    stop: { zh: '评审通过；或 3 轮修订 / 预算耗尽转人工', en: 'Review passes; or 3 revisions / budget exhausted → human' },
    pitfalls: [
      { zh: '没有引用检查：文风很像报告，来源却是编的。', en: 'No citation check: it reads like a report, but the sources are invented.' },
      { zh: '检索无限展开：一个子问题能开十个标签页。', en: 'Unbounded browsing: one sub-question opens ten tabs.' },
      { zh: '所有内容塞进主上下文：写到后面忘了最初的问题。', en: 'Everything in one context: by the end it forgets the original question.' },
    ],
    code: `def research(question, budget):
    plan = planner(question)
    notes = []

    for step in plan.steps[: budget.max_steps]:
        if budget.exhausted():
            break
        # 子 Agent 独立上下文，只回传压缩后的证据
        notes += researcher(step, budget.slice(0.15))

    draft = writer(question, notes)

    for round_no in range(1, 4):
        review = reviewer(question, draft, notes)
        if review.ok and cite_check(draft, notes):
            return {"status": "done", "draft": draft, "rounds": round_no}
        draft = writer(question, notes, feedback=review.feedback)

    return {"status": "needs_human", "draft": draft, "review": review}`,
    codeCaption: {
      zh: '研究循环的胜负手是「证据」而不是「文采」：引用检查通过，才算完成。',
      en: 'Research loops are won on evidence, not prose: no citation check, no finish.',
    },
  },
  {
    key: 'codefix',
    icon: '🛠️',
    name: { zh: '代码修复 Agent', en: 'Code-fix agent' },
    tagline: {
      zh: '复现、定位、打补丁、跑测试、看 diff；测试文件是保护区，不许改。',
      en: 'Reproduce, localize, patch, test, inspect the diff; test files are protected and off-limits.',
    },
    flow: [
      { title: { zh: '复现', en: 'Reproduce' }, sub: { zh: '跑失败测试', en: 'run failing test' } },
      { title: { zh: '定位', en: 'Localize' }, sub: { zh: '搜代码 + 读栈', en: 'search + stack' } },
      { title: { zh: '打补丁', en: 'Patch' }, sub: { zh: '最小 diff', en: 'minimal diff' } },
      { title: { zh: '验证', en: 'Verify' }, sub: { zh: '测试 + lint', en: 'tests + lint' } },
      { title: { zh: '评审 / 回滚', en: 'Review / rollback' }, sub: { zh: 'checkpoint', en: 'checkpoint' } },
    ],
    tools: { zh: 'read_file、grep、apply_patch、run_tests、git_diff；测试目录只读', en: 'read_file, grep, apply_patch, run_tests, git_diff; test directories are read-only' },
    stop: { zh: '测试全绿 + diff 最小 + 人工/独立评审通过；最多 3 个补丁', en: 'Tests green + minimal diff + independent review; at most 3 patches' },
    pitfalls: [
      { zh: '改测试让它通过：必须在工具层面禁止写测试文件。', en: 'Editing tests until they pass: forbid writes to test files at the tool layer.' },
      { zh: '一个大补丁改十个文件：失败后无法判断哪一处有效。', en: 'One giant patch across ten files: when it fails, you cannot tell what helped.' },
      { zh: '失败后原地重试：没有回滚，错误层层叠加。', en: 'Retrying in place after failure: no rollback, errors stack up.' },
    ],
    code: `PROTECTED = ("tests/", "test/", "package-lock.json")

def fix_bug(repo, failing_test, budget):
    context = reproduce(repo, failing_test)

    for attempt in range(1, budget.max_patches + 1):
        patch = propose_patch(localize(context))

        if touches(patch, PROTECTED):
            return {"status": "blocked", "reason": "test_files_protected"}

        checkpoint = snapshot(repo)
        apply_patch(repo, patch)
        result = run_tests(repo)

        if result.passed and diff_is_minimal(repo, checkpoint):
            return {"status": "fixed", "attempt": attempt, "diff": git_diff(repo, checkpoint)}

        restore(repo, checkpoint)          # 失败就回滚，不带病继续
        context = context.with_failure(result)

    return {"status": "needs_human", "attempts": budget.max_patches}`,
    codeCaption: {
      zh: '代码修复的底线：不能靠改测试过关；每个补丁都必须可回滚。',
      en: 'The baseline of code fixing: never pass by editing tests; every patch must be rollbackable.',
    },
  },
];

export function Chapter11() {
  const { lang } = useLang();
  const [active, setActive] = useState(0);
  const current = cases[active];
  const c = {
    zh: {
      kicker: 'PRACTICE',
      title: '三个实战案例',
      p1: '概念讲完了，现在把镜头拉近。下面三个案例分别代表三种典型的生产形态：带人工闸门的事务型 Agent、可拆分的多 Agent 研究系统、以及有硬验证标准的代码修复循环。',
      p2: '它们共享同一套骨架：明确目标、限制轮次、每步验证、关键动作交人、所有决策可观测。差别只在工具、停止条件和风险边界。',
      p3: '读的时候别只看代码，重点看「哪些事情被禁止」：邮件不能擅自发、研究不能编引用、修复不能改测试。一个可靠的 Agent，往往不是能力更多，而是禁区更清楚。',
      tabsLabel: { zh: '选择案例', en: 'Choose a case' },
      architecture: { zh: '循环结构', en: 'Loop structure' },
      tools: { zh: '关键工具', en: 'Key tools' },
      stop: { zh: '停止条件', en: 'Stop condition' },
      pitfalls: { zh: '最容易翻的车', en: 'Most likely failures' },
      calloutTitle: '案例的可复用部分',
      callout:
        '把三个案例的「禁止清单」抽出来，就是你自己的生产守则：不重复副作用、不伪造证据、不修改验收标准、不在无预算的情况下继续、不在高风险动作上绕过人。',
    },
    en: {
      kicker: 'PRACTICE',
      title: 'Three production case studies',
      p1: 'Enough concepts — zoom in. These three cases represent three common production shapes: a transactional agent with a human gate, a decomposable multi-agent research system, and a code-fix loop with hard verification.',
      p2: 'They share one skeleton: a clear goal, bounded turns, per-step verification, humans at critical actions, and observable decisions. They differ only in tools, stop conditions and risk boundaries.',
      p3: 'Do not just read the code; notice what is forbidden: no unapproved email, no invented citations, no editing tests. A reliable agent is often not the one with more abilities, but the one with clearer no-go zones.',
      tabsLabel: { zh: '选择案例', en: 'Choose a case' },
      architecture: { zh: '循环结构', en: 'Loop structure' },
      tools: { zh: '关键工具', en: 'Key tools' },
      stop: { zh: '停止条件', en: 'Stop condition' },
      pitfalls: { zh: '最容易翻的车', en: 'Most likely failures' },
      calloutTitle: 'What to reuse from these cases',
      callout:
        'Extract the forbidden list and you have a production rulebook: no duplicate side effects, no fabricated evidence, no editing acceptance criteria, no continuing without budget, no bypassing humans on high-risk actions.',
    },
  }[lang];

  return (
    <Section
      id="ch11"
      num="11"
      title={c.title}
      kicker={c.kicker}
      sources={['openai-orchestrating', 'langgraph-hitl', 'tongyi-deepresearch', 'anthropic-agents']}
    >
      <div className="prose-block">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
        <p>{c.p3}</p>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label={c.tabsLabel[lang]}>
        {cases.map((item, index) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={active === index}
            onClick={() => setActive(index)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[0.8rem] font-semibold transition-all duration-200 ${
              active === index
                ? 'border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-contrast)] shadow-[0_8px_20px_-12px_var(--primary)]'
                : 'border-[var(--line)] bg-[var(--surface)] text-[var(--text-soft)] hover:border-[var(--primary)] hover:text-[var(--primary-strong)]'
            }`}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.name[lang]}
          </button>
        ))}
      </div>

      <div className="card p-4 md:p-5">
        <div className="mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[1.3rem]" aria-hidden="true">{current.icon}</span>
            <h3 className="text-[1.08rem] font-bold text-[var(--text)]">{current.name[lang]}</h3>
            <span className="chip chip-accent font-mono">CASE 0{active + 1}</span>
          </div>
          <p className="mt-1.5 text-[0.84rem] leading-relaxed text-[var(--text-soft)]">{current.tagline[lang]}</p>
        </div>

        <div className="mb-4">
          <div className="mb-2 text-[0.66rem] font-bold uppercase tracking-wider text-[var(--muted)]">{c.architecture[lang]}</div>
          <div className="flex flex-col items-stretch gap-1.5 sm:flex-row sm:items-center">
            {current.flow.map((node, index) => (
              <div key={node.title.en} className="flex flex-1 flex-col items-stretch sm:flex-row sm:items-center">
                <div className="flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface-2)] px-2.5 py-2 text-center">
                  <div className="font-mono text-[0.58rem] text-[var(--primary-strong)]">0{index + 1}</div>
                  <div className="text-[0.76rem] font-bold text-[var(--text)]">{node.title[lang]}</div>
                  <div className="text-[0.62rem] text-[var(--muted)]">{node.sub[lang]}</div>
                </div>
                {index < current.flow.length - 1 && (
                  <span className="self-center py-0.5 text-[0.85rem] text-[var(--muted)] sm:px-1" aria-hidden="true">
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--primary-strong)]">{c.tools[lang]}</div>
            <p className="mt-1 text-[0.76rem] leading-relaxed text-[var(--text-soft)]">{current.tools[lang]}</p>
          </div>
          <div className="rounded-lg border border-[var(--line)] bg-[var(--surface-2)] p-3">
            <div className="text-[0.62rem] font-bold uppercase tracking-wider text-[var(--accent)]">{c.stop[lang]}</div>
            <p className="mt-1 text-[0.76rem] leading-relaxed text-[var(--text-soft)]">{current.stop[lang]}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-1.5 text-[0.66rem] font-bold uppercase tracking-wider text-[var(--danger)]">{c.pitfalls[lang]}</div>
          <ul className="grid gap-1">
            {current.pitfalls.map((pitfall) => (
              <li key={pitfall.en} className="flex items-start gap-2 text-[0.76rem] leading-relaxed text-[var(--text-soft)]">
                <span className="mt-1 text-[var(--danger)]" aria-hidden="true">✕</span>
                {pitfall[lang]}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CodeBlock
        code={current.code}
        language="python"
        filename={`case-${current.key}.py`}
        caption={current.codeCaption[lang]}
      />

      <Callout tone="teal" title={c.calloutTitle} icon="🧭">
        {c.callout}
      </Callout>
    </Section>
  );
}
