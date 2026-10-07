# DatePicker · DOM 结构契约（datepicker.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构（范围模式）

```html
<div class="ui-datepicker" data-range>
  <button class="ui-datepicker-trigger ui-input" type="button" aria-haspopup="dialog" aria-expanded="false">
    <span class="ui-icon"><!-- 24x24 日历 SVG, stroke=currentColor --></span>
    <span class="dp-text">选择日期区间</span>
  </button>
  <div class="ui-datepicker-pop" role="dialog" aria-label="选择日期区间" hidden>
    <div class="dp-head">
      <button class="dp-nav" type="button" data-nav="prev" aria-label="上个月"><span class="ui-icon"><!-- chevron-left --></span></button>
      <span class="dp-title">2026年10月</span>
      <button class="dp-nav" type="button" data-nav="next" aria-label="下个月"><span class="ui-icon"><!-- chevron-right --></span></button>
    </div>
    <div class="dp-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>
    <div class="dp-grid">
      <div class="dp-cell is-out" data-disabled="1">29</div>
      <!-- …前导相邻月补齐… -->
      <div class="dp-cell" data-date="2026-10-01">1</div>
      <div class="dp-cell is-today" data-date="2026-10-05">5</div>
      <div class="dp-cell is-selected is-start" data-date="2026-10-08">8</div>
      <div class="dp-cell in-range" data-date="2026-10-09">9</div>
      <div class="dp-cell is-selected is-end" data-date="2026-10-12">12</div>
      <!-- …其余日… -->
    </div>
    <div class="dp-foot">
      <button class="ui-btn ui-btn--ghost ui-size-sm" type="button" data-act="today">今天</button>
      <button class="ui-btn ui-btn--primary ui-size-sm" type="button" data-act="clear">清除</button>
    </div>
  </div>
</div>
```

## 单日模式差异
- 根 div **无** `data-range`。
- 触发器 `aria-label` / 弹层 `aria-label` 为「选择日期」，`dp-text` 默认「选择日期」。
- 单元格仅用 `is-selected`（无 `is-start`/`is-end`/`in-range`）。

## 单元格 class 生成（对齐 `initDatePicker`）
顺序：`dp-cell` 必首位，之后按序追加：
1. `is-out`（前导相邻月补齐，且带 `data-disabled="1"`）
2. `is-today`（`sameDay(date, today)`）
3. 范围：`is-selected is-start`（`sameDay(date,start)`）／`is-selected is-end`（`sameDay(date,end)`）／`in-range`（`start&&end && date>start && date<end`）；单日：`is-selected`（`sameDay(date,start)`）

## 约束
1. class 顺序：根 `ui-datepicker` 必首位；`dp-*` 子元素顺序固定（head → week → grid → foot）。
2. 周起点固定**周一**（lead = `(first.getDay()+6)%7`），`dp-week` 顺序 一→日。
3. 弹层 `hidden` 属性控制显隐（CSS `.ui-datepicker-pop[hidden]{display:none}`）。
4. 图标为内置 24×24 `currentColor` 内联 SVG，非 lucide `<i data-lucide>`。
5. 颜色零硬编码（除 #fff 文本对比）：选中底 `var(--ui-color-brand)`，today 描边同，柔光 `var(--ui-color-brand-soft)`。
