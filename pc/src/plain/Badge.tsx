import { cx, mergeStyle } from './_shared';
import type { Renderable } from './_shared';

export type BadgeTone = 'brand' | 'danger' | 'success' | 'warning' | 'info';

export interface BadgeProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  tone?: BadgeTone;
  dot?: boolean;
  count?: number;
  max?: number;
  showZero?: boolean;
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Badge · 徽标（基础）
 * count 超过 max 截断为 `max+`；dot 渲染状态圆点；count 为 0 且非 showZero 渲染空片段。
 */
export function Badge(props: BadgeProps) {
  const tone = () => props.tone ?? 'brand';
  const dot = () => props.dot ?? false;
  const maxVal = () => props.max ?? 99;
  const showZero = () => props.showZero ?? false;
  const countVal = () => props.count;
  const hidden = () => {
    const c = countVal();
    return c != null && c === 0 && !showZero();
  };
  const content = () => {
    const c = countVal();
    return c != null ? (c > maxVal() ? maxVal() + '+' : '' + c) : props.children?.();
  };
  return (
    <span
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-badge', props.className)}
      style={mergeStyle(
        {
          background: 'var(--ui-color-' + tone() + '-soft, var(--ui-color-brand-soft))',
          color: 'var(--ui-color-' + tone() + ', var(--ui-color-brand))',
          display: hidden() ? 'none' : '',
        },
        props.style,
      )}
    >
      {dot() && (
        <span
          class="ui-badge-dot"
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'currentColor',
            flex: 'none',
          }}
        ></span>
      )}
      {content()}
    </span>
  );
}
