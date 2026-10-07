# Drawer · DOM 结构契约（drawer.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-drawer-overlay [show]" role="presentation" [aria-hidden="true"]>
  <aside class="ui-drawer ui-glass [ui-drawer--left|ui-drawer--bottom]" role="dialog" aria-modal="true" aria-label="个股详情">
    <header>
      <div>
        <div class="ui-drawer-title">贵州茅台</div>
        [<div class="ui-label">600519 · 白酒</div>]
      </div>
      [<button class="ui-btn ui-btn--ghost ui-size-sm" aria-label="关闭" type="button">✕</button>]
    </header>
    <div class="body">
      <!-- 默认插槽：主体内容 -->
    </div>
  </aside>
</div>
```

## 约束
1. 遮罩 `.ui-drawer-overlay` 必首位；面板 `<aside class="ui-drawer ui-glass">` 紧跟。
2. 方向：`right` 无修饰；`left`/`bottom` 加 `ui-drawer--left` / `ui-drawer--bottom`。
3. 打开态遮罩加 `show`；关闭态加 `aria-hidden="true"` + `inert`（JS）。
4. `role="dialog" aria-modal="true" aria-label` 必备。
5. header 内含标题区（`.ui-drawer-title` + 可选 `.ui-label` 副标题）与关闭按钮；主体包入 `.body`。
6. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash，class 手写稳定。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 右侧抽屉 | 见上通用结构；`aria-label="个股详情"`，含 header（标题+✕）与 `.body` |

## 主题缺口（由中央补 theme.css）
- 见 drawer.behavior.md：`.ui-drawer--left` / `.ui-drawer--bottom` 定位与 `.show` 时的 transform 规则缺失（默认 `right` 已具备）。
