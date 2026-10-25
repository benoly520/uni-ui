# Segmented · API 契约（segmented.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-segmented`（§17.x / §17.23）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-segmented`（`<div>`，纯展示容器，不做原生 form 提交）
- 选中滑块：`.thumb`（绝对定位，位置由 JS 据选中按钮 `offsetLeft/offsetWidth` 计算，CSS 仅负责过渡）
- 选项：`role` 省略，单选项用 `<button aria-pressed="true|false">`（toggle 按键模式，对齐预览）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `options` | `SegmentedOption[]` | — | 每项为 `<button>` | 选项列表，`SegmentedOption = { label: ReactNode; value: string \| number; disabled?: boolean }` |
| `value` | `string \| number` | — | 选中按钮 `aria-pressed="true"` | 受控选中值 |
| `defaultValue` | `string \| number` | 首项 `value` | 初始选中 | 非受控初始值 |
| `onChange` | `(value: string \| number) => void` | — | 点击选项 | 选中变更回调 |
| `size` | `'lg' \| 'md' \| 'xs' \| 'sm'` | `'md'` | `ui-size-lg` / 无 / `ui-size-xs` / `ui-size-sm` | 尺寸 Scale（全局修饰，md 默认无类） |
| `disabled` | `boolean` | `false` | 根 `aria-disabled` + 各 `button[disabled]` | 整体禁用 |
| `aria-label` | `string` | — | 根 `aria-label` | 无障碍分组标签 |
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

## 插槽
- **选项 label**：`SegmentedOption.label` 可为文本或任意节点（如带图标）。
- 无独立默认插槽；内容完全由 `options` 驱动。

## 事件
- `onChange`：点击非禁用选项时触发，回传该选项 `value`；`disabled` 整组或单选项禁用时不触发。

## 毛玻璃
- 轨道背景 `var(--ui-seg-track)`、滑块 `var(--ui-seg-thumb)`（§17.x 已抽为 token，不硬编码）。

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 尺寸用全局 `ui-size-*`；滑块固定 `.thumb`；**禁止**派生子 token 承载可覆盖参数。
