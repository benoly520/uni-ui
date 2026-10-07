# ContextMenu · DOM 结构契约（contextmenu.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-contextmenu [is-open]" role="menu" aria-label="标的操作" style="left:..px; top:..px;">
  <div class="ui-contextmenu-item" role="menuitem" data-key="watch">加自选 <span class="ui-contextmenu-shortcut">⌘D</span></div>
  <div class="ui-contextmenu-item" role="menuitem" data-key="report">看研报</div>
  <div class="ui-contextmenu-item" role="menuitem" data-key="portfolio">加入组合</div>
  <div class="ui-contextmenu-sep"></div>
  <div class="ui-contextmenu-item is-danger" role="menuitem" data-key="del">删除标的</div>
</div>
```

## 子元素顺序（对齐预览页）
- 遍历 `items`：
  - `separator` 为真 → `<div class="ui-contextmenu-sep"></div>`。
  - 否则 → `<div class="ui-contextmenu-item [is-danger]" role="menuitem" data-key="{key}">`：
    - `label` 节点；
    - `shortcut` 存在 → `<span class="ui-contextmenu-shortcut">{shortcut}</span>`（置于 label 后）。
- 根 class 顺序：`ui-contextmenu` 必首位，`is-open` 仅在打开时追加。

## 约束
1. **根 class 无连字符**：`ui-contextmenu`（注意不是 `ui-context-menu`）。
2. 根 `position:fixed`，显隐靠 `is-open` 类（`display:none`↔`block`），非 `hidden` 属性。
3. 定位用内联 `style.left/top`（px），边缘翻转为负值偏移。
4. 危险项追加 `is-danger`（仅 class，无额外结构）。
5. 颜色零硬编码：hover 走 `var(--ui-color-brand)`、危险 hover 走 `var(--ui-color-danger)`。
