# Agent Loop Engineering · 智能体循环工程实战指南

写给有编程基础、但没做过 Agent 的开发者的实战指南：14 章讲透 `Context → Action → Verify → Loop`，目标是让你的 Agent **会干活、会刹车、不烧钱、不空转**。

线上地址：<https://yuxinrun.github.io/agent-loop-engineering/>

站点为纯静态 SPA，无后端、无外部图片、无图表库依赖；首页 / 章节两级视图、中 / EN 双语、明暗主题、浏览器本地听书、可交互 Checklist 全部在客户端完成。

## 技术栈

- Vite 6 + React 18 + TypeScript 5
- Tailwind CSS 3（`darkMode: 'class'`，颜色通过 CSS 变量驱动）
- 暖纸色 + 青绿品牌体系，自托管 Manrope Variable / JetBrains Mono Variable（构建时内联）
- 自绘 SVG / CSS 图表（折线、堆叠面积、瀑布图、环形循环图）
- 听书：浏览器 `speechSynthesis`（Web Speech API），零音频文件、零第三方服务
- IntersectionObserver（滚动入场、数字滚动）
- localStorage 持久化主题（`ale:theme`）、语言（`ale:lang`）、Checklist（`ale:checklist`）与朗读设置（`ale:tts`）

## 本地运行

```bash
npm install
npm run dev        # http://localhost:5173
```

生产构建与本地预览：

```bash
npm run build      # 类型检查 + 构建 + 把 JS/CSS 内联进 dist/index.html
npm run preview    # 本地预览 dist/
```

字体通过 Vite 的 `assetsInlineLimit` 转成 data URI，构建脚本 `scripts/inline-build.mjs` 再把 JS/CSS 内联进 `dist/index.html`，因此产物是**单个自包含 HTML**（另有 favicon），既可以直接双击 `dist/index.html` 用 `file://` 打开，也可以放到任意静态服务器：

```bash
npx serve dist
```

## 部署

`vite.config.ts` 已设置 `base: './'`，因此产物可以放在域名根目录，也可以放在子路径下。站点没有前端路由，无需配置 SPA fallback。

| 平台 | 配置 |
| --- | --- |
| **Vercel** | 导入仓库，Framework 选 Vite，Build Command `npm run build`，Output Directory `dist` |
| **Netlify** | Build Command `npm run build`，Publish directory `dist` |
| **GitHub Pages** | 已启用并由 [deploy.yml](.github/workflows/deploy.yml) 自动发布 `dist`：每次 push 到 `main` 构建并部署。Pages 的 Source 必须保持 **GitHub Actions**；不要再添加 `jekyll-gh-pages` 之类部署仓库根目录的工作流，否则会覆盖构建产物，导致页面加载 `/src/main.tsx` 404 |
| **Cloudflare Pages** | Build Command `npm run build`，Build output directory `dist` |

## 目录结构

```text
agent-loop-engineering/
├─ index.html                 # 标题 / SEO meta / 首屏防闪烁的主题与语言引导脚本
├─ package.json
├─ vite.config.ts             # base: './'，面向静态托管
├─ tailwind.config.js         # darkMode: 'class'、字体与版心
├─ tsconfig.json
├─ postcss.config.js
├─ public/
│  └─ favicon.svg             # 项目专属「循环节点」SVG 图标
├─ src/
│  ├─ main.tsx                # React 入口
│  ├─ App.tsx                 # 路由分发：首页（Hero + 统计 + 目录卡片）/ 章节页（侧栏 + 单章 + 翻页）
│  ├─ index.css               # 设计系统：品牌变量、字体、卡片、代码块、图表、播放条、动效、响应式
│  ├─ assets/fonts/           # Manrope / JetBrains Mono Variable（构建时内联）
│  ├─ i18n/
│  │  └─ LangContext.tsx      # 中 / EN 上下文，默认中文，localStorage 记忆
│  ├─ lib/
│  │  ├─ hooks.ts             # useTheme / useLocalStorage / useCountUp
│  │  ├─ router.ts            # hash 路由：#chN 进章节，#/ 或空回首页
│  │  ├─ tts.ts               # 朗读文本抽取 + 语音匹配（Web Speech API）
│  │  └─ TtsContext.tsx       # 听书状态机：播放/暂停/逐段/自动联播/设置持久化
│  ├─ content/
│  │  ├─ chapters.ts          # 14 章元数据、一句话导览与四个篇章分组
│  │  └─ sources.ts           # 23 个已核验的一手 / 官方来源
│  ├─ components/
│  │  ├─ Navbar.tsx           # 固定顶栏、语言 / 主题切换、移动端汉堡菜单
│  │  ├─ Sidebar.tsx          # 章节页左侧目录（首页不渲染）
│  │  ├─ TocNav.tsx           # 目录分组与当前章节高亮
│  │  ├─ ChapterGrid.tsx      # 首页 14 章卡片，含「听」按钮
│  │  ├─ ChapterChrome.tsx    # 章节顶栏（返回 / 听本章）与底部上一章 / 下一章
│  │  ├─ AudioPlayer.tsx      # 底部常驻播放条与不支持时的友好提示
│  │  ├─ Hero.tsx             # 首屏文案 + 四节点循环动画
│  │  ├─ StatsBand.tsx        # 128K / 50–100 / 177 / 3× 数字滚动
│  │  ├─ Section.tsx          # 章节外壳、标题、来源 chips
│  │  ├─ CodeBlock.tsx        # 深色代码卡、行号、语法高亮、一键复制
│  │  ├─ Callout.tsx          # 提示 / 警告 / 危险块
│  │  ├─ SourceChip.tsx       # 「📖 来源」外链
│  │  ├─ Reveal.tsx           # 滚动入场
│  │  ├─ RippleButton.tsx     # 按钮弹簧缩放与涟漪
│  │  ├─ BackToTop.tsx        # 回到顶部（自动避开播放条）
│  │  ├─ Logo.tsx             # 项目专属循环 Logo
│  │  └─ Footer.tsx           # 页脚与署名
│  └─ sections/
│     ├─ Chapter01.tsx        # 世界观：从一次调用到循环
│     ├─ Chapter02.tsx        # 四步反馈环（可点击环形图）
│     ├─ Chapter03.tsx        # 五种 Loop 形态 + 决策树
│     ├─ Chapter04.tsx        # 停止条件、停滞检测、AWS 177-span 事故
│     ├─ Chapter05.tsx        # 上下文窗口生存（堆叠面积图）
│     ├─ Chapter06.tsx        # 工具与 ACI 设计
│     ├─ Chapter07.tsx        # HITL 与 LangGraph interrupt
│     ├─ Chapter08.tsx        # 七张失败模式翻转卡
│     ├─ Chapter09.tsx        # 可观测性与瀑布图
│     ├─ Chapter10.tsx        # 成本曲线与四道保险丝
│     ├─ Chapter11.tsx        # 三个实战案例（Tab 切换）
│     ├─ Chapter12.tsx        # 框架横评与分层地图
│     ├─ Chapter13.tsx        # 11 项 Checklist、进度条、彩带
│     └─ Chapter14.tsx        # 来源库与阅读路径
├─ scripts/
│  └─ inline-build.mjs        # 构建后将 JS/CSS 内联，产出单文件 HTML
└─ dist/                      # 构建产物（dist/index.html + favicon）
```

