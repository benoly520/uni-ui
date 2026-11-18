# uni-ui

面向不同运行环境的独立组件库集合。各端仅保持设计理念一致，不共享代码或设计文件。

## 目录

| 目录 | 场景 | 状态 |
| --- | --- | --- |
| [`pc/`](./pc/README.md) | 桌面 Web，支持 React / Vue / Plain | 已有组件库 |
| `h5/` | 移动 Web，计划支持 React / Vue / Plain | 目录预留，尚未实现 |
| `weapp/` | 微信小程序 | 目录预留，尚未实现 |
| `tui/` | 终端交互界面（TUI），不是脚手架 CLI | 目录预留，尚未实现 |

## 独立原则

- 各端独立管理源码、工具函数、样式、主题变量、组件契约、依赖、构建、测试和发布。
- 不创建跨端的 `shared`、`core`、公共 token 包，也不通过相对路径引用其他端的文件。
- 只在品牌色、视觉气质、状态色语义等设计理念上保持一致，各端分别实现。
- 允许重复代码，不为去重引入跨端耦合；各端不要求相同 DOM、API 或组件清单。
- 同一端内部可以共享主题、工具和契约；PC 与 H5 的 React / Vue / Plain 应在各自端内对齐。
- 微信小程序和 TUI 的技术选型独立决定，不预设沿用 Web 的三个框架。
- 每个实际实现的端应能脱离本仓库的其他端独立开发、构建和发布。

根目录只维护仓库说明、协作约定、Git 配置和许可证，不建立统一依赖或跨端构建工程。

## PC 开发

现有工程已整体迁入 `pc/`，包名 `uni-ui` 和 `uni-ui/react`、`uni-ui/vue`、
`uni-ui/plain`、`uni-ui/theme.css` 等导入路径不变。

本地开发需要相邻的 `plain-framework` 仓库，布局为：

```text
父目录/
├── plain-framework/
└── uni-ui/
    ├── pc/
    ├── h5/
    ├── weapp/
    └── tui/
```

在本仓库根目录执行：

```bash
cd pc
pnpm install
pnpm run typecheck
pnpm run typecheck:plain
pnpm run build
```

启动预览（从本仓库根目录执行）：

```bash
cd pc/playground
pnpm install
pnpm dev
```

更多说明见 [`pc/README.md`](./pc/README.md)。

## 本地消费路径迁移

通过包名消费已发布组件的导入语句无需更改。
若其他项目通过 `link:` 或源码 alias 指向旧仓库根目录，需要改为指向 `uni-ui/pc`，
源码与主题路径也相应改为 `uni-ui/pc/src/...` 和 `uni-ui/pc/theme.css`。

## 许可证

[MIT](./LICENSE)。PC 目录保留独立许可证副本，便于独立分发。
