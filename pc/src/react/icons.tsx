/**
 * 内置内联图标（24×24 / currentColor），**仅供库内组件使用，不从 index 导出**。
 * - 只收纳「状态驱动、组件语义必需」的图标，边界判定见 contracts/icon.md；
 * - 描边宽度由调用处显式传入（缺省 2 = lucide 标准），以保持各组件既有 DOM 快照不变；
 * - 与 Vue 侧 src/vue/icons.ts 一一对应，图形与描边档位必须保持一致。
 */
import type { ReactNode } from 'react';

/** 图标公共 props */
export interface IconProps {
  /** 描边宽度；缺省 2（lucide 标准），特殊档位由调用处显式传入 */
  strokeWidth?: number;
}

/** 公共 svg 宿主：固定 24×24 / currentColor / 圆角描边，只有描边宽度可变 */
function Svg({ strokeWidth, children }: { strokeWidth: number; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** chevron-down：Select 下拉箭头 / Tree 展开 / Accordion caret */
export const IconCaret = ({ strokeWidth = 2 }: IconProps = {}) => (
  <Svg strokeWidth={strokeWidth}>
    <path d="M6 9l6 6 6-6" />
  </Svg>
);

/** check：Select 多选勾选 / Steps 已完成 */
export const IconCheck = ({ strokeWidth = 2 }: IconProps = {}) => (
  <Svg strokeWidth={strokeWidth}>
    <path d="M20 6L9 17l-5-5" />
  </Svg>
);

/** chevron-left：DatePicker 上一月 */
export const IconChevronLeft = ({ strokeWidth = 2 }: IconProps = {}) => (
  <Svg strokeWidth={strokeWidth}>
    <path d="M15 18l-6-6 6-6" />
  </Svg>
);

/** chevron-right：DatePicker 下一月 */
export const IconChevronRight = ({ strokeWidth = 2 }: IconProps = {}) => (
  <Svg strokeWidth={strokeWidth}>
    <path d="M9 18l6-6-6-6" />
  </Svg>
);

/** search：Search 前缀 */
export const IconSearch = ({ strokeWidth = 2 }: IconProps = {}) => (
  <Svg strokeWidth={strokeWidth}>
    <circle cx={11} cy={11} r={7} />
    <path d="M21 21l-4.3-4.3" />
  </Svg>
);

/** calendar：DatePicker 触发钮 */
export const IconCalendar = ({ strokeWidth = 2 }: IconProps = {}) => (
  <Svg strokeWidth={strokeWidth}>
    <rect x={3} y={4} width={18} height={17} rx={2} />
    <path d="M3 9h18M8 2v4M16 2v4" />
  </Svg>
);

/** table：Empty 默认占位（路径取自 vendor/lucide.min.js v1.51.0） */
export const IconTable = ({ strokeWidth = 2 }: IconProps = {}) => (
  <Svg strokeWidth={strokeWidth}>
    <path d="M12 3v18" />
    <rect width={18} height={18} x={3} y={3} rx={2} />
    <path d="M3 9h18" />
    <path d="M3 15h18" />
  </Svg>
);
