# Empty · API 契约（empty.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-empty`（§1231-§1234 / §487-§488）。React / Vue 两侧 props 命名与类型一致。

## 组件标识
- 根 class：`ui-empty`（必首位）
- 原生结构：根 `<div>` + `.ico`（图标）+ `.ui-label`（描述）+ 操作插槽

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `description` | 节点 | — | 渲染进 `.ui-label` | 空状态描述文案 |
| `icon` | 节点（24×24 + currentColor） | 内置 `table` SVG | 包入 `.ico.ui-icon` 插槽 | 见 `icon.md`；默认图形等价 lucide `table`（§1232），零图标库运行时 |
| `children` | 节点 | — | 操作插槽（按钮等），置于描述下 | 如「新建自选」 |
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

## 插槽
- **icon 插槽**：`<span class="ico ui-icon">{icon}</span>`；默认渲染内置 `table` 内联 SVG（零图标库运行时），可整段覆盖。
- **description**：`.ui-label` 文本（中性色）。
- **默认插槽**：操作区（`ui-empty` 为 flex 列，操作紧随描述）。

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 根 `ui-empty` 必首位；图标容器固定 `.ico.ui-icon`；描述固定 `.ui-label`；顺序见 dom.md。
- **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
