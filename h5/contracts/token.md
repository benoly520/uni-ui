# 设计 Token 契约（token.md）

> 所有视觉变量的单一来源，命名统一 `--h5-` 前缀。组件样式只读 token，不写裸色值。

## px → rem 适配规则

H5 以移动端 375px 设计稿为基准：

| 项 | 值 | 说明 |
|---|---|---|
| 设计稿宽度 | 375px | 源码与视觉标注基准 |
| rootValue | 37.5 | 1rem = 37.5px，即 10rem = 屏宽 |
| 转换时机 | 构建时 | `postcss-pxtorem` 处理 `theme.css` |
| 最小转换值 | 2px | 1px 发丝线保留 px，避免低 dpr 设备上消失 |
| 媒体查询 | 不转换 | `mediaQuery: false`，断点仍按物理像素书写 |
| 最大适配宽度 | 750px | 超过后根字号不再放大 |

运行时由 `setupRem()` 设置根字号：

```ts
import { setupRem } from 'uni-ui-h5/flexible';
setupRem(); // 根字号 = min(视口宽, 750) / 375 * 37.5
```

构建产物 `dist/theme.css` 中的长度已转为 rem；源码 `theme.css` 保持 px 可读。

## Token 分组

| 组 | Token | 说明 |
|---|---|---|
| 品牌色 | `--h5-color-brand` / `-active` / `-soft` | 主色及其按下态、柔光背景 |
| 语义色 | `--h5-color-danger` / `-active` / `--h5-color-success` | 危险、成功 |
| 前景色 | `--h5-color-on-brand` | 品牌底上的文字色 |
| 文本与表面 | `--h5-color-text` / `-text-soft` / `-surface` | 主文本、次要文本、表面 |
| 填充 | `--h5-color-fill` / `-fill-active` | 次级按钮与按下态 |
| 描边 | `--h5-color-border` / `-border-active` | 描边按钮 |
| 圆角 | `--h5-radius-sm` / `-md` / `-pill` | 6 / 10 / 999px（源码） |
| 字体 | `--h5-font-family` / `--h5-font-size-sm` / `-md` / `-lg` | 系统字体栈与字阶 |
| 按钮尺寸 | `--h5-btn-height-sm` / `-md` / `-lg`、`--h5-btn-pad-*` | 36 / 44 / 50px 触控高度 |
| 动效 | `--h5-ease` / `--h5-dur-fast` | 缓动与过渡时长 |

## 主题覆盖

- 暗色：`[data-theme="dark"]` 仅覆盖语义颜色 token，组件结构不变。
- 换肤：覆盖 `--h5-color-brand` 及其 `-active` / `-soft`，即可整体切换品牌色。

## 纪律

- 组件样式不得出现裸色值（白 / 黑文本对比除外）。
- 新增 token 必须同步更新本文件，并在对应组件契约中引用。
- token 只在 H5 内部生效，不与其他端共享。
