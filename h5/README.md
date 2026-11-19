# uni-ui-h5

移动 Web 组件库，单包支持 **React 18** / **Vue 3** / **Plain** 三端。设计基线为 375px 移动端：
触控优先、系统字体、紧凑圆角；源码使用 px，构建时自动转换为 rem 以适配不同屏幕。

本文所有命令均以 `h5/` 为起始目录。工程独立维护，不引用其他端的源码、样式、契约或配置。
本地开发依赖同级仓库 `plain-framework`，位置为相对于 `h5/` 的 `../../plain-framework`。

## 特性

- **单包三端**：`uni-ui-h5/react`、`uni-ui-h5/vue`、`uni-ui-h5/plain` 三个子路径；React / Vue / Plain 均为 peer 依赖。
- **px → rem**：`theme.css` 源码写 px，构建时由 `postcss-pxtorem` 转换；运行时由 `setupRem()` 设置根字号。
- **零组件样式**：组件文件不写 scoped / 运行时 CSS，视觉全部来自 `theme.css` 的 `--h5-*` token。
- **契约先行**：每个组件配套 `contracts/<name>.{api,behavior,dom}.md`，三端实现以契约为唯一事实来源。
- **移动端默认**：默认高度 44px 触控区、`type="button"` 防误提交、`:active` 触控反馈、暗色 token。

## 快速开始

```ts
// React
import 'uni-ui-h5/theme.css';
import { Button } from 'uni-ui-h5/react';
import { setupRem } from 'uni-ui-h5/flexible';

setupRem(); // 应用启动时调用一次

// Vue
import 'uni-ui-h5/theme.css';
import { Button } from 'uni-ui-h5/vue';

// Plain
import 'uni-ui-h5/theme.css';
import { Button } from 'uni-ui-h5/plain';
```

`react` / `react-dom` / `vue` / `plain` 均为 peer 依赖，按所选端安装。

## 文档

- 使用指南：[`docs/USAGE.md`](./docs/USAGE.md)
- 组件契约：[`contracts/`](./contracts/README.md)
- 设计 token：[`contracts/token.md`](./contracts/token.md)

## 本地预览（Playground）

三端并排展示同一组 Button 用例，从库源码真实消费路径运行，并演示 rem 根字号适配：

```bash
cd playground
pnpm install
pnpm dev        # http://localhost:5181
```

## 构建

```bash
pnpm install
pnpm run build              # 单文件 bundle：dist/react.js、dist/vue.js、dist/plain.js、dist/flexible.js
pnpm run build:modules      # 可选：按组件拆分，支持 uni-ui-h5/react/Button 等子路径直引
pnpm run typecheck          # React / Vue 类型检查
pnpm run typecheck:plain    # Plain 类型检查
pnpm run build && pnpm test # 构建后运行 test/ 下的 Plain 行为测试
```

`dist/theme.css` 由 `scripts/build-theme.mjs` 生成，构建后其中的长度已全部转换为 rem。

## 约定

- 组件文件不写任何 scoped / 运行时 CSS；视觉复用 `theme.css` 已有 class 与 token。
- 源码 CSS 只写 px；除 1px 发丝线外，构建后统一转 rem。
- React / Vue / Plain 产出完全一致的标签、class、层级；DOM 一致是三端铁律。
- 修改组件行为或 DOM 前，先更新 `contracts/`，再同步三端实现。
- 构建工具：Vite 5 + Rollup；Plain 视图由 `plain/vite` 编译为直接 DOM。
