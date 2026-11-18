# Pagination · API 契约（pagination.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-pagination`（§Pagination 区块）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-pagination`（`<nav>`，`role="navigation"`）

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `total` | `number` | — | — | 总条目数（用于推导总页数） |
| `pageSize` | `number` | `10` | — | 每页条目数 |
| `page` | `number` | — | 受控当前页（1-based） | 受控当前页 |
| `defaultPage` | `number` | `1` | — | 非受控初始页 |
| `onChange` | `(page: number) => void` | — | — | 翻页回调 |
| `siblingCount` | `number` | `1` | — | 当前页两侧保留的页码数 |
| `ariaLabel` | `string` | `'分页'` | `role="navigation"` 的 `aria-label` | 无障碍标签 |
| `className` / `style` | — | — | 透传到根 | — |
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

## 插槽
- 无（纯受控数据驱动）。

## 事件
- `onChange(page)`：点击页码 / 上 / 下页时触发。

## 省略规则
- 总页数 ≤ `2*siblingCount + 5` 时平铺全部；否则首/尾固定，当前页两侧 `siblingCount`，中间以省略号（`…`，`.ui-pagination--ellipsis` + `disabled`）占位。

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件受影响部位：页码按钮默认底色。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 当前页按钮 `is-active` + `aria-current="page"`；上下页用 `data-prev` / `data-next` + `aria-label`；省略号 `ui-pagination--ellipsis` 且 `disabled`。
- 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash。
