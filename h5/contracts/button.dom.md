# Button · DOM 结构契约（button.dom.md）

> 快照对拍基准。React / Vue / Plain 三端必须产出完全一致的标签、class 顺序与层级。

## 通用结构

```html
<button
  class="h5-btn h5-btn--{variant} [h5-btn--large|h5-btn--small] [h5-btn--block] [h5-btn--round] [h5-btn--loading] [自定义 class]"
  type="button"
  [disabled]
  [aria-busy="true"]
>
  [<span class="h5-btn__icon">{icon}</span>]
  [文本或节点]
</button>
```

- loading 时 `.h5-btn__icon` 被 `<span class="h5-btn__spinner" aria-hidden="true"></span>` 替换。
- `icon` 未传入且非 loading 时，不输出 `.h5-btn__icon`。

## 基准用例

| 场景 | DOM |
|---|---|
| Primary（默认） | `<button class="h5-btn h5-btn--primary" type="button">确定</button>` |
| Secondary | `<button class="h5-btn h5-btn--secondary" type="button">次要</button>` |
| Outline | `<button class="h5-btn h5-btn--outline" type="button">描边</button>` |
| Ghost | `<button class="h5-btn h5-btn--ghost" type="button">文字按钮</button>` |
| Danger | `<button class="h5-btn h5-btn--danger" type="button">删除</button>` |
| Large | `<button class="h5-btn h5-btn--primary h5-btn--large" type="button">大按钮</button>` |
| Small | `<button class="h5-btn h5-btn--primary h5-btn--small" type="button">小按钮</button>` |
| Block | `<button class="h5-btn h5-btn--primary h5-btn--block" type="button">通栏</button>` |
| Round | `<button class="h5-btn h5-btn--primary h5-btn--round" type="button">胶囊</button>` |
| 带图标 | `<button class="h5-btn h5-btn--primary" type="button"><span class="h5-btn__icon">{icon}</span>新建</button>` |
| Loading | `<button class="h5-btn h5-btn--primary h5-btn--loading" type="button" disabled aria-busy="true"><span class="h5-btn__spinner" aria-hidden="true"></span>提交中</button>` |
| Disabled | `<button class="h5-btn h5-btn--primary" type="button" disabled>禁用</button>` |

## 约束

1. **class 顺序固定**：`h5-btn` 首位 → `h5-btn--{variant}` → 尺寸类 → `h5-btn--block` → `h5-btn--round` → `h5-btn--loading` → 自定义 class。
2. medium 尺寸不输出尺寸类；large / small 分别输出 `h5-btn--large` / `h5-btn--small`。
3. 禁止 scoped / 运行时 CSS-in-JS / CSS Modules hash；class 必须是稳定字符串。
4. 所有颜色与尺寸来自 `--h5-*` token，禁止组件内硬编码。
5. loading 与 disabled 时根节点必须带原生 `disabled`；loading 额外带 `aria-busy="true"`。
6. 图标快照记法统一使用 `{icon}`，表示由使用方传入，组件不注入默认图形（见 `icon.md`）。
