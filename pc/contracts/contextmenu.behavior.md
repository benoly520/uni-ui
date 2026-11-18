# ContextMenu · 行为契约（contextmenu.behavior.md）

> 落地参照：`uni-ui-design-preview.html` 的 `.ui-contextmenu` 与 `initContextMenu`。键盘 / ARIA 两侧必须一致。

## 交互状态

| 状态 | 表现 | 触发 |
|---|---|---|
| 关闭 | `display:none`（无 `is-open`） | 初始 / 关闭 |
| 打开 | `is-open` → `display:block`；定位到光标 | `contextmenu` 事件 |
| 项 hover | 品牌柔光底 + 品牌色字 | 指针悬停 |
| 危险项 hover | 红柔光底 + 危险色字（`is-danger`） | 指针悬停危险项 |
| 边缘翻转 | 超出视口则 x→x-width / y→y-height | 弹出时测量 |

## 状态机
```
   关闭 ──target contextmenu──▶ 打开（光标处，边缘翻转）
   打开 ──点项──▶ onSelect(key) → 关闭
   打开 ──外部 click / Esc──▶ 关闭
```

## 键盘 / a11y
- 菜单根 `role="menu"` + `aria-label`；项为 `role="menuitem"`。
- Esc 关闭（监听 document keydown）。
- 焦点管理：弹出后建议聚焦首项（组件预留，默认不强制），`focus-visible` 走全局焦点圈约定。

## 受控 / 非受控
- `open` 非 `undefined` → 受控：显隐由 prop 派生。
- 非受控 → 内部状态，右键弹出、点击/外部/Esc 关闭并回调 `onOpenChange`。
- 菜单项内容始终由 `items` 命令式传入（与受控无关）。

## 定位算法（对齐 `initContextMenu`）
```
   open(x, y): menu.is-open; r = menu.getBoundingClientRect();
   if (x + r.width  > innerWidth)  px = x - r.width;
   if (y + r.height > innerHeight) py = y - r.height;
   left = px; top = py;
```
