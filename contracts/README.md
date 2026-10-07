# uni-ui 共享契约（contracts/）

> 设计层交付，非组件实现代码。对应主文档 §16 落地细则的样板区。

## 定位
uni-ui 采用「两套独立实现 + 共享契约」架构（§14 / §15）：

- **`@uni-ui/react` / `@uni-ui/vue`** 各自独立实现组件视图；
- **`@uni-ui/core`** 仅承载本目录的契约 + token + 样式；
- 一致性靠 **契约 + DOM 快照对拍** 保证（产物级 DOM 统一，非代码级统一）。

## 契约四件套（每个组件一份）

| 文件 | 内容 | 回答的问题 |
|---|---|---|
| `*.api.md` | 属性 / props / 插槽 / 事件 命名与类型 | 组件怎么传参 |
| `*.behavior.md` | 交互 / 状态机 / 键盘 / ARIA | 组件怎么动、怎么被访问 |
| `*.dom.md` | 期望标签 + class + 层级（快照基准） | 产物长什么样 |
| `token.md` | 设计 token（CSS 变量） | 颜色 / 尺寸 / 材质从哪来 |

## 与本预览页的关系
`/workspace/uni-ui-design-preview.html` 是视觉方向的可执行原型。预览页里的 `.ui-btn` 等 class 与 `--ui-*` token **即本目录契约的落地参照**——两侧框架实现必须对齐这些 DOM 结构与 CSS 变量。

## 硬纪律（§16.5 / §16.6）
1. **三禁**：禁用 `scoped`、运行时 CSS-in-JS、CSS Modules 自动 hash —— class 必须手写稳定（`ui-btn`），否则快照对拍碎。
2. **颜色零硬编码**：除白 / 黑文本对比，颜色一律走 `--ui-*` token。
3. **改组件流程**：先改 `contracts/*.md` + `styles/*.css` + `tokens` → 再两侧实现 → 最后跑对拍测试（进 CI）。

## 样板进度
- [x] `button.{api,behavior,dom}.md` — 首件完整样板
- [x] `token.md` — token 总览
- [x] `icon.md` — 图标插槽契约
- [ ] 其余组件（Input / Select / Dialog / Table …）契约待补
