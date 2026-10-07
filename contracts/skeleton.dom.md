# Skeleton · DOM 结构契约（skeleton.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-skeleton" [style="…"] role="presentation"></div>
```

形状经内联 `style` 实现（对齐预览 §1227-§1229 的 `height/width` 内联写法）：

| shape | 内联 style |
|---|---|
| `rect`（默认） | `width`、`height` 由 props（无则靠容器/内容） |
| `text` | `height: 14px`（默认）、`width` 由 props（预览用 60%/90%/75%） |
| `circle` | `border-radius: 50%`、`width == height`（等比，缺省 40px） |

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 文本行（§1227） | `<div class="ui-skeleton" style="height:14px; width:60%;"></div>` |
| 圆形 | `<div class="ui-skeleton" style="width:40px; height:40px; border-radius:50%;"></div>` |
| 静止 | `<div class="ui-skeleton" style="height:14px; width:90%;" data-active="false"></div>` |

## 约束
1. class 顺序：**基类 `ui-skeleton` 必首位**，无修饰类（形状不派生 class，见偏差）。
2. 形状 / 尺寸一律内联 `style`，不新增 `ui-skeleton--*` 类（避免改 theme.css）。
3. **偏差说明**：因 `theme.css` 仅 `.ui-skeleton` 基础 + `ui-shimmer`，圆形/文本形状经内联 `style` 实现，与预览内联写法同源；不新增 CSS、不改 theme.css，保持双框架零样式纪律。
4. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
