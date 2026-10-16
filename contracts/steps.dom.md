# Steps · DOM 结构契约（steps.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-steps">
  <div class="ui-step is-done is-clickable" data-step="0">
    <span class="ui-step-dot">{SVG:check@3}</span>
    <span class="ui-step-text"><span class="ui-step-title">配置参数</span><span class="ui-step-desc">选股 + 区间</span></span>
  </div>
  <span class="ui-step-line"></span>
  <div class="ui-step is-current is-clickable" data-step="1">
    <span class="ui-step-dot">2</span>
    <span class="ui-step-text"><span class="ui-step-title">运行回测</span><span class="ui-step-desc">计算中</span></span>
  </div>
  <span class="ui-step-line"></span>
  <div class="ui-step is-clickable" data-step="2">
    <span class="ui-step-dot">3</span>
    <span class="ui-step-text"><span class="ui-step-title">查看结果</span><span class="ui-step-desc">绩效报告</span></span>
  </div>
</div>
```

## 子元素顺序（对齐预览页）
- `ui-step` class 顺序：`ui-step` 必首位，之后按 `is-done` / `is-current` / `is-clickable`（存在才追加）。
- 步项结构：`ui-step-dot` → `ui-step-text`(`ui-step-title` + `ui-step-desc`)。
- 步之间插入 `ui-step-line`（最后一步后无 line）。

## 圆点内容
- `is-done`：渲染内置 `{SVG:check@3}`（24×24 `currentColor` 内联 SVG，对齐预览 lucide `check`，三端零运行时一致；记法见 `icon.md`）。
- 该 svg 不包在 `.ui-icon` 内，尺寸由 theme.css 的 `.ui-step-dot svg { width:24px; height:24px }` 给出（svg 自身不写 width/height，使 React / Vue / Plain 三端 DOM 逐字一致）。
- 其余：渲染序号数字 `j+1` 文本。

## 约束
1. class 顺序：根 `ui-steps` 必首位；`ui-step` 先基类，状态类 `is-done`/`is-current`/`is-clickable` 顺序固定。
2. 连接线 `ui-step-line` 仅出现在相邻步之间（列表扁平结构：step, line, step, line, step）。
3. 颜色零硬编码：done/current/line 走 `var(--ui-color-brand)`、柔光 `var(--ui-color-brand-soft)`。
