# Steps · API 契约（steps.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-steps`（§17.30 / `initSteps`）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-steps`（必首位）
- 步项：`ui-step [is-done] [is-current] [is-clickable]`
- 子结构：`ui-step-dot` / `ui-step-text`(`ui-step-title`,`ui-step-desc`)；步间 `ui-step-line`

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `steps` | `StepItem[]` | — | 渲染为一组 `ui-step` | 流程步骤 |
| `current` | `number` | `0` | 当前步索引（高亮 + 描边） | 受控当前 |
| `defaultCurrent` | `number` | `0` | 非受控初始当前 | — |
| `clickable` | `boolean` | `true` | 决定是否追加 `is-clickable` 并绑定点击 | 点击重算链 |
| `onChange` | `(index: number) => void` | — | — | 点击步骤重算并回调新当前 |

### `StepItem`
| 字段 | 类型 | 说明 |
|---|---|---|
| `title` | `ReactNode` | 步骤标题 |
| `desc` | `ReactNode` | 步骤描述（可选） |

## 插槽
- 每个 step 的 `title` / `desc` 为节点，渲染进 `.ui-step-title` / `.ui-step-desc`。

## 事件
- `onChange(index)`：点击某可点步骤时，重算 `is-done` 链（`< index` 全 done，`== index` 当前）并回调。

## 交互特性（对齐 `initSteps`）
- 已完成步实心品牌色 + check；当前步高亮描边（柔光圈）。
- 点击步骤重算 `is-done` 链并重建圆点（done 显示 check，其余显示序号）。
- 步间连接线随 done 状态转品牌色。

## 命名纪律
- 全部 class 手写稳定；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：done / current / line 走 `var(--ui-color-brand)`、柔光 `var(--ui-color-brand-soft)`。
