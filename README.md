# uni-ui

同时支持 **React 18** 与 **Vue 3** 的 PC 端 Web 组件库，首应用为金融投研工具。

设计语言：macOS 毛玻璃质感、紧凑密度、默认暗色、七色品牌色、rem 单位。视觉全部来自共享设计系统 `theme.css`，组件文件零样式，保证双框架 DOM 与类名完全一致。

## 特性

- **单包双框架**：`uni-ui/react`、`uni-ui/vue` 两个子路径，React / Vue 外置为 peer 依赖。
- **37 个组件**：基础输入、展示、导航、浮层、数据、反馈全品类，含金融增强（NumberInput / DatePicker / Stat / Tree / Slider / DataTable / Search）。
- **契约四件套**：每个组件配套 `contracts/<name>.{api,behavior,dom}.md`，作为双框架实现的唯一事实来源。
- **图标**：接入 lucide（本地 vendor，2126 图标）。

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
toast.success('已保存');
showMessage({ type: 'success', content: '已保存' });
```

## 文档

- 使用说明：[`docs/USAGE.md`](./docs/USAGE.md)
- 架构与设计方案讨论：[`跨框架组件库架构方案讨论.md`](./跨框架组件库架构方案讨论.md)
- 组件契约规范：`contracts/`

## 本地预览（Playground）

双框架并排演示，从库源码真实消费路径运行：

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
- React / Vue 产出完全一致的标签、class、层级（DOM 一致是双框架铁律）。
- 构建工具：Vite 5 + Rollup（详见架构文档 §17.36 对比分析）。
