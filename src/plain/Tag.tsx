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
  id?: MaybeGetter<string>;
  children?: Renderable | (() => Renderable);
}

/** 合并 color 覆盖 + 透传 style（作为 JSX 属性表达式，编译器自动按依赖重跑） */
function tagStyle(color: any, style: any): any {
  if (color) return { color, borderColor: color, ...(style || {}) };
  return style;
}

/**
 * Tag · 标签（基础）
 * 语义类型 brand/up/down/default；closable 渲染关闭按钮；color 覆盖 type 配色。
 */
export function Tag(props: TagProps) {
  const type = () => resolve(props.type) ?? 'default';
  const closable = () => resolve(props.closable) ?? false;
  return (
    <span
      id={resolve(props.id)}
      class={cx(
        'ui-tag',
        type() !== 'default' && 'ui-tag--' + type(),
        closable() && 'ui-tag--closable',
        resolve(props.className),
      )}
      style={tagStyle(resolve(props.color), resolve(props.style))}
    >
      {resolve(props.icon) != null && <span class="ui-icon">{resolve(props.icon)}</span>}
      {resolve(props.children)}
      {closable() && (
        <button
          type="button"
          class="ui-tag-close"
          aria-label="关闭"
          onClick={() => props.onClose?.()}
        >
          ×
        </button>
      )}
    </span>
  );
}
