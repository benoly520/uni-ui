# Button · API 契约（button.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-btn`（§17.8 / §17.23）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-btn`（必首位）
- 原生元素：`<button>`（保证原生键盘可达、focus、表单语义）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `variant` | `'primary' \| 'default' \| 'ghost' \| 'outline' \| 'danger'` | `'default'` | `ui-btn--primary` … | 语义变体（颜色语义） |
| `size` | `'lg' \| 'md' \| 'xs' \| 'sm'` | `'md'` | `ui-size-lg` / 无 / `ui-size-xs` / `ui-size-sm` | 尺寸 Scale（全局修饰，md 默认无类） |
| `pill` | `boolean` | `false` | `ui-btn--pill` | 胶囊形状，**与语义正交**，可叠加任意变体 |
| `loading` | `boolean` | `false` | `ui-btn--loading` + `aria-busy="true"` | 文字透明 + spinner，`pointer-events: none` |
| `disabled` | `boolean` | `false` | 原生 `disabled` | 透明度 0.45、`not-allowed` |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 `type` | 表单语义（表单内按钮必显式指定） |
| `icon` | 节点（SVG / 图标库） | — | 包入 `.ui-icon` 插槽 | 见 `icon.md` |

## 插槽
- **默认插槽**：文本或任意节点（如 `新建`）。
- **icon 插槽**：`<span class="ui-icon"><i data-lucide="plus"></i></span>`，置于文本前；尺寸随 `--ui-icon-size`，颜色 `currentColor`。

## 事件
- `onClick` / `onclick`：原生 click；`loading` 或 `disabled` 时不触发。

## 毛玻璃
- `default` 变体背景走 `--ui-btn-glass-opacity` → 回退 `--ui-glass-opacity-strong`（§17.19 惰性求值）。其他变体为实色，不吃玻璃。

## 命名纪律
- 变体用 `ui-btn--*`、形状修饰用 `ui-btn--pill`、尺寸用全局 `ui-size-*`；**禁止**派生子 token 承载可覆盖参数（§17.19）。
