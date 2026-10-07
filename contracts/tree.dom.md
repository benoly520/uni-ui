# Tree · DOM 结构契约（tree.dom.md）

> 快照对拍基准。描述既有实现 `src/react/Tree.tsx` / `src/vue/TreeNode.vue` 真实产出的 DOM。

## 通用结构（有子节点 + 展开 + 勾选）

```html
<div class="ui-tree" role="tree" [aria-label="树"]>
  <ul class="ui-tree-children">
    <li class="ui-tree-node" role="treeitem" aria-expanded="true">
      <div class="ui-tree-row">
        <span class="ui-tree-caret ui-icon"><svg viewBox="0 0 24 24" ...><!-- chevron-down --></svg></span>
        <input type="checkbox" class="ui-tree-check" aria-label="选择 食品饮料" />
        <span class="ui-tree-label">食品饮料</span>
        <span class="ui-tree-count">30</span>
      </div>
      <ul class="ui-tree-children">
        <li class="ui-tree-node ui-tree-leaf" role="treeitem">
          <div class="ui-tree-row">
            <span class="ui-tree-caret ui-icon"><svg ...><!-- chevron-down（React 始终渲染；Vue 省略） --></svg></span>
            <input type="checkbox" class="ui-tree-check" aria-label="选择 白酒" />
            <span class="ui-tree-label">白酒</span>
            <span class="ui-tree-count">18</span>
          </div>
        </li>
      </ul>
    </li>
  </ul>
</div>
```

## 节点 class 顺序
- `ui-tree-node` 必首位，之后 `ui-tree-leaf`（叶子）与 `is-collapsed`（折叠时）按序追加。
- `role="treeitem"`；`aria-expanded` 仅当该节点**有子节点**时存在（`true`/`false`），叶子不输出该属性。

## 行内顺序（对齐预览）
- `ui-tree-caret ui-icon`（chevron 图标）→ `ui-tree-check`（仅 `checkable` 时）→ `ui-tree-label` → `ui-tree-count`（仅 `count` 存在时）。

## 折叠 / 勾选交互
- 折叠：节点加 `is-collapsed`，`aria-expanded="false"`，子 `<ul class="ui-tree-children">` 由 CSS `display:none` 隐藏。
- 勾选：`.ui-tree-check` 原生 checkbox；点击 `.ui-tree-check` 不触发折叠（`React` 用 `e.target.closest('.ui-tree-check')` 拦截；`Vue` 用 `@click.stop`）。

## 约束
1. class 顺序：根 `ui-tree` 必首位；节点先基类后 `ui-tree-leaf`/`is-collapsed`。
2. 层级用 `<ul class="ui-tree-children">` 嵌套，递归渲染。
3. 颜色零硬编码：row hover / caret 走 `var(--ui-color-brand-soft)`、勾选 `accent-color: var(--ui-color-brand)`。
4. 详见 `tree.behavior.md` 的「已知双框架差异」：根 `aria-label` 与 caret SVG 渲染条件略有不同。
