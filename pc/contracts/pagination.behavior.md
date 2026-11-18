# Pagination · 行为契约（pagination.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-pagination`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 当前页 | `is-active`（品牌色底白字）+ `aria-current="page"` | `page === n` |
| 边界 | 上/下页 `disabled`（`opacity .4; not-allowed`） | `page<=1` / `page>=totalPages` |
| 省略 | `…` 按钮 `disabled`，不可点 | 中间折叠区 |

## 状态机（当前页）
```
   1 ◀── prev ──┐      ┌── next ──▶ totalPages
   └────── click n ──────┘
```
- 点击页码设置 `page=n`；点击 `data-prev` 设 `page-1`；`data-next` 设 `page+1`。
- 越界（<1 或 >totalPages）不触发 onChange。

## 键盘 / a11y
- 根 `role="navigation" aria-label`，内部为 `<button>` 组，天然 Tab 可达、Enter/Space 触发。
- 当前页 `aria-current="page"`；上下页 `aria-label="上一页"/"下一页"`。
- 省略号按钮 `disabled`，读屏播报不可点。
- 总页数随 `total/pageSize` 变化自动重算，越界当前页被钳制到 `[1, totalPages]`。

## 受控 / 非受控
- 受控：`page` + `onChange`。
- 非受控：`defaultPage` 初始化，内部维护并回调 `onChange`。
