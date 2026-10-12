import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export type TagType = 'brand' | 'up' | 'down' | 'default';

export interface TagProps {
  type?: MaybeGetter<TagType>;
  closable?: MaybeGetter<boolean>;
  color?: MaybeGetter<string>;
  icon?: Renderable | (() => Renderable);
  onClose?: () => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  children?: Renderable | (() => Renderable);
  [key: string]: any;
}

/** 合并 color 覆盖 + 透传 style */
function tagStyle(color: any, style: any): any {
  if (color) return { color, borderColor: color, ...(style || {}) };
  return style;
}

/**
 * Tag · 标签（基础）
 * 语义类型 brand/up/down/default；closable 渲染关闭按钮；color 覆盖 type 配色。
 */
export function Tag(props: TagProps) {
  const {
    type = 'default',
    closable = false,
    color,
    icon,
    onClose,
    className,
    style,
    children,
    ...rest
  } = props;
  return (
    <span
      {...rest}
      class={cx(
        'ui-tag',
        resolve(type) !== 'default' && 'ui-tag--' + resolve(type),
        resolve(closable) && 'ui-tag--closable',
        resolve(className),
      )}
      style={tagStyle(resolve(color), resolve(style))}
    >
      {resolve(icon) != null && <span class="ui-icon">{resolve(icon)}</span>}
      {resolve(children)}
      {resolve(closable) && (
        <button type="button" class="ui-tag-close" aria-label="关闭" onClick={() => onClose?.()}>
          ×
        </button>
      )}
    </span>
  );
}
