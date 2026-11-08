import { cx } from './_shared';
import { IconTable } from './icons';
import type { Renderable } from './_shared';

export interface EmptyProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  description?: Renderable;
  /** 图标插槽（24×24 + currentColor）；默认内置 table 图标，可覆盖 */
  icon?: Renderable;
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Empty · 空态（展示）
 * 默认图标为内置内联 SVG（等价 lucide table，零图标库运行时）；可传 description / icon / 操作区 children。
 */
export function Empty(props: EmptyProps) {
  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-empty', props.className)}
      style={props.style}
    >
      <span class="ico ui-icon">
        {props.icon != null ? props.icon : <IconTable />}
      </span>
      {props.description != null && (
        <span class="ui-label">{props.description}</span>
      )}
      {props.children?.()}
    </div>
  );
}
