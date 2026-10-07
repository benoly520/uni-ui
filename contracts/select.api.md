# Select · API 契约（select.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-select`（§17.23 选股/选行业/选财报期）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-select`（必首位，`position:relative`）；多选加 `data-multiple` 属性
- 触发器：`.ui-select-trigger`（`<button>`，`aria-haspopup="listbox"` + `aria-expanded`）
- 菜单：`.ui-select-menu`（`role="listbox"`，含 `.ui-select-search` 与 `.ui-select-option`）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `options` | `SelectOption[]` | — | `.ui-select-option` | 选项列表 |
| `value` | `string \| string[]` | — | 受控选中值 | 单值或（多选）数组 |
| `defaultValue` | `string \| string[]` | — | 非受控初值 | — |
| `multiple` | `boolean` | `false` | 根 `data-multiple` + 选项 `.multi` + `.check` | 多选 |
| `searchable` | `boolean` | `false` | `.ui-select-search` 显示 | 搜索过滤 |
| `placeholder` | `string` | `'请选择'` | 触发器占位文案 | — |
| `onChange` | `(value, option) => void` | — | 选中变化 | 单值/数组 + 对应 option(s) |
| `className` / `style` | — | — | — | — |

### SelectOption
| 字段 | 类型 | 说明 |
|---|---|---|
| `label` | `string` | 显示文案（触发器与选项共用） |
| `value` | `string` | 值（`data-val`） |
| `disabled` | `boolean` | 禁用该项 |

## 事件
- `onChange(value, option)`：单选点选项即关闭；多选点选项切换（不关闭），触发器文案以 `、` 连接选中项。

## 交互（还原预览 initSelect）
- 触发器点击：开/关切换；开时若有搜索框自动聚焦。
- 选项点击：单选 → 设 `aria-selected=true` 并关闭；多选 → 切换 `aria-selected`、更新触发器文案。
- 搜索框 input：按 `data-val` 包含过滤（不区分大小写），隐藏不匹配项。
- 点击组件外部 / Esc：关闭。

## 命名纪律
- 多选根加 `data-multiple`（属性，非 class）；多选选项加 `.multi` 类与 `.check` 图标（`ui-icon`）。
- 触发器 caret 为 `.caret.ui-icon`（chevron-down），开态由 `.ui-select.open .caret` 旋转（theme.css）。
