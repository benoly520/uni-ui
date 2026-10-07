# Stat · DOM 结构契约（stat.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-stat">
  [<span class="label">{label}</span>]
  <span class="value ui-num [ui-num--up|ui-num--down|ui-num--muted]" [data-num="up|down|muted"]>{prefix}{value}{suffix}</span>
  [<span class="delta ui-num--up|ui-num--down|ui-num--muted" [data-num="up|down|muted"]>{delta}</span>]
</div>
```

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 涨 | `<div class="ui-stat"><span class="label">上证指数</span><span class="value ui-num">3,218.76</span><span class="delta ui-num--up">+1.24%</span></div>` |
| 跌 | `<div class="ui-stat"><span class="label">深证成指</span><span class="value ui-num">10,142.33</span><span class="delta ui-num--down">-0.86%</span></div>` |
| muted | `<div class="ui-stat"><span class="label">成交额</span><span class="value ui-num">8,642.5亿</span><span class="delta ui-num--muted">较昨日 —</span></div>` |
| 带趋势着色 value | `<div class="ui-stat"><span class="label">最新价</span><span class="value ui-num ui-num--down" data-num="down">1,682.00</span><span class="delta ui-num--down" data-num="down">-0.42%</span></div>` |

## 约束
1. class 顺序：根 `ui-stat` 必首位；`.value` 后接 `ui-num`，涨跌类（`ui-num--*`）追加；`.delta` 以 `ui-num--*` 着色。
2. `trend` 既加 `ui-num--*` 类（theme.css 实际着色），也加 `data-num="up|down|muted"` 属性（语义契约）。
3. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash。
4. 颜色零硬编码：涨 `var(--ui-color-up)`、跌 `var(--ui-color-down)`、灰 `var(--ui-text-muted)`，全 token。
5. 图标/三角不占 DOM，由 theme.css `.delta::before` 绘制。
