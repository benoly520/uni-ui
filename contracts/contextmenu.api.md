# ContextMenu · API 契约（contextmenu.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-contextmenu`（§17.30 / `initContextMenu`）。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 菜单根 class：`ui-contextmenu`（**无连字符**），`position:fixed`，`is-open` 显隐
- 项：`ui-contextmenu-item [is-danger]`（`role="menuitem"`、`data-key`）
- 分隔：`ui-contextmenu-sep`；快捷键：`ui-contextmenu-shortcut`

## Props / 属性

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `items` | `ContextMenuItem[]` | — | 渲染菜单项（命令式传入） | 菜单内容 |
| `targetRef` | `Ref<HTMLElement \| null>` | — | 右键触发目标 | 命令式绑定；**Plain 端例外**：无 ref 概念，对应 prop 名为 `target`，类型放宽为 `HTMLElement \| (() => HTMLElement \| null) \| { current }`（语义等价） |
| `open` | `boolean` | — | 受控显隐（可选） | 受控模式 |
| `defaultOpen` | `boolean` | `false` | — | 非受控初始 |
| `onOpenChange` | `(open: boolean) => void` | — | — | 显隐变化 |
| `onSelect` | `(key: string) => void` | — | — | 点击项执行 |
| `aria-label` | `string` | `'操作菜单'` | 根 `role="menu"` aria-label | — |
| `className` / `style` | — | — | 根 class / style | — |

### `ContextMenuItem`
| 字段 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 唯一命令键（`data-key`） |
| `label` | `ReactNode` | 项文案 |
| `shortcut` | `string` | 右侧快捷键提示（可选） |
| `danger` | `boolean` | 危险项（红 hover） |
| `separator` | `boolean` | 渲染为分隔线 |

## 插槽
- `label` 为节点；`items` 命令式传入（非具名插槽）。
- 菜单跟随 `targetRef` 上 `contextmenu` 事件光标处弹出。

## 事件
- 项点击 → `onSelect(key)` + 关闭。
- 外部点击 / Esc → 关闭并 `onOpenChange(false)`。

## 交互特性（对齐 `initContextMenu`）
- 右键（`contextmenu`）光标处弹出；近视口边缘翻转（x/width、y/height）。
- 危险项 `is-danger` 红 hover；分隔线无交互。

## 命名纪律
- class 手写稳定；**根无连字符** `ui-contextmenu`；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：hover 走 `var(--ui-color-brand)`、危险 hover 走 `var(--ui-color-danger)`。
