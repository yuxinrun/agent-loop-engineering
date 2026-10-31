import { useState } from 'react';
import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { useLang } from '../i18n/LangContext';

const modes = [
  {
    key: 'loop',
    icon: '♾️',
    name: { zh: '无限循环', en: 'Infinite loop' },
    symptom: {
      zh: '同一个工具、同一组参数，一遍又一遍。每一轮都「成功」，整体毫无进展。',
      en: 'Same tool, same arguments, over and over. Every turn “succeeds” while the whole goes nowhere.',
    },
    cause: {
      zh: '没有轮次上限、没有停滞检测，提示词还在鼓励「永不放弃」。',
      en: 'No iteration cap, no stall detection, and a prompt that says “never give up.”',
    },
    fix: {
      zh: '`maxIterations` + 连续相同 fingerprint 3 次即停；把「永不放弃」改成「何时算失败」。',
      en: '`maxIterations` plus a stop after three identical fingerprints; replace “never give up” with “what counts as failure.”',
    },
    fingerprint: {
      zh: 'trace 里同名字段连续出现；span 数异常膨胀；token 曲线一路向上。',
      en: 'Repeated span names; abnormal span count; a token curve that only goes up.',
    },
  },
  {
    key: 'hallucinated-tool',
    icon: '🔧',
    name: { zh: '工具幻觉', en: 'Tool hallucination' },
    symptom: {
      zh: '调用不存在的工具、编造字段、把两个工具的职责混在一起。',
      en: 'Calls a nonexistent tool, invents fields, or conflates two tools’ responsibilities.',
    },
    cause: {
      zh: '工具名含糊、描述缺失、参数 schema 太宽，或者一次暴露了太多工具。',
      en: 'Vague names, missing descriptions, overly loose schemas, or too many tools at once.',
    },
    fix: {
      zh: '严格 schema 校验 + 结构化错误提示 + 收窄工具数量；错误里写清楚「下一步怎么做」。',
      en: 'Strict schema validation, structured error hints, fewer tools; tell the model what to do next.',
    },
    fingerprint: {
      zh: '参数校验失败率高；同一工具被用在不同语义的任务上。',
      en: 'High validation failure rate; one tool used for semantically different tasks.',
    },
  },
  {
    key: 'context',
    icon: '🫠',
    name: { zh: '上下文中毒 / 溢出', en: 'Context poisoning / overflow' },
    symptom: {
      zh: '忘记约束、重复已完成步骤、被一段无关的旧工具输出带偏。',
      en: 'Forgets constraints, repeats completed steps, gets derailed by an irrelevant old tool output.',
    },
    cause: {
      zh: '工具返回整页内容、历史无限增长、压缩时把关键约束一起删了。',
      en: 'Whole pages in tool results, unbounded history, and compaction that deletes the key constraint.',
    },
    fix: {
      zh: '裁剪 + 结构化摘要 + 固定约束置顶；重要状态外置到文件或数据库。',
      en: 'Prune, structured summaries, pin constraints to the top; externalize important state.',
    },
    fingerprint: {
      zh: '轮次越靠后，指令遵循越差；token 占用呈锯齿后突然失控。',
      en: 'Instruction following degrades over turns; token usage saws, then spikes.',
    },
  },
  {
    key: 'premature',
    icon: '🏁',
    name: { zh: '过早收敛', en: 'Premature convergence' },
    symptom: {
      zh: '「已完成」说得很干脆，但测试没跑、边界没测、需求只做了一半。',
      en: 'A confident “done” with no tests, no edge cases, and half the requirement missing.',
    },
    cause: {
      zh: '完成条件靠模型自述；验收标准模糊；没有独立的验证步骤。',
      en: 'Completion relies on self-report; acceptance criteria are vague; no independent verification.',
    },
    fix: {
      zh: '把「完成」绑定到证据：测试、类型检查、截图、验收脚本必须通过。',
      en: 'Bind “done” to evidence: tests, type checks, screenshots and acceptance scripts must pass.',
    },
    fingerprint: {
      zh: 'finish 信号出现在验证 span 之前；测试工具从未被调用。',
      en: 'The finish signal appears before verification spans; test tools were never called.',
    },
  },
  {
    key: 'phantom',
    icon: '🎭',
    name: { zh: '幽灵成功', en: 'Phantom success' },
    symptom: {
      zh: '所有指标都绿，行为却是错的：测试通过了，但用户拿到的是错误答案。',
      en: 'Every metric is green while behavior is wrong: tests pass, but the user gets the wrong answer.',
    },
    cause: {
      zh: '测试没有覆盖真实意图；用代理指标代替验收；验证和生成由同一个模型完成。',
      en: 'Tests miss the real intent; proxy metrics replace acceptance; one model both generates and judges.',
    },
    fix: {
      zh: '写行为级验收用例；引入独立 reviewer；高风险输出保留人工抽检。',
      en: 'Write behavior-level acceptance cases, add an independent reviewer, keep human spot checks for high-risk output.',
    },
    fingerprint: {
      zh: '指标全绿但投诉率上升；回滚原因集中在「逻辑不对」而非「跑不起来」。',
      en: 'Green dashboards with rising complaints; rollbacks cite wrong logic, not crashes.',
    },
  },
  {
    key: 'cascade',
    icon: '🁣',
    name: { zh: '级联错误', en: 'Cascading errors' },
    symptom: {
      zh: '第一步读错了一个字段，后面十步都在这个错误前提上认真工作。',
      en: 'Step one misreads a field; the next ten steps work diligently on a false premise.',
    },
    cause: {
      zh: '动作颗粒度太大、没有中间检查点、错误被当成事实继续传播。',
      en: 'Actions are too coarse, there are no mid-point checks, and errors are treated as facts.',
    },
    fix: {
      zh: '小步执行 + 每步验证 + checkpoint；发现前提错误时回滚，而不是继续打补丁。',
      en: 'Small steps, per-step verification, checkpoints; roll back a false premise instead of patching on top.',
    },
    fingerprint: {
      zh: '错误集中在首个异常 span 之后；后续步骤引用了一个错误的 ID 或字段。',
      en: 'Errors cluster after the first anomalous span; later steps cite a wrong ID or field.',
    },
  },
  {
    key: 'permission',
    icon: '🔓',
    name: { zh: '权限越界', en: 'Permission overreach' },
    symptom: {
      zh: 'Agent 删了不该删的表、给全体用户发了邮件，或者用了过大的服务账号。',
      en: 'The agent drops the wrong table, emails all users, or runs with an oversized service account.',
    },
    cause: {
      zh: '凭据权限过大、破坏性工具没有闸门、缺少审批与幂等设计。',
      en: 'Oversized credentials, no gate on destructive tools, no approval or idempotency design.',
    },
    fix: {
      zh: '最小权限 + 破坏性动作强制人工审批 + 幂等键 + 可回滚。',
      en: 'Least privilege, mandatory human approval for destructive actions, idempotency keys, rollback.',
    },
    fingerprint: {
      zh: '生产环境出现 Agent 发起的写操作；审批日志为空或集中在同一秒。',
      en: 'Agent-initiated writes appear in production; approval logs are empty or clustered in one second.',
    },
  },
];

