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

## 插槽
- 无（纯受控数据驱动）。

## 事件
- `onChange(page)`：点击页码 / 上 / 下页时触发。

## 省略规则
- 总页数 ≤ `2*siblingCount + 5` 时平铺全部；否则首/尾固定，当前页两侧 `siblingCount`，中间以省略号（`…`，`.ui-pagination--ellipsis` + `disabled`）占位。

## 命名纪律
- 当前页按钮 `is-active` + `aria-current="page"`；上下页用 `data-prev` / `data-next` + `aria-label`；省略号 `ui-pagination--ellipsis` 且 `disabled`。
- 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash。
