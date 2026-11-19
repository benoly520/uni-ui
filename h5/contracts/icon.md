# 图标插槽契约（icon.md）

> 组件不内置通用图标库。Button 仅内置「加载中」这一状态图标（spinner），其余图标由使用方传入。

## icon 插槽契约

- 传入方式：三端统一使用 `icon` prop。
- 容器：组件自动包裹 `<span class="h5-btn__icon">{icon}</span>`。
- 尺寸：容器宽高均为 `1em`，随按钮字号缩放；图标的 svg 应设置 `width: 100%; height: 100%`。
- 颜色：`fill: currentColor`，跟随按钮文字色。
- 推荐：24×24 viewBox，描边或填充均可，不写固定 `width` / `height`。

## 内置状态图标

| 名称 | class | 触发 | 说明 |
|---|---|---|---|
| spinner | `h5-btn__spinner` | `loading === true` | 内置加载指示器，替换 icon 位置 |

- spinner 是状态驱动图标，不使用方替换；实现在组件内部，三端 DOM 必须一致。
- 除 spinner 外，Button 不内置任何图形。

## 快照记法

`*.dom.md` 中的图标位置统一记作 `{icon}`，表示节点由使用方传入、组件不感知内容：

```html
<span class="h5-btn__icon">{icon}</span>
```

spinner 直接写出确定结构：

```html
<span class="h5-btn__spinner" aria-hidden="true"></span>
```
