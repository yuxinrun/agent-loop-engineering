import { Section } from '../components/Section';
import { Callout } from '../components/Callout';
import { CodeBlock } from '../components/CodeBlock';
import { useLang } from '../i18n/LangContext';

const examples = [
  {
    key: 'search',
    bad: `// 名字模糊，描述等于没说
search(q: string)`,
    good: `search_docs({
  query: string,        // 用户问题原文
  scope: "api" | "guides" | "changelog",
  maxResults?: number   // 1-10，默认 5
})`,
    badNote: {
      zh: '模型不知道搜什么库、返回什么、什么时候不该用。',
      en: 'The model cannot tell which corpus, what comes back, or when not to use it.',
    },
    goodNote: {
      zh: '名称自解释，参数有边界，scope 把选择收窄到三个值。',
      en: 'Self-describing name, bounded parameters, and a scope narrowed to three values.',
    },
  },
  {
    key: 'update',
    bad: `update(data: object)  // 万能更新`,
    good: `update_ticket({
  ticketId: string,
  status: "open" | "pending" | "resolved",
  note: string
})`,
    badNote: {
      zh: '一个 object 参数，等于把校验责任全丢给模型。',
      en: 'One object parameter dumps all validation responsibility on the model.',
    },
    goodNote: {
      zh: '资源、动作、字段都写死在 schema 里，错了会被校验挡住。',
      en: 'Resource, action and fields live in the schema; mistakes are caught by validation.',
    },
  },
  {
    key: 'error',
    bad: `throw new Error("failed")`,
    good: `{
  ok: false,
  code: "RATE_LIMITED",
  retryable: true,
  hint: "Wait 2s and retry, or narrow the query."
}`,
    badNote: {
      zh: '模型只看到「失败了」，于是原样重试到天荒地老。',
      en: 'The model sees “failed” and retries identically until the heat death of the universe.',
    },
    goodNote: {
      zh: '错误是给模型看的界面：告诉它能不能重试、下一步怎么走。',
      en: 'Errors are an interface for the model: can it retry, and what should it do next?',
    },
  },
];

