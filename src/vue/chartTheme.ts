import { onMounted, onBeforeUnmount, ref, type Ref } from 'vue';

/** 图表主题对象：色值全部源自 uni-ui CSS 变量（单一真理源） */
export interface ChartTheme {
  /** 品牌主色（净值线 / 渐变） */
  brand: string;
  /** 涨色（超额区域 / 涨标记） */
  up: string;
  /** 跌色（回撤区域 / 跌标记） */
  down: string;
  /** 辅助文字（基准虚线） */
  text: string;
  /** 网格线 */
  grid: string;
  /** 图表背景 */
  bg: string;
}

const EMPTY: ChartTheme = { brand: '', up: '', down: '', text: '', grid: '', bg: '' };

/**
 * 读取 document.documentElement 计算样式中的 uni-ui token → 图表主题对象。
 * 对齐预览页 uniChartTheme()；SSR 无 document 时返回空对象。
 */
export function uniChartTheme(): ChartTheme {
  if (typeof document === 'undefined') return EMPTY;
  const cs = getComputedStyle(document.documentElement);
  const g = (n: string) => cs.getPropertyValue(n).trim();
  return {
    brand: g('--ui-color-brand'),
    up: g('--ui-color-up'),
    down: g('--ui-color-down'),
    text: g('--ui-text-muted'),
    grid: g('--ui-border'),
    bg: g('--ui-bg-elevated'),
  };
}

/**
 * useChartTheme · Vue 组合式函数
 * 返回当前主题（Ref<ChartTheme>）；documentElement 的 data-theme / data-mkt / style 变化时自动重算。
 * 内部 MutationObserver 在卸载时 disconnect。
 */
export function useChartTheme(): Ref<ChartTheme> {
  const theme = ref<ChartTheme>(uniChartTheme());
  let obs: MutationObserver | null = null;

  onMounted(() => {
    if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') return;
    theme.value = uniChartTheme();
    obs = new MutationObserver(() => {
      theme.value = uniChartTheme();
    });
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-mkt', 'style'],
    });
  });

  onBeforeUnmount(() => {
    obs?.disconnect();
    obs = null;
  });

  return theme;
}
