# Segmented · DOM 结构契约（segmented.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-segmented [ui-size-*]" [aria-label="..."] [aria-disabled="true"]>
  <span class="thumb" style="left:{n}px; width:{n}px;"></span>
  <button type="button" aria-pressed="true" [disabled]>{label}</button>
  <button type="button" aria-pressed="false" [disabled]>{label}</button>
  ...
</div>
```

- `.thumb` 必须为首子节点（绝对定位，不占文档流），其后紧跟各选项 `<button>`。
- 仅选中项 `aria-pressed="true"`；其余 `false`。
- `thumb` 的 `style.left / style.width` 由 JS 据选中按钮 `offsetLeft/offsetWidth` 写入（数值像素，无额外 class）。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 三段（日/周/月，选中日） | `<div class="ui-segmented"><span class="thumb" style="left:3px;width:62px;"></span><button type="button" aria-pressed="true">日</button><button type="button" aria-pressed="false">周</button><button type="button" aria-pressed="false">月</button></div>` |
| 尺寸 xs（微/小） | `<div class="ui-segmented ui-size-xs"><span class="thumb" style="left:3px;width:38px;"></span><button type="button" aria-pressed="true">微</button><button type="button" aria-pressed="false">小</button></div>` |
| 尺寸 lg | `<div class="ui-segmented ui-size-lg"><span class="thumb" style="left:3px;width:44px;"></span>...</div>` |
| 禁用项 | `<button type="button" aria-pressed="false" disabled>禁</button>` |

## 约束
1. class 顺序：**基类 `ui-segmented` 必首位**，后接 `ui-size-*`。
2. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash，class 手写稳定字符串。
3. 颜色零硬编码：轨道 `var(--ui-seg-track)`、滑块 `var(--ui-seg-thumb)`、选中文字 `var(--ui-text)`，全部走 token。
4. `.thumb` 仅用内联 `style` 写 `left/width`（数值像素，由 JS 测量），不引入新 class 或伪元素。