const detectors = [
  {
    mode: { zh: '无限循环', en: 'Infinite loop' },
    signal: { zh: '同 fingerprint 连续次数', en: 'Consecutive identical fingerprints' },
    threshold: { zh: '≥ 3 次', en: '≥ 3' },
  },
  {
    mode: { zh: '工具幻觉', en: 'Tool hallucination' },
    signal: { zh: '参数校验失败率 / 未知工具调用', en: 'Validation failure rate / unknown tool calls' },
    threshold: { zh: '> 2% 即告警', en: 'Alert above 2%' },
  },
  {
    mode: { zh: '上下文溢出', en: 'Context overflow' },
    signal: { zh: '输入 token / 窗口上限', en: 'Input tokens / window limit' },
    threshold: { zh: '> 75% 触发压缩', en: 'Compact above 75%' },
  },
  {
    mode: { zh: '过早收敛', en: 'Premature convergence' },
    signal: { zh: 'finish 前是否存在验证 span', en: 'Verification span present before finish' },
    threshold: { zh: '缺失即失败', en: 'Missing means failure' },
  },
  {
    mode: { zh: '幽灵成功', en: 'Phantom success' },
    signal: { zh: '满意度 / 回滚率 / 人工抽检', en: 'Satisfaction / rollback rate / human audit' },
    threshold: { zh: '与绿灯背离即调查', en: 'Investigate divergence from green' },
  },
  {
    mode: { zh: '级联错误', en: 'Cascading errors' },
    signal: { zh: '首个错误 span 后的失败密度', en: 'Failure density after the first error span' },
    threshold: { zh: '连续 2 步依赖错误前提', en: 'Two steps depend on a false premise' },
  },
  {
    mode: { zh: '权限越界', en: 'Permission overreach' },
    signal: { zh: '高风险写操作 / 审批覆盖率', en: 'Risky writes / approval coverage' },
    threshold: { zh: '必须 100% 审批', en: 'Must be 100% approved' },
  },
];

