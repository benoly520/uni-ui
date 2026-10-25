# Progress · API 契约（progress.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-progress`（§1221 / §1909-§1913 / §479-§480）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-progress`（必首位）
- 原生结构：根 `<div>` + 子 `<span>`（填充条）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `value` | `number` | `0` | 子 `<span>` 的 `width`（`value/max*100%`） | 当前进度（受控） |
| `max` | `number` | `100` | — | 满值 |
| `indeterminate` | `boolean` | `false` | `ui-progress--indeterminate` | 不确定（无具体进度） |
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

## 插槽
- 无内容插槽；进度条由 `value` / `max` 驱动填充 `<span>` 的 `width`。

## 受控 / 非受控
- 纯展示组件：`value` 为受控值（由父组件状态驱动，如预览 `setInterval` 改 `width`）。
- 本组件不内置计时器，仅据 `value`/`max` 渲染 `width`；不确定态用 `indeterminate` 切换。

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 根 `ui-progress` 必首位；不确定态 `ui-progress--indeterminate`；填充条固定 `<span>`。**禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
- ⚠️ 偏差：`theme.css` 当前无 `ui-progress--indeterminate` 规则，类已产出但未驱动专属样式；后续补 CSS 即生效（见 dom.md 约束 4）。
