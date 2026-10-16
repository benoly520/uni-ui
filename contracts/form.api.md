# Form · API 契约（form.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-form`（§17.23 筛选 / 回测参数，校验）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-form`（必首位，`flex` 纵向）；可选子 `.ui-form-grid`（栅格）
- 字段行：`.ui-form-row` → `.ui-label` + `.ui-input` + `.ui-form-error`

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `fields` | `FormField[]` | — | 生成 `.ui-form-row` | 字段定义（见下） |
| `grid` | `boolean` | `true` | 包 `.ui-form-grid` | 字段栅格布局 |
| `submitText` | `string` | `'提交'` | 提交按钮文案 | — |
| `onSubmit` | `(values: Record<string,string>) => void` | — | 校验通过回调 | — |
| `idPrefix` | `string` | — | 生成 `id` / `label[for]`：`${idPrefix}-${name}` | 同页多个 Form 必须传唯一值，否则同名字段会串 label |
| `className` / `style` | — | — | — | — |

### FormField
| 字段 | 类型 | 说明 |
|---|---|---|
| `name` | `string` | 字段名（键） |
| `label` | `string` | `.ui-label` 文案 |
| `type` | `'text' \| 'date' \| 'number' \| 'email'` | input type，默认 `text` |
| `placeholder` | `string` | — |
| `defaultValue` | `string` | 初值 |
| `rules` | `FormRule[]` | 校验规则 |

### FormRule
| 字段 | 类型 | 说明 |
|---|---|---|
| `required` | `boolean` | 非空 |
| `pattern` | `RegExp` | 正则匹配 |
| `min` | `number` | 数值下限（number 类型） |
| `message` | `string` | 错误文案（优先）；缺省按规则给默认提示 |

## 事件
- 表单 `submit`：阻断默认提交 → 逐字段校验 → 写 `.ui-form-error` 并切 `.ui-form-item--error` / `.ui-input--error` → 全通过则 `onSubmit(values)`。

## 校验（还原预览 demoForm 校验语义）
- 必填：`!value.trim()` → 「必填」。
- 正则：`!pattern.test(value)` → `message || '格式不正确'`。
- 数值下限：`type==='number' && !(Number(value) > min)` → `message || '需大于 N'`。
- 单字段多条规则按顺序命中第一条。

## 命名纪律
- 错误态：行加 `.ui-form-item--error`（语义契约），输入框加 `.ui-input--error`（theme.css 实际红边，见交付报告缺口）；消息写 `.ui-form-error`。