export function Chapter06() {
  const { lang } = useLang();
  const c = {
    zh: {
      kicker: 'TOOLS',
      title: '工具与 ACI 设计',
      p1: '工具是 Agent 的手。但很多团队把它当内部函数暴露出去：名字叫 `doStuff`，参数是一个 `object`，出错就 throw。然后困惑为什么模型总是乱调。',
      p2: 'ACI（Agent-Computer Interface）这个词值得记住。你为人类设计 UI，为 Agent 设计 ACI。模型看不到你的数据库、你的代码结构、你脑子里的隐含规则；它只能看到工具名、描述、参数 schema 和返回结果。这四样东西，就是它的全部世界。',
      p3: '第一原则：名称和描述要能独立回答三个问题——这个工具做什么、什么时候该用、什么时候不该用。OpenAI 的工具文档也强调清晰命名与精确描述，因为模型是靠这些文本做选择的。',
      p4: '第二原则：参数 schema 是护栏，不是文档。能用 enum 就不要用 string，能写 maxLength 就不要靠模型自觉。Zod 这类 schema 库的好处是同一份定义既做运行时校验，又能转成工具声明，还能生成 TypeScript 类型。',
      p5: '第三原则：返回值要为下一轮决策服务。一个工具返回 40 页 JSON，模型既读不完也记不住。返回它真正需要的字段：标题、摘要、ID、URL，再加一个「如何获取更多」的入口。',
      p6: '第四原则：错误也是界面。不要抛堆栈，返回结构化错误：`code`、`retryable`、`hint`。模型看到「RATE_LIMITED，2 秒后重试或缩小查询范围」，才有可能做出正确动作；看到「Internal Error」，它只会原样再试一次。',
      p7: '第五原则：工具不是越多越好。每多一个工具，模型就多一次选错的机会，你也多一份权限和审计负担。把 20 个细碎工具收成 6 个语义清晰的工具，通常会立刻提升成功率。',
      p8: '最后，破坏性动作要单独设计：删除、付款、发布、发邮件，应该有明确的权限门、幂等键和人工审批。工具的能力边界，就是 Agent 的能力边界；工具的坏脾气，也会变成 Agent 的坏脾气。',
      calloutTitle: '工具描述是提示词的一部分',
      callout:
        '你写系统提示词时很认真，写工具描述时却很随意。但对模型来说，两者没有区别——它们都在同一个上下文里竞争注意力。把工具描述当成面向模型的产品文案来写。',
      tableHead: ['设计面', '要回答的问题', '反例'],
      rows: [
        ['名称', '不看描述，能猜到它做什么吗？', '`process`、`handle`、`doStuff`'],
        ['描述', '何时用、何时不用、返回什么？', '「执行操作」'],
        ['参数', '类型、范围、默认值、单位清楚吗？', '`data: object`'],
        ['返回', '下一步决策真正需要哪些字段？', '整页 JSON、无分页提示'],
        ['错误', '可重试吗？下一步该做什么？', '只抛 `Error("failed")`'],
        ['权限', '谁可以调、是否需要审批？', '所有工具全开放'],
      ],
      schemaTitle: '一份 schema，三处复用',
      schemaPoints: [
        { zh: '运行时校验：模型给的参数先 parse，再进业务逻辑。', en: 'Runtime validation: parse model arguments before business logic.' },
        { zh: '工具声明：转成 JSON Schema 交给 SDK，让模型知道参数形状。', en: 'Tool declaration: convert to JSON Schema for the SDK so the model knows the shape.' },
        { zh: '类型安全：从同一份 schema 推导 TypeScript 类型。', en: 'Type safety: derive TypeScript types from the same schema.' },
      ],
      codeCaption: {
        zh: 'Zod + zod-to-json-schema 的常见写法；`db` 与 `zodToJsonSchema` 由你的项目提供。',
        en: 'A common Zod + zod-to-json-schema setup; `db` and `zodToJsonSchema` come from your project.',
      },
    },
    en: {
      kicker: 'TOOLS',
      title: 'Tools and ACI design',
      p1: 'Tools are the agent’s hands. Many teams expose them like internal functions: named `doStuff`, taking one `object`, throwing on error. Then they wonder why the model keeps calling them wrong.',
      p2: 'The term ACI — Agent-Computer Interface — is worth remembering. You design a UI for humans; you design an ACI for agents. The model cannot see your database, your code structure, or the implicit rules in your head. It sees tool names, descriptions, parameter schemas and return values. Those four things are its entire world.',
      p3: 'Principle one: names and descriptions must independently answer three questions — what does this do, when should it be used, and when should it not. OpenAI’s tool docs also stress clear naming and precise descriptions, because the model chooses based on that text.',
      p4: 'Principle two: the parameter schema is a guardrail, not documentation. Use an enum instead of a string; add maxLength instead of trusting the model. A schema library like Zod lets one definition do runtime validation, produce the tool declaration, and generate TypeScript types.',
      p5: 'Principle three: return values should serve the next decision. A tool that returns forty pages of JSON is unreadable and unmemorable. Return the fields the model actually needs — title, summary, ID, URL — plus one way to fetch more.',
      p6: 'Principle four: errors are interface too. Do not throw a stack trace; return a structured error with `code`, `retryable` and `hint`. “RATE_LIMITED, retry in 2s or narrow the query” gives the model a correct next move. “Internal Error” just makes it retry identically.',
      p7: 'Principle five: more tools is not better. Every extra tool is another chance to choose wrong, plus more permissions and audit burden. Collapsing twenty tiny tools into six clear ones usually raises success rate immediately.',
      p8: 'Finally, design destructive actions separately: deletes, payments, publishing, sending email. They need explicit permission gates, idempotency keys and human approval. A tool’s capability boundary is the agent’s capability boundary; a tool’s bad temper becomes the agent’s bad temper.',
      calloutTitle: 'Tool descriptions are part of the prompt',
      callout:
        'You are careful with the system prompt and casual with tool descriptions. To the model there is no difference — they share one context and compete for attention. Write tool descriptions like product copy aimed at the model.',
      tableHead: ['Surface', 'Question it must answer', 'Anti-pattern'],
      rows: [
        ['Name', 'Can you guess what it does without the description?', '`process`, `handle`, `doStuff`'],
        ['Description', 'When to use, when not, what it returns?', '“Performs an operation”'],
        ['Parameters', 'Types, ranges, defaults, units?', '`data: object`'],
        ['Return', 'Which fields does the next decision need?', 'A full JSON page, no pagination hint'],
        ['Errors', 'Retryable? What next?', 'Just `Error("failed")`'],
        ['Permissions', 'Who may call it? Does it need approval?', 'Everything open to everyone'],
      ],
      schemaTitle: 'One schema, three uses',
      schemaPoints: [
        { zh: '运行时校验：模型给的参数先 parse，再进业务逻辑。', en: 'Runtime validation: parse model arguments before business logic.' },
        { zh: '工具声明：转成 JSON Schema 交给 SDK，让模型知道参数形状。', en: 'Tool declaration: convert to JSON Schema for the SDK so the model knows the shape.' },
        { zh: '类型安全：从同一份 schema 推导 TypeScript 类型。', en: 'Type safety: derive TypeScript types from the same schema.' },
      ],
      codeCaption: {
        zh: 'Zod + zod-to-json-schema 的常见写法；`db` 与 `zodToJsonSchema` 由你的项目提供。',
        en: 'A common Zod + zod-to-json-schema setup; `db` and `zodToJsonSchema` come from your project.',
      },
    },
  }[lang];

  const schemaCode = `import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const SearchDocsArgs = z.object({
  query: z.string().min(2).describe("用户问题的自然语言原文"),
  scope: z.enum(["api", "guides", "changelog"]).default("api"),
  maxResults: z.number().int().min(1).max(10).default(5),
});

export const searchDocsTool = {
  name: "search_docs",
  description:
    "在产品文档中检索。适用于用户询问 API 用法、配置步骤或版本变更；" +
    "不要用于查询内部代码或数据库。返回标题、摘要、URL 与 ID。",
  parameters: zodToJsonSchema(SearchDocsArgs),
  execute: async (raw: unknown) => {
    const { query, scope, maxResults } = SearchDocsArgs.parse(raw);
    try {
      const hits = await db.search({ query, scope, limit: maxResults });
      return hits.map(({ id, title, url, snippet }) => ({ id, title, url, snippet }));
    } catch (error) {
      return {
        ok: false,
        code: "SEARCH_UNAVAILABLE",
        retryable: true,
        hint: "2 秒后重试；仍失败则改用 fetch_page 直接读取已知 URL。",
      };
    }
  },
};`;

  return (
    <Section
      id="ch6"
      num="06"
      title={c.title}
      kicker={c.kicker}
      sources={['openai-tools', 'openai-guide', 'anthropic-agents']}
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

      <div className="grid gap-3 lg:grid-cols-3">
        {examples.map((example) => (
          <div key={example.key} className="card flex flex-col overflow-hidden">
            <div className="border-b border-[var(--line)] bg-[color-mix(in_srgb,var(--danger)_6%,var(--surface))] px-3 py-2">
              <span className="font-mono text-[0.64rem] font-bold text-[var(--danger)]">
                {lang === 'zh' ? '✗ 反例' : '✗ BAD'}
              </span>
            </div>
            <pre className="overflow-x-auto px-3 py-2 font-mono text-[0.68rem] leading-relaxed text-[var(--text-soft)]">
              <code>{example.bad}</code>
            </pre>
            <p className="px-3 pb-3 text-[0.72rem] leading-relaxed text-[var(--muted)]">{example.badNote[lang]}</p>
            <div className="mt-auto border-t border-[var(--line)] bg-[color-mix(in_srgb,var(--ok)_6%,var(--surface))] px-3 py-2">
              <span className="font-mono text-[0.64rem] font-bold text-[var(--ok)]">
                {lang === 'zh' ? '✓ 正例' : '✓ GOOD'}
              </span>
            </div>
            <pre className="overflow-x-auto px-3 py-2 font-mono text-[0.68rem] leading-relaxed text-[var(--text-soft)]">
              <code>{example.good}</code>
            </pre>
            <p className="px-3 pb-3 text-[0.72rem] leading-relaxed text-[var(--muted)]">{example.goodNote[lang]}</p>
          </div>
        ))}
      </div>

      <Callout tone="warn" title={c.calloutTitle} icon="🔧">
        {c.callout}
      </Callout>

      <div>
        <h3 className="mb-2 text-[1.05rem] font-bold text-[var(--text)]">{c.schemaTitle}</h3>
        <ul className="prose-block mb-3 list-disc">
          {c.schemaPoints.map((point) => (
            <li key={point.en}>{point[lang]}</li>
          ))}
        </ul>
        <CodeBlock code={schemaCode} language="typescript" filename="tools/search-docs.ts" caption={c.codeCaption[lang]} />
      </div>
    </Section>
  );
}
