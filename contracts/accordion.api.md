# Accordion · API 契约（accordion.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-accordion`（§17.30 / `initAccordion`）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-accordion`（必首位）
- 项：`ui-accordion-item [is-open]` → `ui-accordion-header` / `ui-accordion-panel` / `ui-accordion-panel-inner`
- 图标：`ui-accordion-caret ui-icon`（chevron-down）；徽标 `ui-accordion-badge`

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `items` | `AccordionItem[]` | — | 渲染为一组 `ui-accordion-item` | 分组数据 |
| `activeKeys` | `string[]` | — | 受控展开 key 列表 | 受控模式 |
| `defaultActiveKeys` | `string[]` | `[]` | — | 非受控初始展开 |
| `onChange` | `(keys: string[]) => void` | — | — | 展开集合变化 |
| `className` / `style` | — | — | 根 class / style | — |

### `AccordionItem`
| 字段 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 唯一标识（受控/非受控状态键） |
| `title` | `ReactNode` | 标题文本 |
| `badge` | `ReactNode` | 右侧计数徽标（可选） |
| `content` | `ReactNode` | 折叠面板内容（可嵌 Switch / Checkbox 等） |

## 插槽
- 每个 item 的 `content` 为节点，渲染进 `.ui-accordion-panel-inner`（可嵌套任意交互组件）。

## 事件
- `onChange(keys)`：点击 header 切换某项展开时回调当前全部展开 key。

## 交互特性（对齐 `initAccordion`）
- 多组可同时展开（无互斥）。
- `aria-expanded` 与 `is-open` 同步。
- 折叠过渡用 `max-height` 动画（`open → scrollHeight`，`closed → 0`）。

## 命名纪律
- 全部 class 手写稳定；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：caret / header hover 走 `var(--ui-color-brand-soft)`，badge 走 `var(--ui-color-brand)`。
