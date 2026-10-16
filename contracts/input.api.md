# Input · API 契约（input.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-input`（§17.x / §17.23）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-input`（原生 `<input>`，保证原生键盘可达、focus、表单语义）
- 受控/非受控：受控 `value` + `onChange`；非受控 `defaultValue`（回退原生 uncontrolled）。

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `value` | `string` | — | 原生 `value` | 受控值 |
| `defaultValue` | `string` | `''` | 原生 `defaultValue` | 非受控初始值 |
| `onChange` | `(value: string, e) => void` | — | `onInput` / `onChange` | 值变更回调 |
| `size` | `'lg' \| 'md' \| 'xs' \| 'sm'` | `'md'` | `ui-size-lg` / 无 / `ui-size-xs` / `ui-size-sm` | 尺寸 Scale（全局修饰，md 默认无类） |
| `disabled` | `boolean` | `false` | 原生 `disabled` | 不可编辑、降透明度 |
| `error` | `boolean` | `false` | `ui-input--error` | 错误态：danger 描边 + 软光晕 |
| `placeholder` | `string` | — | 原生 `placeholder` | 占位文案（颜色走 `--ui-text-muted`） |
| `type` | `string` | `'text'` | 原生 `type` | text / password / email … |
| `name` | `string` | — | 原生 `name` | 表单字段名 |
| `id` | `string` | — | 原生 `id` | 与 `<label for>` 关联 |
| `maxLength` | `number` | — | 原生 `maxlength` | 最大长度 |
| `prefix` | 节点（图标） | — | 包入 `.ui-icon` 插槽 | 前导图标/装饰（adornment sibling） |
| `suffix` | 节点（图标） | — | 包入 `.ui-icon` 插槽 | 后导图标/装饰（adornment sibling） |
| `className` | `string` | — | 附加 class | 加在 `<input>` 上（非 `.ui-input-wrap`） |
| `style` | `CSSProperties` | — | 内联样式 | 加在 `<input>` 上（非 `.ui-input-wrap`） |

## 插槽
- **默认**：无（文本输入走 `value`/`defaultValue`）。
- **prefix / suffix 插槽**：图标节点塞入 `<span class="ui-icon">`，作为输入框的相邻装饰（见 `icon.md`）。前后缀为「装饰性 sibling」，不进入 input 边框内，复用 `.ui-icon` 现有样式，零新增 CSS。

## 事件
- `onChange`：输入时触发，回传当前 `value` 与原始事件。

## 毛玻璃
- 背景走 `--ui-input-glass-opacity` → 回退 `--ui-glass-opacity-strong`（惰性求值，§17.19）。

## 命名纪律
- 尺寸用全局 `ui-size-*`；错误态用 `ui-input--error`；**禁止**派生子 token 承载可覆盖参数。
