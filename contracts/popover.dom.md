# Popover · DOM 结构契约（popover.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-popover">
  <button ... aria-expanded="false" aria-controls="pop-ID">触发元素</button>
  <div class="ui-popover-panel" id="pop-ID" role="dialog" aria-label="个股快览" [hidden]>
    面板内容（可含按钮）
  </div>
</div>
```

## 约束
1. 根 `.ui-popover` 必首位（`<div>`，相对定位）。
2. 触发元素为根的直接子节点；`.ui-popover-panel` 紧随其后，同为根的直接子节点。
3. 面板 `role="dialog"` + `aria-label` + 唯一 `id`；触发元素 `aria-expanded` 随显隐切换、`aria-controls` 指向面板 `id`。
4. 关闭态面板写 `hidden`（`.ui-popover-panel[hidden]{display:none}` 已有，无需新增规则）。
5. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash，class 手写稳定。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 个股快览 | `<div class="ui-popover"><button class="ui-btn ui-btn--default ui-size-sm" aria-expanded="false" aria-controls="popBody">贵州茅台 ▸</button><div class="ui-popover-panel" id="popBody" role="dialog" aria-label="个股快览" hidden>…面板内容…</div></div>` |

## 主题缺口（由中央补 theme.css）
- 无（`.ui-popover`/`.ui-popover-panel`/`.ui-popover-panel[hidden]` 规则均已具备）。
- 注：如需多方位（top/left/right/bottom）可加 `ui-popover--{placement}` 类，本组件默认仅实现预览既有方位（下沿左对齐），故无强制缺口。
