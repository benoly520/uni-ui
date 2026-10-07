# Tooltip · DOM 结构契约（tooltip.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<span class="ui-tip [ui-tip--surface] [ui-tip--{placement}] [is-open]" [style]>
  <button/触发元素 ... aria-describedby="tip-xxx">触发文本</button>
  <span class="bubble" role="tooltip" id="tip-xxx" [aria-hidden="true"]>提示内容</span>
</span>
```

## 约束
1. class 顺序：**基类 `ui-tip` 必首位**，变体 `ui-tip--surface`、方位 `ui-tip--{placement}`、显示态 `is-open` 依次追加。
2. 触发元素为根 `.ui-tip` 的直接子节点；`.bubble` 紧随其后，二者同为根的直接子节点。
3. `.bubble` 固定 `role="tooltip"` + `id`；触发元素注入 `aria-describedby` 指向该 `id`。
4. 关闭态在 `.bubble` 写 `aria-hidden="true"`；显示态去掉该属性。
5. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5），class 手写稳定字符串。
6. 颜色零硬编码：invert 用 `var(--ui-text)` / `var(--ui-bg)`；surface 走 token 玻璃链。

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| invert 默认 | `<span class="ui-tip"><button class="ui-btn ui-btn--default ui-size-sm">悬停我（反转·默认）</button><span class="bubble" role="tooltip" id="tip-1" aria-hidden="true">反转色 tooltip</span></span>` |
| surface | `<span class="ui-tip ui-tip--surface"><button class="ui-btn ui-btn--default ui-size-sm">悬停我（跟随表面）</button><span class="bubble" role="tooltip" id="tip-2" aria-hidden="true">跟随主题表面 + 毛玻璃</span></span>` |
| 显示态 | `<span class="ui-tip is-open">…<span class="bubble" role="tooltip" id="tip-3">…</span></span>` |

## 主题缺口（由中央补 theme.css）
- `.ui-tip.is-open .bubble { opacity:1; transform: translateX(-50%) translateY(0); }`
- `.ui-tip:focus-within .bubble { opacity:1; transform: translateX(-50%) translateY(0); }`
- `.ui-tip--bottom .bubble` / `.ui-tip--left .bubble` / `.ui-tip--right .bubble` 方位定位规则
