# Progress · DOM 结构契约（progress.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-progress [ui-progress--indeterminate]" role="progressbar" aria-valuemin="0" aria-valuemax="{max}" [aria-valuenow="{value}"]>
  <span style="width:{pct}%"></span>
</div>
```

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 初始（§1221） | `<div class="ui-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span style="width:0%"></span></div>` |
| 62% | `<div class="ui-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62"><span style="width:62%"></span></div>` |
| 不确定 | `<div class="ui-progress ui-progress--indeterminate" role="progressbar" aria-valuemin="0" aria-valuemax="100"><span></span></div>` |

## 约束
1. class 顺序：**基类 `ui-progress` 必首位**，`ui-progress--indeterminate` 仅不确定态追加。
2. 填充条固定为子 `<span>`（§480 `.ui-progress > span` 选择器依赖此结构，不可改标签或加 class）。
3. `width` 仅以内联 `style` 给出（百分比），不派生 token。
4. **偏差说明**：`ui-progress--indeterminate` 已在 DOM 产出，但 `theme.css` 暂无对应规则；保留类以对齐契约，待补 CSS 后即刻呈现不确定动画，不影响双框架 DOM 一致性。
5. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
