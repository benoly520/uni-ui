# Tag · DOM 结构契约（tag.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<span class="ui-tag [ui-tag--{type}] [ui-tag--closable]" [style="color:…;border-color:…"]>
  [<span class="ui-icon">{icon}</span>]
  [文本或节点]
  [<button type="button" class="ui-tag-close" aria-label="关闭" style="…"><span aria-hidden="true">×</span></button>]
</span>
```

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 默认（§1638） | `<span class="ui-tag">白酒</span>` |
| brand（§1203） | `<span class="ui-tag ui-tag--brand">沪深300</span>` |
| up（§1204） | `<span class="ui-tag ui-tag--up">增持</span>` |
| down（§1205） | `<span class="ui-tag ui-tag--down">减持</span>` |
| 带图标 | `<span class="ui-tag ui-tag--brand"><span class="ui-icon">{icon}</span>标签</span>` |
| 可关闭 | `<span class="ui-tag ui-tag--closable"> removable <button type="button" class="ui-tag-close" aria-label="关闭" style="…"><span aria-hidden="true">×</span></button></span>` |

## 约束
1. class 顺序：**基类 `ui-tag` 必首位**，类型 `ui-tag--{type}` 次，`ui-tag--closable` 末尾（仅可关闭）。
2. `default` 类型**不**生成 `ui-tag--default`（§459 默认即中性描边）。
3. 关闭钮内联样式一律 `var(--ui-*)`（含 `currentColor` / `var(--ui-border)`），无裸色值。
4. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
