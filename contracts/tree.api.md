# Tree · API 契约（tree.api.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-tree`（§17.30 / `initTree`）与既有实现 `src/react/Tree.tsx` + `TreeNode.vue`。React / Vue 两侧 props 命名与类型必须一致。

## 组件标识
- 根 class：`ui-tree`（必首位），`role="tree"`
- 节点：`ui-tree-node [ui-tree-leaf] [is-collapsed]`，`role="treeitem"`
- 行：`ui-tree-row` → `ui-tree-caret ui-icon` / `ui-tree-check` / `ui-tree-label` / `ui-tree-count`
- 子层：`ui-tree-children`（`<ul>`）

## Props / 属性（既有实现为准）

| 名称 | 类型 | 默认值 | 对应 class / 属性 | 说明 |
|---|---|---|---|---|
| `data` | `TreeData[]` | — | 渲染层级 | 层级数据 |
| `checkable` | `boolean` | `true` | 是否渲染 `ui-tree-check` | 勾选框（筛入板块） |
| `defaultExpandedKeys` | `string[]` | `parentKeys(data)` | — | 非受控初始展开；**仅在未传时**取默认值，显式传 `[]` 表示一个都不展开 |
| `defaultCheckedKeys` | `string[]` | `[]` | — | 非受控初始勾选 |
| `expandedKeys` | `string[]` | — | 受控展开 | 受控模式 |
| `checkedKeys` | `string[]` | — | 受控勾选 | 受控模式 |
| `onExpand` | `(keys, info) => void` | — | — | 展开变化 |
| `onCheck` | `(keys, info) => void` | — | — | 勾选变化 |

### `TreeData`
| 字段 | 类型 | 说明 |
|---|---|---|
| `key` | `string` | 唯一标识（状态键） |
| `label` | `string` | 显示文案 |
| `count` | `number` | 右侧计数徽标（可选） |
| `children` | `TreeData[]` | 子节点；无则为叶子 |

## 插槽
- 无显式插槽；`label` / `count` 为文本，`checkable` 控制勾选框渲染。

## 事件
- `onExpand(keys, {key, expanded})`：点击箭头 / 行（非叶子、非勾选）折叠或展开。
- `onCheck(keys, {key, checked})`：勾选框变更（`.ui-tree-check`）。

## 交互特性（对齐 `initTree`）
- 点击箭头或行折叠 / 展开（`is-collapsed` + `aria-expanded`）；叶子无子层不折叠。
- 勾选框筛入板块，勾选不触发折叠（`@click.stop`）。
- 数据驱动、受控 / 非受控双模式。

## 命名纪律
- 全部 class 手写稳定（`ui-tree*`）；禁 scoped / CSS-in-JS / hash。
- 颜色零硬编码：caret / row hover 走 `var(--ui-color-brand-soft)`、勾选 `accent-color: var(--ui-color-brand)`。
