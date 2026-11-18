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
| `glass` | `boolean` | `true` | 仅 `false` 时输出 `data-glass="off"` | 玻璃材质开关，`false` 回退为不透明实心面（见 token.md §玻璃开关） |

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

## 玻璃开关（glass）
- `glass?: boolean`，默认 `true`：不输出任何属性，渲染结果与引入开关前完全一致。
- 传 `false` 时根节点输出 `data-glass="off"`，theme.css §4.1 把受影响的玻璃面回退为不透明 `--ui-glass-off-surface`（默认 `--ui-bg-elevated`）并移除 `backdrop-filter`。
- 本组件不含磨砂面（不消耗 `--ui-glass-tint` / `backdrop-filter`），为三端 API 一致性保留，传 `false` 无视觉变化；内部组合的玻璃组件由其自身 `glass` 控制。
- 全站关闭用 `<html data-glass="off">`；任意祖先元素加该属性即对其子树生效（逃生阀）。

## 命名纪律
- 全部 class 手写稳定；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：done / current / line 走 `var(--ui-color-brand)`、柔光 `var(--ui-color-brand-soft)`。