## 章节目录

**第一部分 · 地基 Foundations**

1. 世界观：从一次 API 调用到 Agent 循环
2. Loop 的解剖学：四步反馈环
3. Loop 的五种形态

**第二部分 · 控制 Control**

4. 停止条件的艺术
5. 上下文窗口生存指南
6. 工具与 ACI 设计
7. 人在回路（HITL）

**第三部分 · 生产 Production**

8. 失败模式图鉴
9. 可观测性与调试
10. 成本与性能工程

**第四部分 · 实战 Practice**

11. 三个实战案例
12. 框架横评
13. 落地 Checklist
14. 延伸阅读与一手来源

## 交互与验收点

- 暖纸色 + 青绿品牌体系，深色为深绿底；1180 版心、306 侧栏、68 导航、780 正文。
- 首页只有 Hero、数据条与 14 章卡片，**不显示左侧目录**；点卡片（或顶栏 Checklist / 汉堡菜单）进入章节后才出现侧栏目录，并高亮当前章节。
- 路由为 hash：`#chN` 打开对应章节、`#/` 回首页，可分享、可前进后退、直达链接自动滚到顶部并更新文档标题。
- 章节底部有上一章 / 下一章卡片，顶栏有「全部章节」返回入口。
- 听书：章节顶栏「听本章」或首页卡片的「听」按钮，用浏览器 `speechSynthesis` 朗读当前语言正文；代码块、表格、翻转卡与来源链接自动跳过。
- 底部常驻播放条：逐段进度、播放 / 暂停、上下一段、上下章、语速 0.75–1.75×、音色选择、「自动联播下一章」开关，Esc 关闭；设置存 `ale:tts`。
- 朗读时当前段落高亮并自动滚入视野；切换语言会停止旧脚本并按新语言重新抽取。
- 浏览器或系统不支持语音时给出分平台指引（Windows / macOS / iOS / Android），并提供「用现有音色继续」「改用英文 / 中文朗读」两个出口，不留死按钮。
- 右上角明暗主题 / 中英切换，无刷新、淡入淡出、`localStorage` 记忆。
- 第 2 章环形图节点可点击，也可自动轮播。
- 第 8 章七张失败模式卡支持点击、键盘与悬停 3D 翻转。
- 第 11 章三个案例 Tab 切换。
- 第 13 章 Checklist 可勾选、持久化；11 项全勾选后触发彩带与庆祝文案。
- 代码块带行号、语法高亮、横向滚动与复制按钮；表格在窄屏可横滑。
- 所有动效遵循 `prefers-reduced-motion`。

## 来源与内容原则

- 关键结论均附「📖 来源」外链，指向 Anthropic / OpenAI / LangChain / Microsoft / AWS / 阿里云 / 字节跳动等官方页面或原始文章。
- 内容为综合改写，不整段搬运原文。
- 核验阶段无法确认原始 URL 的社区文章（Agentic Engineering Guide 第 17 章、Growth Engineer 的 11 个失败模式、OpenLegion 调试文）没有硬编链接；相同观点改由可验证的一手来源与 Dataiku 的 Agent 可观测性文章支撑。
- 文中 API 片段是教学用骨架，字段名以各框架官方文档为准。

## 许可与署名

内容与代码仅用于学习交流；引用内容的版权归原作者所有。  
© 2026 鱼心快跑 · Yuxin Rush, Bugs Gone · Made with ❤️ by 鱼心
