# ChartTheme · DOM 结构契约（chart-theme.dom.md）

> 快照对拍基准。ChartTheme 是**纯工具**，不产出任何 DOM / class。本节说明「无 DOM」契约与消费侧约定。

## 无 DOM 契约
- `uniChartTheme()` 与 `useChartTheme()` **不创建、不挂载任何元素**，不注入 class。
- 组件库不内置图表渲染引擎（ECharts / visx / D3 由消费方自选）。
- 主题桥接只负责「读 uni-ui token → 吐主题对象」，把换肤能力解耦出图表库。

## 消费侧 DOM 约定（参考预览页 `#demoChart`）
图表容器由消费方自行提供，预览页用以下结构（**非本组件产出**，仅作对接示例）：

```html
<div class="ui-chart" id="demoChart">
  <svg class="ui-chart-svg" viewBox="0 0 600 200" preserveAspectRatio="none" role="img" aria-label="净值曲线示意"></svg>
  <div class="ui-chart-legend">
    <span class="lg lg-brand">策略净值</span>
    <span class="lg lg-up">超额(涨)</span>
    <span class="lg lg-down">回撤(跌)</span>
  </div>
</div>
```

- 图表取色：`stroke={theme.brand}`、`fill={theme.bg}`、`grid stroke={theme.grid}`、`up/down` 填充涨跌幅区域。
- 换肤：监听 `useChartTheme()` 返回变化 → 重绘 SVG（预览 `renderChart()` 即此模式）。

## 约束
1. ChartTheme 自身零 DOM、零 class；不得为「主题」新增任何 `--ui-*` token 或 class。
2. 颜色零硬编码：消费图表的所有色值必须来自 `uniChartTheme()` 返回，禁止图表内写死 `#0a84ff` 等。
3. 涨跌色严格走 `theme.up` / `theme.down`，随 `data-mkt` 约定翻转，不自行判断红绿。
