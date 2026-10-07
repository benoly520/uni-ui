# Switch · DOM 结构契约（switch.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<button class="ui-switch [ui-size-*]" type="button" role="switch" aria-checked="true|false" aria-label="开" [disabled]></button>
```

- 无子节点（滑块由 `::after` 伪元素绘制）。
- `aria-checked` 为唯一状态标记，CSS 据其切换轨道色与滑块位移。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 开（中） | `<button class="ui-switch" type="button" role="switch" aria-checked="true" aria-label="开"></button>` |
| 关 | `<button class="ui-switch" type="button" role="switch" aria-checked="false" aria-label="关"></button>` |
| 尺寸 xs | `<button class="ui-switch ui-size-xs" type="button" role="switch" aria-checked="true" aria-label="开"></button>` |
| 尺寸 sm | `<button class="ui-switch ui-size-sm" type="button" role="switch" aria-checked="true" aria-label="开"></button>` |
| 尺寸 lg | `<button class="ui-switch ui-size-lg" type="button" role="switch" aria-checked="true" aria-label="开"></button>` |
| 禁用 | `<button class="ui-switch" type="button" role="switch" aria-checked="false" aria-label="关" disabled></button>` |

## 约束
1. class 顺序：**基类 `ui-switch` 必首位**，后接 `ui-size-*`。
2. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash，class 手写稳定字符串。
3. 颜色零硬编码：轨道开 `var(--ui-color-brand)`、关 `var(--ui-border)`，滑块 `#fff`（文本对比例外），全部走 token/约定。
4. 切换仅改 `aria-checked` 与（React/Vue 受控时）受控 prop；不引入额外 class 或子节点。
