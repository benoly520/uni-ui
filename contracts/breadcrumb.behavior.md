# Breadcrumb · 行为契约（breadcrumb.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-breadcrumb`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 链接 hover | 文字转品牌色 + 柔光底 | 指针悬停 `a:hover` |
| 当前页 | 实体字重、无 hover 高亮、不可点 | 末项 `span.current` |
| 分隔符 | 静默降透明度 | 始终 |

## 状态机
```
   items[0..n-1]：前 n-1 项为可点 a，末项 n-1 为 current（aria-current=page）
   相邻项之间插入 sep；末项后无 sep
```

## 键盘 / a11y
- 根 `<nav aria-label="路径导航">` 提供地标。
- 链接为原生 `<a>`，`Tab` 可达；末项为 `span` 无焦点（当前页无需导航）。
- 末项 `aria-current="page"` 声明当前位置。

## 受控 / 非受控
- 纯展示组件，无内部状态；`items` 驱动全部渲染。
