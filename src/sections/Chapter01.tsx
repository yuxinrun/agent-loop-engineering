import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { useLang } from '../i18n/LangContext';

function CompareDiagram() {
  const { t } = useLang();

  return (
    <figure className="figure">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="chip">{t('单轮', 'Single turn')}</span>
            <span className="font-mono text-[0.6rem] text-[var(--muted)]">request → response</span>
          </div>
          <div className="flex flex-col items-stretch gap-2">
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-center text-[0.76rem] font-semibold">
              {t('你问一句', 'You ask')}
            </div>
            <div className="text-center text-[var(--muted)]" aria-hidden="true">↓</div>
            <div className="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-center text-[0.76rem] font-semibold">
              {t('模型回答', 'Model answers')}
            </div>
            <div className="text-center text-[var(--muted)]" aria-hidden="true">↓</div>
            <div className="rounded-lg border border-dashed border-[var(--line-strong)] px-3 py-2.5 text-center text-[0.74rem] text-[var(--muted)]">
              {t('结束。世界没有改变。', 'Done. Nothing in the world changed.')}
            </div>
          </div>
          <p className="mt-4 text-[0.68rem] leading-relaxed text-[var(--muted)]">
            {t(
              '像自动售货机：投币、掉货、走人。',
              'Like a vending machine: insert coin, get snack, leave.',
            )}
          </p>
        </div>

        <div className="rounded-xl border border-[color-mix(in_srgb,var(--primary)_35%,var(--line))] bg-[var(--primary-soft)] p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="chip chip-primary">{t('闭环', 'Closed loop')}</span>
            <span className="font-mono text-[0.6rem] text-[var(--primary-strong)]">think → act → observe</span>
          </div>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--primary)_30%,var(--line))] bg-[var(--surface)] px-2.5 py-3 text-center">
              <div className="text-[0.72rem] font-bold">{t('模型决策', 'Model decides')}</div>
              <div className="mt-1 font-mono text-[0.56rem] text-[var(--muted)]">tool_call</div>
            </div>
            <div className="text-center text-[var(--primary-strong)]" aria-hidden="true">→</div>
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--primary)_30%,var(--line))] bg-[var(--surface)] px-2.5 py-3 text-center">
              <div className="text-[0.72rem] font-bold">{t('运行时执行', 'Runtime runs')}</div>
              <div className="mt-1 font-mono text-[0.56rem] text-[var(--muted)]">tools</div>
            </div>
            <div className="col-span-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div />
              <div className="text-center text-[var(--primary-strong)]" aria-hidden="true">↓</div>
              <div />
            </div>
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--primary)_30%,var(--line))] bg-[var(--surface)] px-2.5 py-3 text-center">
              <div className="text-[0.72rem] font-bold">{t('观察结果', 'Observation')}</div>
              <div className="mt-1 font-mono text-[0.56rem] text-[var(--muted)]">tool_result</div>
            </div>
            <div className="text-center text-[var(--primary-strong)]" aria-hidden="true">→</div>
            <div className="rounded-lg border border-[color-mix(in_srgb,var(--primary)_30%,var(--line))] bg-[var(--surface)] px-2.5 py-3 text-center">
              <div className="text-[0.72rem] font-bold">{t('再决策', 'Decide again')}</div>
              <div className="mt-1 font-mono text-[0.56rem] text-[var(--muted)]">loop</div>
            </div>
          </div>
          <p className="mt-4 text-[0.68rem] leading-relaxed text-[var(--primary-strong)]">
            {t(
              '模型只负责「点名」，真正干活的是你的代码。',
              'The model only names the tool; your code does the work.',
            )}
          </p>
        </div>
      </div>
      <figcaption className="figure-caption">
        {t(
          '图 1-1：单轮问答 vs 闭环 Agent。差别不在模型，而在「结果是否回到模型」。',
          'Figure 1-1: single-turn Q&A vs a closed agent loop. The difference is whether the result gets fed back.',
        )}
      </figcaption>
    </figure>
  );
}

