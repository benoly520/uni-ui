import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface EmptyProps {
  description?: Renderable | (() => Renderable);
  icon?: Renderable | (() => Renderable);
  children?: Renderable | (() => Renderable);
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Empty · 空态（展示）
 * 默认图标用 <i data-lucide="table">；可传 description / icon / 操作区 children。
 */
export function Empty(props: EmptyProps) {
  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-empty', resolve(props.className))}
      style={resolve(props.style)}
    >
      <span class="ico ui-icon">
        {resolve(props.icon) != null ? resolve(props.icon) : <i data-lucide="table"></i>}
      </span>
      {resolve(props.description) != null && (
        <span class="ui-label">{resolve(props.description)}</span>
      )}
      {resolve(props.children)}
    </div>
  );
}
