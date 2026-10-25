import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface BreadcrumbItem {
  label: Renderable | (() => Renderable);
  href?: string;
}

export interface BreadcrumbProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: MaybeGetter<boolean>;
  items: MaybeGetter<BreadcrumbItem[]>;
  separator?: MaybeGetter<string>;
  'aria-label'?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

/**
 * Breadcrumb · 面包屑（导航）
 * 末项标记为当前页（span.current + aria-current）；其余为链接 + 分隔符。
 */
export function Breadcrumb(props: BreadcrumbProps) {
  const separator = () => resolve(props.separator) ?? '/';
  const ariaLabel = () => resolve(props['aria-label']) ?? '路径导航';
  const itemsArr = () => resolve(props.items) || [];
  return (
    <nav
      data-glass={resolve(props.glass) === false ? 'off' : undefined}
      id={resolve(props.id)}
      class={cx('ui-breadcrumb', resolve(props.className))}
      aria-label={ariaLabel()}
      style={resolve(props.style)}
    >
      {itemsArr().map((git, i) => {
        const it = git;
        const last = i === itemsArr().length - 1;
        return last ? (
          <span class="current" aria-current="page">
            {it.label}
          </span>
        ) : (
          <>
            {it.href ? <a href={it.href}>{it.label}</a> : <span>{it.label}</span>}
            <span class="sep">{separator()}</span>
          </>
        );
      })}
    </nav>
  );
}
