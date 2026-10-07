# Toast · DOM 结构契约（toast.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构（声明式 / 命令式共享）

```html
<div class="ui-toast ui-glass [ui-toast.show]" role="status" aria-live="polite">
  [<span class="ui-icon">{icon}</span>]
  [content 或 默认子节点]
</div>
```

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 预览角落态（§1615） | `<div class="ui-toast ui-glass" role="status" aria-live="polite"><span class="ui-avatar" style="…">✓</span><span>操作已保存</span></div>` |
| 显示态 | `<div class="ui-toast ui-glass ui-toast.show" role="status" aria-live="polite"><span>保存成功</span></div>` |
| 带图标 | `<div class="ui-toast ui-glass" role="status" aria-live="polite"><span class="ui-icon"><i data-lucide="check"></i></span><span>已提交</span></div>` |

## 命令式挂载
- `toast('保存成功')` → 在 `document.body` 末追加单例容器，内部渲染上面的 `<div class="ui-toast ui-glass">`；`show` 为 `true` 时追加 `ui-toast.show`。

## 约束
1. class 顺序：**基类 `ui-toast` 必首位**，毛玻璃 `ui-glass` 次，最后 `ui-toast.show`（仅可见时）。
2. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）—— class 必须手写稳定字符串。
3. 颜色零硬编码（除 #fff 文本对比）：背景走 `.ui-glass` 的 `var(--ui-glass-tint)` / `var(--ui-glass-opacity)`；icon 用 `currentColor`。
4. 图标节点形状不限（lucide / heroicons / 自有），满足 `icon.md` 的 24×24 + currentColor 契约。
