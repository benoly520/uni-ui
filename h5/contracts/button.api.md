# Button · API 契约（button.api.md）

> 适用入口：`uni-ui-h5/react`、`uni-ui-h5/vue`、`uni-ui-h5/plain`。
> 三端同名 props、同默认值；未列出的原生属性按各框架原生方式透传。

## 组件标识

- 根 class：`h5-btn`（必须首位）
- 原生元素：`<button>`（保证键盘可达、焦点与表单语义）
- 设计基线：移动端触控按钮，默认高度 44px

## Props

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'danger'` | `'primary'` | `h5-btn--{variant}` | 语义变体 |
| `size` | `'large' \| 'medium' \| 'small'` | `'medium'` | `h5-btn--large` / 无 / `h5-btn--small` | 尺寸档位；medium 不输出尺寸类 |
| `block` | `boolean` | `false` | `h5-btn--block` | 通栏，占满父容器宽度 |
| `round` | `boolean` | `false` | `h5-btn--round` | 胶囊形状，可与任意变体叠加 |
| `loading` | `boolean` | `false` | `h5-btn--loading` + `aria-busy="true"` + 原生 `disabled` | 展示 spinner，禁用点击 |
| `disabled` | `boolean` | `false` | 原生 `disabled` | 原生禁用 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | 原生 `type` | 表单语义；表单内按钮应显式指定 |
| `icon` | 节点（SVG / 图标组件） | — | 包入 `.h5-btn__icon` | 置于文本前；loading 时被 spinner 替换 |
| `id` | `string` | — | 原生 `id` | 可选 |
| `className` | `string` | — | 追加到根 class 末尾 | React / Plain 使用；Vue 用原生 `class` |

## 插槽

- **默认插槽 / children**：按钮文本或任意节点。
- **图标**：通过 `icon` prop 传入，三端一致；组件只负责包一层 `.h5-btn__icon`，不感知图标内容。
- Vue 端同样使用 `icon` prop，保持与 React / Plain 的 API 对齐。

## 事件

| 事件 | 签名 | 说明 |
|---|---|---|
| `click` | `(event: MouseEvent) => void` | 原生 click；`disabled` 或 `loading` 时不触发 |

- React / Plain：`onClick` prop。
- Vue：`@click`，组件内部在禁用态下不派发。

## 导出

```ts
// React / Plain
import { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from 'uni-ui-h5/react';
import { Button, type ButtonProps, type ButtonVariant, type ButtonSize } from 'uni-ui-h5/plain';

// Vue
import { Button } from 'uni-ui-h5/vue';
```

## 命名纪律

- 基类 `h5-btn`，变体 `h5-btn--{variant}`，尺寸 / 形状 / 状态用 `h5-btn--{size|block|round|loading}`。
- 禁止用派生 CSS 变量承载可覆盖参数；组件只读 `--h5-*` token。
