# Avatar · 行为契约（avatar.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-avatar`（§17.x / §17.23）。键盘 / ARIA 两侧必须一致。

## 交互状态
- 纯展示组件，无 hover / active / focus 专属态（除非调用方包裹可聚焦元素）。

## 优先级（内容来源）
```
src 存在 ?
  └─ 渲染 <img>（忽略 text / icon）
否则 icon 存在 ?
  └─ 渲染 <span class="ui-icon">{icon}</span>
否则 text 存在 ?
  └─ 渲染文本
否则
  └─ 空（仅底色圆）
```

## 尺寸映射
- `xs=24 / sm=28 / md=32 / lg=40`（px），对应 `font-size` 约为 `size*0.4`（md→13px，对齐预览 `fs-sm`）。
- 自定义 `number` 直接作为 `width/height` 像素，`font-size` 按比例。
- 尺寸经根 `style` 写入，覆盖 `.ui-avatar` 默认 32px（预览实证）。

## 键盘 / a11y
- 图片头像必须 `alt`（默认 `''`，调用方应填有意义文案）。
- 纯装饰头像可包 `aria-hidden="true"`（调用方决定）。
- 不自带 `role`；作按钮/链接时应由外层元素承接语义。

## 表单语义
- 不参与表单提交。
