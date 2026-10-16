/**
 * 内联 SVG 图标（24×24 viewBox / currentColor），供库内 plain 组件使用。
 * - 形状与描边档位必须与 React（src/react/icons.tsx）/ Vue（src/vue/icons.ts）逐字一致；
 * - 尺寸**不写在 svg 上**：`.ui-icon` 容器走 `--ui-icon-size`，Steps 的无包裹用法走
 *   theme.css 的 `.ui-step-dot svg`。这样三端 DOM 才能完全对齐；
 * - 新框架禁止 JSX 属性展开（PLAIN_E1008），故用 Svg 辅助组件承载公共 svg 属性，避免逐图标重复。
 */
import { resolve } from 'plain';
import type { MaybeGetter, Renderable } from './_shared';

/** 图标公共 props */
export interface IconProps {
  /** 描边宽度；缺省 2（lucide 标准），特殊档位由调用处显式传入 */
  strokeWidth?: MaybeGetter<number>;
}

/** 公共 svg 宿主：固定 24×24 viewBox / currentColor / 圆角描边，只有描边宽度可变 */
function Svg(props: IconProps & { children?: Renderable | (() => Renderable) }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width={resolve(props.strokeWidth) ?? 2}
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {resolve(props.children)}
    </svg>
  );
}

/** chevron-down：Select 下拉箭头 / Tree 展开 / Accordion caret */
export function IconCaret(props: IconProps) {
  return (
    <Svg strokeWidth={resolve(props.strokeWidth)}>
      <path d="M6 9l6 6 6-6"></path>
    </Svg>
  );
}

/** check：Select 多选勾选 / Steps 已完成 */
export function IconCheck(props: IconProps) {
  return (
    <Svg strokeWidth={resolve(props.strokeWidth)}>
      <path d="M20 6L9 17l-5-5"></path>
    </Svg>
  );
}

/** chevron-left：DatePicker 上一月 */
export function IconChevronLeft(props: IconProps) {
  return (
    <Svg strokeWidth={resolve(props.strokeWidth)}>
      <path d="M15 18l-6-6 6-6"></path>
    </Svg>
  );
}

/** chevron-right：DatePicker 下一月 */
export function IconChevronRight(props: IconProps) {
  return (
    <Svg strokeWidth={resolve(props.strokeWidth)}>
      <path d="M9 18l6-6-6-6"></path>
    </Svg>
  );
}

/** search：Search 前缀 */
export function IconSearch(props: IconProps) {
  return (
    <Svg strokeWidth={resolve(props.strokeWidth)}>
      <circle cx="11" cy="11" r="7"></circle>
      <path d="M21 21l-4.3-4.3"></path>
    </Svg>
  );
}

/** calendar：DatePicker 触发钮 */
export function IconCalendar(props: IconProps) {
  return (
    <Svg strokeWidth={resolve(props.strokeWidth)}>
      <rect x="3" y="4" width="18" height="17" rx="2"></rect>
      <path d="M3 9h18M8 2v4M16 2v4"></path>
    </Svg>
  );
}

/** table：Empty 默认占位（路径取自 vendor/lucide.min.js v1.51.0） */
export function IconTable(props: IconProps) {
  return (
    <Svg strokeWidth={resolve(props.strokeWidth)}>
      <path d="M12 3v18"></path>
      <rect width="18" height="18" x="3" y="3" rx="2"></rect>
      <path d="M3 9h18"></path>
      <path d="M3 15h18"></path>
    </Svg>
  );
}
