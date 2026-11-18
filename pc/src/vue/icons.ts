/**
 * 内置内联图标（24×24 / currentColor），**仅供库内组件使用，不从 index 导出**。
 * - 只收纳「状态驱动、组件语义必需」的图标，边界判定见 contracts/icon.md；
 * - 描边宽度由调用处显式传入（缺省 2 = lucide 标准），以保持各组件既有 DOM 快照不变；
 * - 与 React 侧 src/react/icons.tsx 一一对应，图形与描边档位必须保持一致。
 */
import { defineComponent, h, type VNodeChild } from 'vue';

/** 图标公共 props */
export interface IconProps {
  /** 描边宽度；缺省 2（lucide 标准），特殊档位由调用处显式传入 */
  strokeWidth?: number;
}

/** 公共 svg 宿主：固定 24×24 / currentColor / 圆角描边，只有描边宽度可变 */
const Svg = defineComponent({
  name: 'UiIconSvg',
  props: {
    /** 描边宽度 */
    strokeWidth: { type: Number, default: 2 },
  },
  setup(props, { slots }) {
    return () =>
      h(
        'svg',
        {
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': props.strokeWidth,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        slots.default?.(),
      );
  },
});

/** 生成图标组件：固定图形 + 可配置描边宽度，保证各图标属性完全一致 */
function defineIcon(name: string, render: () => VNodeChild) {
  return defineComponent({
    name,
    props: {
      /** 描边宽度 */
      strokeWidth: { type: Number, default: 2 },
    },
    setup(props) {
      return () => h(Svg, { strokeWidth: props.strokeWidth }, () => render());
    },
  });
}

/** chevron-down：Select 下拉箭头 / Tree 展开 / Accordion caret */
export const IconCaret = defineIcon('IconCaret', () => h('path', { d: 'M6 9l6 6 6-6' }));

/** check：Select 多选勾选 / Steps 已完成 */
export const IconCheck = defineIcon('IconCheck', () => h('path', { d: 'M20 6L9 17l-5-5' }));

/** chevron-left：DatePicker 上一月 */
export const IconChevronLeft = defineIcon('IconChevronLeft', () =>
  h('path', { d: 'M15 18l-6-6 6-6' }),
);

/** chevron-right：DatePicker 下一月 */
export const IconChevronRight = defineIcon('IconChevronRight', () =>
  h('path', { d: 'M9 18l6-6-6-6' }),
);

/** search：Search 前缀 */
export const IconSearch = defineIcon('IconSearch', () => [
  h('circle', { cx: 11, cy: 11, r: 7 }),
  h('path', { d: 'M21 21l-4.3-4.3' }),
]);

/** calendar：DatePicker 触发钮 */
export const IconCalendar = defineIcon('IconCalendar', () => [
  h('rect', { x: 3, y: 4, width: 18, height: 17, rx: 2 }),
  h('path', { d: 'M3 9h18M8 2v4M16 2v4' }),
]);

/** table：Empty 默认占位（路径取自 vendor/lucide.min.js v1.51.0） */
export const IconTable = defineIcon('IconTable', () => [
  h('path', { d: 'M12 3v18' }),
  h('rect', { width: 18, height: 18, x: 3, y: 3, rx: 2 }),
  h('path', { d: 'M3 9h18' }),
  h('path', { d: 'M3 15h18' }),
]);
