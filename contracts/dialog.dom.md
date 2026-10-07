# Dialog · DOM 结构契约（dialog.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<div class="ui-overlay [show]" role="presentation" [aria-hidden="true"]>
  <div class="ui-dialog ui-glass" role="dialog" aria-modal="true" aria-label="确认操作">
    [<h3>确认操作</h3>]
    <!-- 默认插槽：主体内容 -->
    <p class="ui-label">这是 macOS 风毛玻璃对话框…</p>
    [<div class="ui-dialog-actions">
      <button class="ui-btn ui-btn--ghost">取消</button>
      <button class="ui-btn ui-btn--primary">确认</button>
    </div>]
  </div>
</div>
```

## 约束
1. 遮罩 `.ui-overlay` 必首位包裹；面板 `.ui-dialog` 紧跟 `ui-glass`（`ui-glass` 承接毛玻璃 token 链）。
2. 打开态在 `.ui-overlay` 加 `show`；关闭态加 `aria-hidden="true"` + `inert`（JS 设置，无障碍阻断）。
3. `role="dialog"` + `aria-modal="true"` + `aria-label`（无可见标题时仍须有 label）。
4. 标题渲染为 `<h3>`（位于面板顶部）；存在 footer 时末尾渲染 `.ui-dialog-actions`。
5. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash，class 手写稳定。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 确认对话框 | 见上通用结构；`aria-label="确认操作"`，含 h3 + p.ui-label + ui-dialog-actions（取消/确认） |

## 主题缺口（由中央补 theme.css）
- 无（`.ui-overlay`/`.ui-overlay.show`/`.ui-dialog`/`.ui-dialog-actions`/`.ui-glass` 规则均已具备）。
- 注：关闭态 `inert` 为 HTML 原生属性，无需 CSS；`aria-hidden` 由组件 JS 写入。
