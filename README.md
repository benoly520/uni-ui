# uni-ui

同时支持 **React 18** / **Vue 3** / **Plain** 三端的 PC 端 Web 组件库，首应用为金融投研工具。

设计语言：macOS 毛玻璃质感、紧凑密度、默认暗色、七色品牌色、rem 单位。视觉全部来自共享设计系统 `theme.css`，组件文件零样式，保证三端 DOM 与类名完全一致。

## 特性

- **单包三端**：`uni-ui/react`、`uni-ui/vue`、`uni-ui/plain` 三个子路径；React / Vue / Plain 均外置为 peer 依赖。
- **32 个组件**：基础输入、展示、导航、浮层、数据、反馈全品类，含金融增强（NumberInput / DatePicker / Stat / Tree / Slider / DataTable / Search）。
- **契约四件套**：每个组件配套 `contracts/<name>.{api,behavior,dom}.md`，作为三端实现的唯一事实来源。
- **图标**：不内置图标库。组件只内置少量「状态驱动」的内联 SVG（caret / check / search / calendar / table），其余图标由使用方经 `icon` 插槽传入；设计预览用本地 `vendor/lucide.min.js`（2126 图标，不随包发布），边界与快照记法见 `contracts/icon.md`。

## 快速开始

```ts
// React
import 'uni-ui/theme.css'; // 必选：一次性引入设计系统
import { Button, Tree } from 'uni-ui/react';

// Vue
import 'uni-ui/theme.css';
import { Tree } from 'uni-ui/vue';
```

命令式反馈：

```ts
import { toast, showMessage } from 'uni-ui/react';
toast('已保存');                        // 默认 2400ms 后自动关闭
toast('已提交', { duration: 3000 });    // 可指定时长（0 = 常驻）
showMessage('已保存', 'success');       // success | warning | info | danger
showMessage('保存失败', 'danger', 4000);
```

## 文档

- 使用说明：[`docs/USAGE.md`](./docs/USAGE.md)
- 架构与设计方案讨论：[`跨框架组件库架构方案讨论.md`](./跨框架组件库架构方案讨论.md)
- 组件契约规范：`contracts/`

## 本地预览（Playground）

三端并排演示，从库源码真实消费路径运行：

```bash
cd playground
pnpm install
pnpm dev        # http://localhost:5180
```

## 构建

```bash
pnpm install
pnpm run build              # 默认：单文件 bundle dist/react.js + dist/vue.js
pnpm run build:modules      # 可选：按组件拆分（支持 uni-ui/react/Button 子路径直引）
pnpm run typecheck          # vue-tsc 全量类型检查（0 error）
```

## 约定

- 组件文件不写任何 scoped / 运行时 CSS；视觉复用 `theme.css` 已有 class。
- **字体需自行加载（库零字体依赖）**：`theme.css` 不含 `@font-face`，`--ui-font-display` / `--ui-font-body` / `--ui-font-mono` 缺省回落系统字体；要拿到设计调性需应用侧加载 Cabinet Grotesk / Satoshi / JetBrains Mono，或直接覆盖这三个 token（见 [`docs/USAGE.md`](./docs/USAGE.md) §3.1）。
- React / Vue / Plain 产出完全一致的标签、class、层级（DOM 一致是三端铁律）。
- 构建工具：Vite 5 + Rollup（详见架构文档 §17.36 对比分析）。
