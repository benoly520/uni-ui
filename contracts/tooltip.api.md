# Tooltip · API 契约（tooltip.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-tip`（§Tooltip 区块）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-tip`（必首位，`<span>` 包裹，内部联排 inline-flex）
- 气泡 class：`bubble`（`role="tooltip"`，绝对定位浮于触发元素上方）
- 变体修饰：`ui-tip--surface`（跟随主题表面 + 毛玻璃；默认 `invert` 反转色，不写类）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `content` | `ReactNode` / `slot` | — | 包入 `.bubble` | 提示内容（文本或任意节点） |
| `variant` | `'invert' \| 'surface'` | `'invert'` | `ui-tip--surface` | invert=浅色黑泡/暗色白泡（macOS 惯例）；surface=跟随表面+毛玻璃 |
| `placement` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | `ui-tip--{placement}` | 气泡方位（仅 `top` 已有 CSS，其余见交付报告缺口） |
| `open` | `boolean` | — | 受控显示 | 受控时由父级管理显隐 |
| `defaultOpen` | `boolean` | `false` | — | 非受控初始显隐 |
| `onOpenChange` | `(open: boolean) => void` | — | — | 显隐变化回调（hover/focus/Esc/外部点击均触发） |
| `delay` | `number` | `0` | — | 显示延迟（ms），隐藏始终用短延迟避免抖动 |
| `disabled` | `boolean` | `false` | — | 禁用提示（不绑定事件、无气泡） |
| `id` | `string` | 自动生成 | `.bubble` 的 `id` | 用于 trigger 的 `aria-describedby` |
| `className` / `style` | — | — | 透传到根 `span` | — |

## 插槽
- **默认插槽**：触发元素（建议为 `<button>`/可聚焦节点），组件会注入 `aria-describedby` 指向气泡 `id`。
- **content**：气泡内容，置于 `.bubble` 内。

## 事件
- `onOpenChange(open)`：显示/隐藏状态切换时触发。

## 毛玻璃
- `invert`（默认）气泡用 `--ui-text` 背景 + `--ui-bg` 文字（反转色，零硬编码）。
- `surface` 走 `.ui-tip--surface`：背景 `rgb(var(--ui-glass-tint) / var(--ui-tooltip-glass-opacity, var(--ui-glass-opacity)))`，模糊 `var(--ui-tooltip-glass-blur, var(--ui-glass-blur))`，关闭自引用回退链（§17.19）。

## 命名纪律
- 根 `ui-tip` 必首位；变体 `ui-tip--surface`、方位 `ui-tip--{placement}` 追加；显示态 `is-open`（需主题补规则，见交付报告）。
