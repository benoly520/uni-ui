import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface EmptyProps {
  description?: Renderable | (() => Renderable);
  icon?: Renderable | (() => Renderable);
  children?: Renderable | (() => Renderable);
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

/**
 * Empty · 空态（展示）
 * 默认图标用 <i data-lucide="table">；可传 description / icon / 操作区 children。
 */
export function Empty(props: EmptyProps) {
  const { description, icon, children, className, style, ...rest } = props;
  return (
    <div {...rest} class={cx('ui-empty', resolve(className))} style={resolve(style)}>
      <span class="ico ui-icon">
        {resolve(icon) != null ? resolve(icon) : <i data-lucide="table"></i>}
      </span>
      {resolve(description) != null && <span class="ui-label">{resolve(description)}</span>}
      {resolve(children)}
    </div>
  );
}
