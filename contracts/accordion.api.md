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
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

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

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 全部 class 手写稳定；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：caret / header hover 走 `var(--ui-color-brand-soft)`，badge 走 `var(--ui-color-brand)`。
