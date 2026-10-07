# 设计 Token 契约（token.md）

> 所有视觉变量单一真理源。命名统一 `--ui-` 前缀；颜色零硬编码（§16.5 / §17.8）。

## 分组

| 组 | 代表 token | 说明 |
|---|---|---|
| 品牌色 | `--ui-color-brand` / `-hover` / `-soft` | 七色光谱可覆盖，**唯一换肤入口** |
| 语义色 | `--ui-color-danger` / `-success` / `-warning` / `-info` | warning / info 已抽离（§17.29），不硬编码 |
| 涨跌色 | `--ui-color-up` / `-down` | **独立于** danger / success（中国红涨非 danger） |
| 语义表面 | `--ui-bg` / `-elevated` / `-text` / `-text-muted` / `-border` | 亮 / 暗双主题 |
| 毛玻璃 | `--ui-glass-tint` / `-blur` / `-saturate` / `-opacity` / `-opacity-strong` + `*-(default)` 别名 | 惰性求值防自引用（§17.19 / §17.20） |
| 间距 | `--ui-space-1..7` | 4px 网格 |
| 圆角 | `--ui-radius-sm/md/lg/pill` | 小圆角利落 |
| 阴影 | `--ui-shadow-1..3` | 带环境色 |
| 动效 | `--ui-ease` / `-dur-fast` / `-dur-base` | 缓动 + 时长 |
| 字体 | `--ui-font-display/body/mono` | |
| 字阶 | `--ui-fs-xs..3xl` | 模块化 |
| 尺寸 Scale | `--ui-control-h-*` / `-fs-control-*` / `-pad-x-*` / `-icon-size-*` + `.ui-size-*` | 4 档大 / 中 / 微 / 小 |

## 主题覆盖（零 JS）
- 暗色：`[data-theme="dark"]` 覆盖语义表面组。
- 品牌换肤：仅改 `--ui-color-brand`（+ hover / soft 协调），全站跟随。
- 涨跌约定：`[data-mkt="cn"]` 红涨绿跌（默认）；`[data-mkt="intl"]` 绿涨红跌。

## 纪律
- 组件 CSS 不得出现裸色值（white / black 文本对比除外），一律引用 `--ui-*`。
- 毛玻璃覆盖用「组件级 `--ui-{comp}-glass-*` → 回退 `--ui-glass-*-default`」链，禁派生中间 token（§17.19）。
