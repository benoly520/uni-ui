import { resolve } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface BreadcrumbItem {
  label: Renderable | (() => Renderable);
  href?: string;
}

export interface BreadcrumbProps {
  items: MaybeGetter<BreadcrumbItem[]>;
  separator?: MaybeGetter<string>;
  'aria-label'?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

/**
 * Breadcrumb · 面包屑（导航）
 * 末项标记为当前页（span.current + aria-current）；其余为链接 + 分隔符。
 */
export function Breadcrumb(props: BreadcrumbProps) {
  const {
    items,
    separator = '/',
    'aria-label': ariaLabel = '路径导航',
    className,
    style,
    ...rest
  } = props;
  const arr = resolve(items) || [];
  return (
    <nav
      {...rest}
      class={cx('ui-breadcrumb', resolve(className))}
      aria-label={resolve(ariaLabel)}
      style={resolve(style)}
    >
      {arr.map((git, i) => {
        const it = git;
        const last = i === arr.length - 1;
        return last ? (
          <span class="current" aria-current="page">
            {it.label}
          </span>
        ) : (
          <>
            {it.href ? <a href={it.href}>{it.label}</a> : <span>{it.label}</span>}
            <span class="sep">{resolve(separator)}</span>
          </>
        );
      })}
    </nav>
  );
}
