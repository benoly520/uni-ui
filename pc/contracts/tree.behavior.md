# Tree · 行为契约（tree.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-tree` 与 `initTree`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| row hover | 整行染品牌柔光底 | 指针悬停 |
| 展开 | 无 `is-collapsed`；`aria-expanded="true"`；子 `ul` 显示 | 点击 arrow / 行 |
| 折叠 | `is-collapsed` + `aria-expanded="false"`；caret 旋转 -90°；子 `ul` `display:none` | 点击 arrow / 行 |
| 勾选 | checkbox `checked`，accent 品牌色 | 点击 `.ui-tree-check` |

## 状态机
```
   非叶子：collapsed ──click arrow/row──▶ expanded ──click──▶ collapsed
   叶子：无子层，caret 隐藏（visibility:hidden），不响应折叠
   勾选：独立状态，不联动折叠
```

## 键盘 / a11y
- 根 `role="tree"`；节点 `role="treeitem"`，`aria-expanded` 仅在**有子节点**时输出（叶子省略）。
- 勾选框为原生 `<input type="checkbox">`，`Tab` 可达，`aria-label="选择 {label}"`。
- 焦点圈走原生控件 `:focus-visible`。

## 受控 / 非受控
- `expandedKeys` / `checkedKeys` 非空 → 受控：状态由 prop 派生并随其同步（Vue 用 `watch` 深同步）。
- 非受控 → 内部集合自管（`expanded` 默认展开所有父节点 = `parentKeys(data)`），操作直接更新并回调 `onExpand` / `onCheck`。

## 已知双框架差异（既有实现，非本次新写）
- React 根 `ui-tree` 带 `aria-label`（默认「树」）；Vue 根仅 `role="tree"` 不带 `aria-label`。
- React caret 内 `<svg>` 始终渲染（叶子由 CSS `visibility:hidden` 隐藏）；Vue caret `<svg>` 仅 `v-if` 有子节点时渲染。两者视觉一致，纯 DOM 文本略有差异。
