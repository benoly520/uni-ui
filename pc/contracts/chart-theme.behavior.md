# ChartTheme · 行为契约（chart-theme.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `uniChartTheme()` 与 `chartWatch`（`MutationObserver`）。React / Vue 两侧行为必须一致。

## 行为

| 场景 | 表现 |
|---|---|
| 首读 | `uniChartTheme()` 同步返回当前计算样式推导的主题对象 |
| 切换明暗（`data-theme`） | `useChartTheme()` 返回的主题对象品牌/文字/网格/bg 随之更新 |
| 切换涨跌色约定（`data-mkt`） | `up` / `down` 字段随之翻转（中国红涨绿跌 ↔ 国际绿涨红跌） |
| 覆盖品牌色（内联 `--ui-color-brand`） | `brand` 字段即时更新 |
| 组件卸载 | `MutationObserver.disconnect()`，停止监听，避免泄漏 |

## 监听策略（对齐 `chartWatch`）
- 观察目标：`document.documentElement`。
- `MutationObserver` 配置：`{ attributes: true, attributeFilter: ['data-theme', 'data-mkt', 'style'] }`。
- 任意匹配属性变化 → 重新 `uniChartTheme()` 取最新值并触发更新。

## a11y / 兼容
- 不渲染 DOM，无焦点 / 读屏负担。
- SSR：`getComputedStyle` 仅在客户端执行；无 `document` 时 `uniChartTheme` 返回全空字符串对象、`useChartTheme` 返回该空对象且不挂监听。

## 受控 / 非受控
- 主题本身由 CSS 变量（单一真理源）驱动，组件只读不写——保证「一套 token，全局换肤」。
- `useChartTheme` 仅消费，不暴露写回；换肤仍由上层改 `data-theme` / `data-mkt` / `--ui-color-brand`。
