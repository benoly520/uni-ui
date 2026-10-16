# 图标插槽契约（icon.md）

> 组件**不内置图标库**，只内置少量「组件语义必需」的内联 SVG（见下「内置 vs 外置」）。任意满足下契约的 SVG 节点塞入 `icon` 插槽即可（§17.27）。

## 契约（icon 插槽）
- 形状：24×24 viewBox。
- 描边：`stroke="currentColor"`（填充图标用 `fill="currentColor"`）。
- 尺寸：由 `.ui-icon` 的 `--ui-icon-size` 决定，随 `.ui-size-*` 档位缩放。
- 颜色：继承 `currentColor`，随文字色变。

## 推荐体系：lucide（非内置）
- MIT / ISC，线性风格，2126 个图标（v1.51.0，本地 `vendor/lucide.min.js`）。
- 预览零构建写法：`<span class="ui-icon"><i data-lucide="plus"></i></span>` + 页尾 `lucide.createIcons()`。
- 真实工程用法（不靠运行时 createIcons）：
  - React：`import { Plus } from 'lucide-react'`
  - Vue：`import { Plus } from 'lucide-vue-next'`
  - 把图标组件塞进 `icon` 插槽，尺寸 / 颜色由 `.ui-icon` 统一接管。

## 可替换性
- heroicons / 自有图标集只要满足 24×24 + currentColor 即可无缝替换，组件不感知具体图标集——这是「零内置、可换」设计意图。

## 内置 vs 外置（边界判定）
组件只内置**「没有它就无法正确表达状态」**的图标；其余一律外置，走 `icon` 插槽。

| 类别 | 判定 | 处理 | 现有 |
|---|---|---|---|
| 状态驱动 / 语义必需 | 图标即状态的一部分，用户替换会破坏交互语义 | **内置内联 SVG** | `chevron-down`（Select / Tree / Accordion 的 caret）、`chevron-left`·`chevron-right`（DatePicker 月导航）、`check`（Select 多选勾选、Steps 已完成）、`search`（Search 前缀）、`calendar`（DatePicker 触发钮）、`table`（Empty 默认占位） |
| 内容驱动 / 用户可选 | 图标只是内容装饰，可有可无 | **外置，走 `icon` 插槽** | `Button.icon`、`Tag.icon`、`Avatar.icon`、`Input.prefix/suffix`、`Toast.icon`、`Empty.icon` |

纪律：
1. 内置图标一律 **24×24 viewBox + `currentColor` 内联 SVG**，零图标库运行时；svg 自身**不写 `width`/`height`**——尺寸由容器决定（`.ui-icon` 走 `--ui-icon-size`，Steps 圆点走 `.ui-step-dot svg`），从而 React / Vue / Plain 三端 DOM 逐字一致。
2. 仅当「组件自身语义必需」才允许新增内置图标；不要因为「用起来方便」把通用图标塞进库（否则等于变相内置了一个图标库）。
3. 内置图标与设计预览的 `data-lucide` 占位是**同一图形**：预览靠 `createIcons()` 运行时替换，组件靠内联 SVG 静态产出，最终 DOM 视觉一致。

## 契约快照记法（dom 契约里怎么标图标）
各 `*.dom.md` 的 DOM 快照里，图标位置只允许用下面两种记法，避免把「内置」和「使用方传入」混为一谈：

| 记法 | 含义 | 展开 |
|---|---|---|
| `{icon}` | **使用方传入**的节点，内容组件不感知 | 组件只负责包一层 `.ui-icon`；真实内容由使用方决定 |
| `{SVG:name@w}` | **组件内置**的内联 SVG | `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round">{name 的图形}</svg>` |

`{name}` 取值与图形（**字节级定义**，三端实现必须逐字一致）：

| name | 图形 | 出现位置（描边档） |
|---|---|---|
| `chevron-down` | `<path d="M6 9l6 6 6-6"/>` | Select 下拉箭头(2)、Tree 展开(2.4)、Accordion caret(2.4) |
| `chevron-left` | `<path d="M15 18l-6-6 6-6"/>` | DatePicker 上一月(2.4) |
| `chevron-right` | `<path d="M9 18l6-6-6-6"/>` | DatePicker 下一月(2.4) |
| `check` | `<path d="M20 6L9 17l-5-5"/>` | Select 多选勾选(2.4)、Steps 已完成(3) |
| `search` | `<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>` | Search 前缀(2) |
| `calendar` | `<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>` | DatePicker 触发钮(2) |
| `table` | `<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>` | Empty 默认占位(2) |

说明：
- 设计预览里这些位置写的是 `<i data-lucide="…">` 占位，由页尾 `createIcons()` 运行时替换；组件侧一律**静态产出**上表的内联 SVG，不依赖任何图标库运行时。
- `{SVG:name@w}` 只是**快照记法**：展开结果是确定的字节序列，快照仍可机械对拍。`@w` 即 `stroke-width`，各调用处的档位不同（见上表），不要统一。
- 使用方传入的插槽（`Button.icon` / `Tag.icon` / `Avatar.icon` / `Input.prefix`·`suffix` / `Toast.icon` / `Empty.icon`）一律记作 `{icon}`——组件不注入任何默认图形（`Empty` 的内置 `table` 是唯一的例外，其默认值属内置，记作 `{SVG:table@2}`）。
