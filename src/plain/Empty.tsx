import { resolve } from 'plain';
import { cx } from './_shared';
import { IconTable } from './icons';
import type { MaybeGetter, Renderable } from './_shared';

export interface EmptyProps {
  description?: Renderable | (() => Renderable);
  /** 图标插槽（24×24 + currentColor）；默认内置 table 图标，可覆盖 */
  icon?: Renderable | (() => Renderable);
  children?: Renderable | (() => Renderable);
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Empty · 空态（展示）
 * 默认图标为内置内联 SVG（等价 lucide table，零图标库运行时）；可传 description / icon / 操作区 children。
 */
export function Empty(props: EmptyProps) {
  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-empty', resolve(props.className))}
      style={resolve(props.style)}
    >
      <span class="ico ui-icon">
        {resolve(props.icon) != null ? resolve(props.icon) : <IconTable />}
      </span>
      {resolve(props.description) != null && (
        <span class="ui-label">{resolve(props.description)}</span>
      )}
      {resolve(props.children)}
    </div>
  );
}
