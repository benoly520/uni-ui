# Accordion · DOM 结构契约（accordion.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-accordion">
  <div class="ui-accordion-item [is-open]">
    <button class="ui-accordion-header" type="button" aria-expanded="true|false">
      <span>行情面</span>
      [<span class="ui-accordion-badge">3</span>]
      <span class="ui-accordion-caret ui-icon">{SVG:chevron-down@2.4}</span>
    </button>
    <div class="ui-accordion-panel">
      <div class="ui-accordion-panel-inner">
        <!-- content 节点：Switch / Checkbox 等 -->
      </div>
    </div>
  </div>
  <!-- …更多 item… -->
</div>
```

## 子元素顺序（对齐预览页）
- `ui-accordion-item`：`is-open` 仅在展开时追加（class 顺序：`ui-accordion-item [is-open]`）。
- header 内：`title` 文本 → `badge`（可选）→ `caret`（`ui-accordion-caret ui-icon`，内置 chevron-down 内联 SVG）。
- 面板：`ui-accordion-panel` → `ui-accordion-panel-inner` → `content`。

## 约束
1. class 顺序：根 `ui-accordion` 必首位；item 先基类后 `is-open`。
2. header 必须 `type="button"`；`aria-expanded` 与 `is-open` 同步。
3. caret 为内置 24×24 `currentColor` chevron-down 内联 SVG（非 lucide 运行时），保证双框架一致。
4. 颜色零硬编码：caret / hover 走 `var(--ui-color-brand-soft)`、badge 走 `var(--ui-color-brand)`。
5. 面板过渡靠内联 `style.maxHeight`（open 取 scrollHeight，closed 取 0），值由运行时测量，两侧算法一致。
