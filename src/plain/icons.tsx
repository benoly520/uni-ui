/**
 * 内联 SVG 图标（24×24 / currentColor）。包在 .ui-icon 内使用，保证与 React/Vue 视觉结构一致。
 */
const SVG_PROPS = {
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  'stroke-width': '2',
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round',
} as const;

export function IconCaret() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

export function IconCheck() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

export function IconChevronLeft() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
  );
}

export function IconChevronRight() {
  return (
    <svg {...SVG_PROPS}>
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

export function IconSearch() {
  return (
    <svg {...SVG_PROPS}>
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

export function IconCalendar() {
  return (
    <svg {...SVG_PROPS}>
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}
