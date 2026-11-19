# uni-ui-h5 组件契约（contracts/）

> 本目录是 H5 移动端组件库的唯一事实来源，独立于仓库内其他端（pc / weapp / tui）。
> 契约只描述 H5 自身的 API、行为与 DOM，不复用、也不对齐其他端的组件契约。

## 定位

- H5 是独立产品：React / Vue / Plain 三套视图实现，共享本目录的契约与 `theme.css` token。
- 一致性靠 **契约 + DOM 快照对拍** 保证：三端产物标签、class、层级必须逐字一致。
- 设计基线是移动端：触控优先、375 设计稿、px 源码构建期转 rem。

## 每个组件的契约文件

| 文件 | 内容 | 回答的问题 |
|---|---|---|
| `<name>.api.md` | Props / 插槽 / 事件 / 导出 | 组件怎么传参 |
| `<name>.behavior.md` | 交互、状态机、键盘与 ARIA | 组件怎么动、怎么被访问 |
| `<name>.dom.md` | 标签 + class + 层级（快照基准） | 产物长什么样 |

公共契约：

| 文件 | 内容 |
|---|---|
| `token.md` | 设计 token、px → rem 适配规则、暗色主题 |
| `icon.md` | 图标插槽契约（`.h5-btn__icon`）与内置状态图标边界 |

## 硬纪律

1. **class 稳定**：禁用 scoped CSS、运行时 CSS-in-JS、CSS Modules 自动 hash；组件 class 必须手写。
2. **颜色零硬编码**：组件样式只引用 `--h5-*` token（白 / 黑文本对比除外）。
3. **px 只出现在源码**：`theme.css` 写 px，构建时统一转 rem；1px 发丝线保留 px。
4. **三端同构**：React / Vue / Plain 的 props 命名、默认值、class 顺序、DOM 层级一致。
5. **先改契约再改实现**：行为或 DOM 变更必须先更新本目录，再同步三端实现。

## 当前进度

- [x] `button.{api,behavior,dom}.md`
- [x] `token.md`
- [x] `icon.md`
