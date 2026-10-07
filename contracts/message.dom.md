# Message · DOM 结构契约（message.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构（声明式 / 命令式共享）

```html
<div class="ui-message ui-message--{type} [ui-message.show]" role="status" aria-live="polite">
  <span class="dot"></span>
  <span class="msg-text">[content 或 默认子节点]</span>
</div>
```

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| 预览默认（§1618） | `<div class="ui-message" id="message" role="status" aria-live="polite"><span class="dot"></span><span class="msg-text">已保存</span></div>` |
| success 显示 | `<div class="ui-message ui-message--success ui-message.show" role="status" aria-live="polite"><span class="dot"></span><span class="msg-text">持仓已同步</span></div>` |
| warning | `<div class="ui-message ui-message--warning" role="status" aria-live="polite"><span class="dot"></span><span class="msg-text">部分数据延迟更新</span></div>` |

## 命令式挂载
- `showMessage('持仓已同步', 'success')` → 在 `document.body` 挂单例 `<div class="ui-message ui-message--success">`，下一帧加 `ui-message.show`。

## 约束
1. class 顺序：**基类 `ui-message` 必首位**，类型 `ui-message--{type}` 次，最后 `ui-message.show`（仅可见时）。
2. 固定子结构：先 `<span class="dot">` 后 `<span class="msg-text">`，顺序不可颠倒（CSS flex 布局依赖）。
3. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）。
4. 颜色零硬编码：`.dot` 走 `var(--ui-color-*)` 语义 token（§473-§476）。
