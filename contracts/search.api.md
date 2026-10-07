# Search · API 契约（search.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-search`（§17.23 全局搜，联想下拉）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-search`（必首位，`position:relative`）
- 结构：`.ico.ui-icon`（放大镜）+ `.ui-search-input`（`<input>`）+ `.ui-search-suggest`（`role="listbox"` 联想区）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `options` | `SearchOption[]` | — | `.opt` 生成 | 联想数据源 |
| `value` | `string` | — | 受控输入值 | — |
| `defaultValue` | `string` | — | 非受控初值 | — |
| `placeholder` | `string` | `'搜索…'` | input 占位 | — |
| `onChange` | `(value: string) => void` | — | 输入变化 | — |
| `onSelect` | `(option: SearchOption) => void` | — | 选中联想项 | — |
| `className` / `style` | — | — | — | — |

### SearchOption
| 字段 | 类型 | 说明 |
|---|---|---|
| `label` | `string` | 主文案（搜股票名） |
| `value` | `string` | 值（回写输入） |
| `code` | `string` | 代码（`.code` 右置，等宽） |
| `tag` | `{ text: string; variant?: 'up'\|'down'\|'brand' }` | 板块标签（`.ui-tag`） |

## 事件
- `onChange(value)`：每次输入。
- `onSelect(option)`：键盘 Enter 或鼠标选中联想项（回填 `label` 并关闭）。

## 交互（还原预览 initSearch）
- 聚焦自动展开联想；输入按 `label` 包含过滤（不区分大小写）。
- 键盘 `↑/↓` 在可见项中移动高亮 `active`；`Enter` 选中高亮项（回填 label、关闭）；`Esc` 关闭。
- 鼠标 `mousedown` 选中（用 mousedown 避免 input blur 先触发关闭）。
- 点击组件外部关闭。

## 命名纪律
- 联想区 `role="listbox"`；项 `.opt`（`role="option"`）；高亮态 `.active`（品牌柔色）。
- 放大镜为 `.ico.ui-icon`（search 图标），置于输入左内。