export function Chapter01() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'WORLDVIEW',
      title: '世界观：从一次 API 调用到 Agent 循环',
      p1: '先做个思想实验。你打开聊天窗口问「帮我查下明天上海天气」，模型回你一段话，结束。你们的关系像自动售货机：投币、掉货、走人。它不需要知道你为什么问，也不负责把伞塞进你包里。',
      p2: 'Agent 不是这样。你给它一个目标：「如果明天下雨，提醒我带伞，并帮我改一下日程」。它会先决定：我得看天气。于是输出一个工具调用 get_weather(city="上海", date="tomorrow")。注意，模型没有真的去查——它只是产出了一张「我要调用这个工具、参数是这些」的申请单。真正执行的是你的运行时（runtime）。',
      p3: '运行时拿到结果 {rain: true}，把它作为一条新消息塞回对话历史，再次调用模型。模型看到「哦，下雨了」，接着决定调用日历工具、给人发消息。每一步都是：模型决策 → 系统执行 → 结果回灌 → 模型再决策。直到某一轮模型不再要求调用工具，只回一段文本：循环结束。',
      p4: 'Anthropic 把这种模式概括得很朴素：Agent 就是 LLM 在循环中使用工具，根据环境反馈决定下一步。换句话说，模型是大脑，工具是手脚，while 循环是心跳。',
      p5: '所以真正要设计的不是「一句更聪明的 prompt」，而是：循环什么时候开始、每轮喂什么上下文、模型能碰哪些工具、结果怎么验证、什么时候停。这五件事，构成了后面 13 章。',
      quote: 'Agent = LLM + 工具 + 一个会自己转的 while 循环。',
      calloutTitle: '别把 workflow 当 Agent',
      callout:
        'Anthropic 区分得很清楚：workflow 用预先写好的代码路径编排 LLM；Agent 则由模型自己决定下一步走哪条路。workflow 更可控，Agent 更灵活。先问一句「我真的需要模型自己决定路径吗」，能省掉一半过度工程。',
    },
    en: {
      kicker: 'WORLDVIEW',
      title: 'From one API call to an agent loop',
      p1: 'Start with a thought experiment. You ask a chat window, “what is the weather in Shanghai tomorrow?” It replies. Done. The relationship is a vending machine: insert a coin, get a snack, walk away. It does not need to know why you asked, and it will not put an umbrella in your bag.',
      p2: 'An agent is different. Give it a goal: “If it rains tomorrow, remind me to take an umbrella and adjust my calendar.” It first decides it needs the weather, then emits a tool call: get_weather(city="Shanghai", date="tomorrow"). Notice the model did not actually check anything. It produced a request form saying which tool to call and with what arguments. Your runtime executes it.',
      p3: 'The runtime receives {rain: true}, appends it to the conversation as a new message, and calls the model again. The model sees the rain, then decides to call the calendar tool and message you. Every step is: model decides → system executes → result is fed back → model decides again. When a turn contains no tool call and only text, the loop ends.',
      p4: 'Anthropic puts it plainly: an agent is an LLM using tools in a loop, deciding what to do next from environmental feedback. The model is the brain, the tools are the hands, and the while loop is the heartbeat.',
      p5: 'So the engineering problem is not “a smarter prompt.” It is: when does the loop start, what context goes into each turn, which tools can the model touch, how is the work verified, and when does it stop. Those five questions are the next thirteen chapters.',
      quote: 'Agent = LLM + tools + a while loop that keeps itself spinning.',
      calloutTitle: 'A workflow is not an agent',
      callout:
        'Anthropic draws a clear line: workflows orchestrate LLMs through predefined code paths; agents let the model direct its own next step. Workflows are more controllable, agents more flexible. Asking “does the model really need to choose the path?” saves half of your over-engineering.',
    },
  }[lang];

  return (
    <Section id="ch1" num="01" title={c.title} kicker={c.kicker} sources={['anthropic-agents']}>
      <div className="prose-block">
        <p>{c.p1}</p>
        <p>{c.p2}</p>
        <p>{c.p3}</p>
        <p>{c.p4}</p>
        <p>{c.p5}</p>
      </div>

      <CompareDiagram />

      <div className="grid gap-4 md:grid-cols-[1.15fr_.85fr]">
        <div className="card relative overflow-hidden p-5 md:p-6">
          <div className="absolute -right-3 -top-5 font-serif text-[5rem] leading-none text-[var(--primary-soft)]" aria-hidden="true">
            “
          </div>
          <div className="relative">
            <p className="text-[1.05rem] font-semibold leading-[1.65] text-[var(--text)]">
              「{c.quote}」
            </p>
            <p className="mt-3 font-mono text-[0.64rem] tracking-wide text-[var(--muted)]">
              — {lang === 'zh' ? '本站对 Anthropic 定义的简化改写' : 'A simplified restatement of Anthropic’s definition'}
            </p>
          </div>
        </div>

        <Callout tone="warn" title={c.calloutTitle} icon="⚠">
          {c.callout}
        </Callout>
      </div>
    </Section>
  );
}
