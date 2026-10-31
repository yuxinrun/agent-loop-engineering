# Agent Loop Engineering · 智能体循环工程实战指南

写给有编程基础、但没做过 Agent 的开发者的单页实战指南：14 章讲透 `Context → Action → Verify → Loop`，目标是让你的 Agent **会干活、会刹车、不烧钱、不空转**。

线上地址：<https://yuxinrun.github.io/agent-loop-engineering/>

站点为纯静态 SPA，无后端、无外部图片、无图表库依赖；中 / EN 双语、明暗主题、滚动目录、可交互 Checklist 均在浏览器本地完成。

## 技术栈

- Vite 6 + React 18 + TypeScript 5
- Tailwind CSS 3（`darkMode: 'class'`，颜色通过 CSS 变量驱动）
- 自绘 SVG / CSS 图表（折线、堆叠面积、瀑布图、环形循环图）
- IntersectionObserver（滚动入场、目录高亮、数字滚动）
- localStorage 持久化主题、语言与 Checklist

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

构建脚本 `scripts/inline-build.mjs` 会把 JS/CSS 内联进 `dist/index.html`，因此产物是**单个自包含 HTML**（另有 favicon），既可以直接双击 `dist/index.html` 用 `file://` 打开，也可以放到任意静态服务器：

```bash
npx serve dist
```

## 部署

`vite.config.ts` 已设置 `base: './'`，因此产物可以放在域名根目录，也可以放在子路径下。站点没有前端路由，无需配置 SPA fallback。

| 平台 | 配置 |
| --- | --- |
| **Vercel** | 导入仓库，Framework 选 Vite，Build Command `npm run build`，Output Directory `dist` |
| **Netlify** | Build Command `npm run build`，Publish directory `dist` |
| **GitHub Pages** | 已内置 [deploy.yml](.github/workflows/deploy.yml)，push 到 `main` 后自动构建并发布。首次使用需在仓库 Settings → Pages 把 Source 设为 **GitHub Actions**；工作流也会尝试自动启用 Pages |
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
│  ├─ App.tsx                 # 页面骨架：Navbar + Sidebar + 14 章 + Footer
│  ├─ index.css               # 设计系统：变量、卡片、代码块、图表、动效、响应式
│  ├─ i18n/
│  │  └─ LangContext.tsx      # 中 / EN 上下文，默认中文，localStorage 记忆
│  ├─ lib/
│  │  └─ hooks.ts             # useTheme / useLocalStorage / useActiveSection / useCountUp
│  ├─ content/
│  │  ├─ chapters.ts          # 14 章元数据与四个篇章分组
│  │  └─ sources.ts           # 22 个已核验的一手 / 官方来源
│  ├─ components/
│  │  ├─ Navbar.tsx           # 固定顶栏、语言 / 主题切换、移动端汉堡菜单
│  │  ├─ Sidebar.tsx          # 桌面端固定左侧目录
│  │  ├─ TocNav.tsx           # 目录分组与滚动高亮
│  │  ├─ Hero.tsx             # 首屏文案 + 四节点循环动画
│  │  ├─ StatsBand.tsx        # 128K / 50–100 / 177 / 3× 数字滚动
│  │  ├─ Section.tsx          # 章节外壳、标题、来源 chips
│  │  ├─ CodeBlock.tsx        # 深色代码卡、行号、语法高亮、一键复制
│  │  ├─ Callout.tsx          # 提示 / 警告 / 危险块
│  │  ├─ SourceChip.tsx       # 「📖 来源」外链
│  │  ├─ Reveal.tsx           # 滚动入场
│  │  ├─ RippleButton.tsx     # 按钮弹簧缩放与涟漪
│  │  ├─ BackToTop.tsx        # 回到顶部
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

- 桌面端固定左侧目录，滚动高亮当前章节；移动端汉堡菜单抽屉。
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
