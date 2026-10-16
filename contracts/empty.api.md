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

## 插槽
- **icon 插槽**：`<span class="ico ui-icon">{icon}</span>`；默认渲染内置 `table` 内联 SVG（零图标库运行时），可整段覆盖。
- **description**：`.ui-label` 文本（中性色）。
- **默认插槽**：操作区（`ui-empty` 为 flex 列，操作紧随描述）。

## 命名纪律
- 根 `ui-empty` 必首位；图标容器固定 `.ico.ui-icon`；描述固定 `.ui-label`；顺序见 dom.md。
- **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
