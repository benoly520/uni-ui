# ChartTheme · API 契约（chart-theme.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `uniChartTheme()` / `renderChart()` / `MutationObserver`（§17.x）。React / Vue 两侧导出命名与签名必须一致。

## 组件标识
- **非 DOM 组件**：图表主题桥接工具，产出主题对象喂给 ECharts / visx / 自绘 SVG。
- 无任何 class、无 DOM 节点（见 `chart-theme.dom.md`）。

## 导出

### `uniChartTheme(): ChartTheme`
读取 `document.documentElement` 计算样式中的 uni-ui token，返回纯色值对象：

| 字段 | 来源 CSS 变量 | 含义 |
|---|---|---|
| `brand` | `--ui-color-brand` | 品牌主色（净值线 / 渐变） |
| `up` | `--ui-color-up` | 涨色（超额区域 / 涨标记） |
| `down` | `--ui-color-down` | 跌色（回撤区域 / 跌标记） |
| `text` | `--ui-text-muted` | 辅助文字（基准虚线） |
| `grid` | `--ui-border` | 网格线 |
| `bg` | `--ui-bg-elevated` | 图表背景 |

### `useChartTheme()`（React Hook / Vue 组合式）
- 返回当前 `ChartTheme` 主题对象。
- 在 `document.documentElement` 的 `data-theme` / `data-mkt` 属性变化（明暗切换、涨跌色约定切换、内联 style 覆盖品牌色）时自动重算并返回新主题。
- 内部用 `MutationObserver` 监听，组件卸载时断开（`disconnect`）。
- SSR 安全：无 `document` 时返回空对象 / 兜底。

## 命名纪律
- 纯函数 + 轻量 Hook，零框架耦合逻辑；React / Vue 两侧 `uniChartTheme` 实现完全一致。
- 颜色零硬编码：主题全部源自 `--ui-*`，图表侧只需消费返回对象。
