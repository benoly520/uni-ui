# Empty · DOM 结构契约（empty.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-empty">
  <span class="ico ui-icon">{icon 或 <i data-lucide="table"></i>}</span>
  <span class="ui-label">[description]</span>
  [默认插槽：操作区]
</div>
```

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 预览（§1231-§1234） | `<div class="ui-empty" style="…"><span class="ico ui-icon"><i data-lucide="table"></i></span><span class="ui-label">暂无自选标的</span></div>` |
| 带操作 | `<div class="ui-empty"><span class="ico ui-icon"><i data-lucide="table"></i></span><span class="ui-label">暂无数据</span><button class="ui-btn ui-btn--primary ui-size-sm">新建</button></div>` |
| 自定义图标 | `<div class="ui-empty"><span class="ico ui-icon"><i data-lucide="inbox"></i></span><span class="ui-label">空</span></div>` |

## 约束
1. class 顺序：**基类 `ui-empty` 必首位**；图标容器固定 `.ico.ui-icon`（`ico` 在前，提供 40×40 尺寸）。
2. 子结构顺序：图标 → 描述（`.ui-label`）→ 操作插槽，不可颠倒（flex 列顺序依赖）。
3. 未传 `icon` 时默认渲染 `<i data-lucide="table"></i>`（预览实证），覆盖时整段替换 `.ico` 内容。
4. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