export function Chapter08() {
  const { lang } = useLang();
  const [flipped, setFlipped] = useState<number | null>(null);
  const c = {
    zh: {
      kicker: 'FAILURE',
      title: '失败模式图鉴',
      p1: 'Agent 的失败通常不科幻，反而很朴素：忘了、重复了、猜错了、做过头了。把常见失败命名，是为了在监控面板上认出它们，而不是每次事故都从零复盘。',
      p2: '无限循环最容易发现，也最容易预防。它的反直觉之处在于：每一轮都成功。模型没有报错，工具正常返回，只是整体没有前进。所以你需要的不是错误率告警，而是「无进展」告警。',
      p3: '工具幻觉通常不是模型「坏」，而是界面「糊」。工具名像内部函数、参数是一个万能 object、描述只有一句「执行操作」——换你你也猜。把 ACI 写清楚，这类失败会显著下降。',
      p4: '上下文中毒和溢出是慢性病。早期的表现不是崩溃，而是「越聊越不听话」：忘了最初约束、重复已完成步骤、被一段无关的旧输出带偏。等到爆窗口时，已经很难追溯是哪一段污染了决策。',
      p5: '过早收敛和幽灵成功是两种「绿灯事故」。前者是没验证就说完成；后者更阴险——验证了，但验证错了。测试通过、指标全绿，行为却不对，因为测试没有覆盖真实意图。',
      p6: '级联错误的关键特征是：第一个错误很小，后面每一步都很努力。Agent 不会因为前提错了就停下来，它会在这个错误前提上继续认真工作。所以 checkpoint 和分步验证不是锦上添花，是止损装置。',
      p7: '权限越界是所有失败里后果最重的一类。模型没有恶意，它只是把你给的权限用到了极致。最小权限、审批闸门、幂等键、可回滚——这四件事缺一不可。',
      p8: '把下面七张卡翻过来，你会看到每种失败的根因、修法和「trace 指纹」。这张图鉴不是让你背，而是让你在搭系统时提前埋好探测器。',
      flipHint: { zh: '悬停或点击翻面', en: 'Hover or tap to flip' },
      cause: { zh: '根因', en: 'Root cause' },
      fix: { zh: '修法', en: 'Fix' },
      fingerprint: { zh: 'Trace 指纹', en: 'Trace fingerprint' },
      detectorTitle: '探测器矩阵',
      tableHead: ['失败模式', '监控信号', '建议阈值'],
      rows: detectors.map((d) => [d.mode[lang], d.signal[lang], d.threshold[lang]]),
      calloutTitle: '最危险的失败：所有指标都绿',
      callout:
        '语义 bug 不会让系统宕机。它会让测试通过、监控安静、用户困惑。对抗它的唯一办法，是把「真实意图」写成可执行的验收用例，并保留独立的人或模型做最后一道判断。',
    },
    en: {
      kicker: 'FAILURE',
      title: 'A field guide to failure modes',
      p1: 'Agent failures are rarely science fiction. They are mundane: forgot, repeated, guessed wrong, overdid it. Naming common failures helps you recognize them on a dashboard instead of re-deriving every incident from scratch.',
      p2: 'Infinite loops are the easiest to spot and the easiest to prevent. The counterintuitive part: every turn succeeds. No errors, tools return normally, the whole just does not move. So you need a “no progress” alert, not an error-rate alert.',
      p3: 'Tool hallucination is usually not a “bad model” but a blurry interface. Names that look like internal functions, one omnipotent object parameter, a description that says “performs an operation” — you would guess too. A clear ACI cuts this failure sharply.',
      p4: 'Context poisoning and overflow are chronic. Early symptoms are not crashes but “the longer we talk, the less it listens”: forgotten constraints, repeated steps, derailment by an irrelevant old output. By the time the window overflows, tracing the polluting segment is hard.',
      p5: 'Premature convergence and phantom success are two kinds of green-light incident. The first declares done without verification. The second is sneakier: it verifies, but verifies the wrong thing. Tests pass, metrics are green, behavior is wrong, because the tests missed the real intent.',
      p6: 'The signature of cascading errors is a tiny first mistake and enormous effort afterward. The agent will not stop because the premise is false; it will keep working diligently on top of it. Checkpoints and stepwise verification are not polish; they are circuit breakers.',
      p7: 'Permission overreach has the heaviest consequences. The model is not malicious; it simply uses the permissions you gave it to the fullest. Least privilege, approval gates, idempotency keys and rollback — all four.',
      p8: 'Flip the seven cards below to see each failure’s root cause, fix and trace fingerprint. This guide is not for memorization; it is for planting detectors before you ship.',
      flipHint: { zh: '悬停或点击翻面', en: 'Hover or tap to flip' },
      cause: { zh: '根因', en: 'Root cause' },
      fix: { zh: '修法', en: 'Fix' },
      fingerprint: { zh: 'Trace 指纹', en: 'Trace fingerprint' },
      detectorTitle: 'Detector matrix',
      tableHead: ['Failure mode', 'Signal', 'Suggested threshold'],
      rows: detectors.map((d) => [d.mode[lang], d.signal[lang], d.threshold[lang]]),
      calloutTitle: 'The most dangerous failure: everything is green',
      callout:
        'A semantic bug does not take the system down. It lets tests pass, dashboards stay quiet and users stay confused. The only defense is to encode real intent as executable acceptance cases, and keep an independent human or model for the final judgment.',
    },
  }[lang];

  return (
    <Section id="ch8" num="08" title={c.title} kicker={c.kicker} sources={['dataiku-observability', 'aws-agentcore-blog', 'anthropic-agents']}>
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

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((mode, index) => (
          <article
            key={mode.key}
            className={`flip-card card-hover ${flipped === index ? 'is-flipped' : ''}`}
            style={{ minHeight: 320 }}
            role="button"
            tabIndex={0}
            aria-pressed={flipped === index}
            aria-label={`${mode.name[lang]} — ${c.flipHint[lang]}`}
            onClick={() => setFlipped((current) => (current === index ? null : index))}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setFlipped((current) => (current === index ? null : index));
              }
            }}
          >
            <div className="flip-inner" style={{ minHeight: 320 }}>
              <div className="flip-face" style={{ minHeight: 320 }}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[1.5rem]" aria-hidden="true">
                    {mode.icon}
                  </span>
                  <span className="font-mono text-[0.62rem] text-[var(--muted)]">0{index + 1}</span>
                </div>
                <h3 className="text-[0.98rem] font-bold text-[var(--text)]">{mode.name[lang]}</h3>
                <p className="mt-2 text-[0.78rem] leading-relaxed text-[var(--text-soft)]">{mode.symptom[lang]}</p>
                <span className="mt-auto pt-3 text-[0.66rem] font-semibold text-[var(--primary-strong)]">
                  {c.flipHint[lang]} ↻
                </span>
              </div>
              <div className="flip-face flip-back" style={{ minHeight: 320 }}>
                <div className="space-y-2 overflow-y-auto">
                  <div>
                    <div className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--accent)]">{c.cause[lang]}</div>
                    <p className="mt-0.5 text-[0.74rem] leading-relaxed text-[var(--text-soft)]">{mode.cause[lang]}</p>
                  </div>
                  <div>
                    <div className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--ok)]">{c.fix[lang]}</div>
                    <p className="mt-0.5 text-[0.74rem] leading-relaxed text-[var(--text-soft)]">{mode.fix[lang]}</p>
                  </div>
                  <div>
                    <div className="text-[0.6rem] font-bold uppercase tracking-wider text-[var(--primary-strong)]">{c.fingerprint[lang]}</div>
                    <p className="mt-0.5 text-[0.74rem] leading-relaxed text-[var(--text-soft)]">{mode.fingerprint[lang]}</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <Callout tone="danger" title={c.calloutTitle} icon="🎭">
        {c.callout}
      </Callout>

      <div>
        <h3 className="mb-3 text-[1.05rem] font-bold text-[var(--text)]">{c.detectorTitle}</h3>
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
      </div>
    </Section>
  );
}
