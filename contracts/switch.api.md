# Switch · API 契约（switch.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-switch`（§17.x / §17.23）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-switch`（原生 `<button>`，保证原生键盘可达、focus、表单语义）
- ARIA：`role="switch"`、`aria-checked` 为状态真理源（CSS 以 `aria-checked="true"` 驱动滑块位移）。

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `checked` | `boolean` | — | `aria-checked="true/false"` | 受控开/关 |
| `defaultChecked` | `boolean` | `false` | 初始 `aria-checked` | 非受控初始值 |
| `onChange` | `(checked: boolean) => void` | — | `onClick` | 切换回调（回传新状态） |
| `size` | `'lg' \| 'md' \| 'xs' \| 'sm'` | `'md'` | `ui-size-lg` / 无 / `ui-size-xs` / `ui-size-sm` | 尺寸 Scale（track 高=控件高，宽=1.7×高） |
| `disabled` | `boolean` | `false` | 原生 `disabled` | 禁用切换 |
| `label` | `string` | — | `aria-label` | 无障碍标签（纯图标按钮必须） |

## 插槽
- 无内容插槽；Switch 为纯装饰性 toggle，视觉由 `::after` 滑块与 `aria-checked` 驱动，无文本子节点。

## 事件
- `onChange`：点击/键盘激活时触发，回传切换后的布尔值；`disabled` 时不触发。

## 毛玻璃
- track 背景：`aria-checked="false"` 走 `--ui-border`；`true` 走 `--ui-color-brand`（实色，不吃玻璃）。

## 命名纪律
- 尺寸用全局 `ui-size-*` 切换 `--ui-control-h`，组件内部统一读该变量（§17.x 尺寸类纪律），不硬编码尺寸。
