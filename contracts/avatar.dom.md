# Avatar · DOM 结构契约（avatar.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<!-- 文字 -->
<span class="ui-avatar" style="width:32px;height:32px;font-size:13px;background:var(--ui-color-brand);">U</span>

<!-- 图标 -->
<span class="ui-avatar" style="...background:var(--ui-color-brand);">
  <span class="ui-icon">{icon}</span>
</span>

<!-- 图片 -->
<span class="ui-avatar" style="width:32px;height:32px;">
  <img class="ui-avatar-img" src="..." alt="..." style="width:100%;height:100%;border-radius:50%;object-fit:cover;" />
</span>
```

- 根 `ui-avatar` 必须首位；`size`/`tone` 经内联 `style` 写入（`width/height/font-size/background`）。
- `img` 模式：根不设 `background`（或保留 token 底作加载占位），`<img class="ui-avatar-img">` 填满圆。
- `icon` 模式：图标包入 `.ui-icon`，颜色继承 `#fff`。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 文字 md | `<span class="ui-avatar" style="width:32px;height:32px;font-size:13px;background:var(--ui-color-brand);">U</span>` |
| 文字 xs | `<span class="ui-avatar" style="width:24px;height:24px;font-size:11px;background:var(--ui-color-brand);">✓</span>` |
| 图标 | `<span class="ui-avatar" style="...background:var(--ui-color-brand);"><span class="ui-icon">{icon}</span></span>` |
| 图片 | `<span class="ui-avatar" style="width:32px;height:32px;"><img class="ui-avatar-img" src="a.png" alt="用户" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" /></span>` |
| danger tone | `<span class="ui-avatar" style="...;background:var(--ui-color-danger);">陈</span>` |

## 约束
1. class 顺序：**基类 `ui-avatar` 必首位**；图片子节点 `ui-avatar-img`、图标子节点 `ui-icon`，均来自既有 class 契约。
2. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash；尺寸/底色用静态内联 `style`。
3. 颜色零硬编码：底色 `var(--ui-color-{tone})`，仅文字 `#fff` 例外。
4. 图片 `object-fit:cover` 经内联 `style` 实现，不引入新 CSS 规则。
