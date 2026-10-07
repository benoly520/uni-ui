# Badge · DOM 结构契约（badge.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<!-- 纯文本 / 标签 -->
<span class="ui-badge" style="background:var(--ui-color-brand-soft);color:var(--ui-color-brand);">{children}</span>

<!-- dot 模式 -->
<span class="ui-badge" style="...">
  <span class="ui-badge-dot" style="width:8px;height:8px;border-radius:50%;background:currentColor;"></span>
  {children}
</span>

<!-- count 模式 -->
<span class="ui-badge" style="...">{display}</span>
```

- `tone` 通过根 `style` 写入 `background: var(--ui-color-{tone}-soft, var(--ui-color-brand-soft))` 与 `color: var(--ui-color-{tone}, var(--ui-color-brand))`。
- `ui-badge-dot` 仅靠内联 `style` 绘制圆点，不依赖任何已定义 class 的视觉。
- `display` 为截断后的计数字符串（如 `99+`）。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 在线标签 | `<span class="ui-badge">● 在线</span>` |
| brand tone | `<span class="ui-badge" style="background:var(--ui-color-brand-soft);color:var(--ui-color-brand);">在线</span>` |
| dot | `<span class="ui-badge" style="..."><span class="ui-badge-dot" style="width:8px;height:8px;border-radius:50%;background:currentColor;"></span>在线</span>` |
| count=5 | `<span class="ui-badge" style="...">5</span>` |
| count=200,max=99 | `<span class="ui-badge" style="...">99+</span>` |
| count=0,showZero=false | 不渲染（`null`） |

## 约束
1. class 顺序：**基类 `ui-badge` 必首位**，无追加修饰类（size 由调用方或内联 `style` 决定）。
2. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash；圆点用静态内联 `style`。
3. 颜色零硬编码：`tone` 背景/前景一律 `var(--ui-color-*)`，圆点 `background:currentColor` 继承前景。
4. dot 仅需 `<span class="ui-badge-dot">` + 内联 `style`，不引入新 CSS 规则。
