# Button · DOM 结构契约（button.dom.md）

> 快照对拍基准。React / Vue 两侧必须产出**完全一致**的标签、class 顺序、层级。

## 通用结构

```html
<button class="ui-btn {variant} [ui-size-*] [ui-btn--pill] [ui-btn--loading]" type="button" [disabled] [aria-busy="true"] [aria-label="..."]>
  [<span class="ui-icon"><i data-lucide="NAME"></i></span>]
  [文本或节点]
</button>
```

## 基准用例（对齐预览页）

| 场景 | DOM |
|---|---|
| Primary | `<button class="ui-btn ui-btn--primary" type="button">开始使用</button>` |
| Default | `<button class="ui-btn ui-btn--default" type="button">查看组件</button>` |
| Ghost | `<button class="ui-btn ui-btn--ghost" type="button">Tooltip</button>` |
| Outline | `<button class="ui-btn ui-btn--outline" type="button">Outline</button>` |
| Danger | `<button class="ui-btn ui-btn--danger" type="button">Danger</button>` |
| 带图标 | `<button class="ui-btn ui-btn--primary" type="button"><span class="ui-icon"><i data-lucide="plus"></i></span>新建</button>` |
| 尺寸 lg | `<button class="ui-btn ui-btn--primary ui-size-lg" type="button">大</button>` |
| 胶囊 | `<button class="ui-btn ui-btn--primary ui-btn--pill" type="button">胶囊 Primary</button>` |
| loading | `<button class="ui-btn ui-btn--primary ui-btn--loading" type="button" aria-busy="true">加载</button>` |
| disabled | `<button class="ui-btn ui-btn--primary" type="button" disabled>禁用</button>` |

## 约束
1. class 顺序：**基类 `ui-btn` 必首位**，变体次之，修饰类（`ui-size-*` / `ui-btn--pill` / `ui-btn--loading`）追加。
2. **禁止** scoped / 运行时 CSS-in-JS / CSS Modules 自动 hash（§16.5）—— class 必须手写稳定字符串。
3. 颜色零硬编码（除 #fff 文本对比）：primary 背景 `var(--ui-color-brand)`、danger `var(--ui-color-danger)`，全部走 token。
4. 图标节点形状不限（lucide / heroicons / 自有），只要满足 `icon.md` 的 24×24 + currentColor 契约。
