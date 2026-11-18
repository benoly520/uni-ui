import { cx } from './_shared';
import type { Renderable } from './_shared';

export interface BreadcrumbItem {
  label: Renderable;
  href?: string;
}

export interface BreadcrumbProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  items: BreadcrumbItem[];
  separator?: string;
  'aria-label'?: string;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
}

/**
 * Breadcrumb · 面包屑（导航）
 * 末项标记为当前页（span.current + aria-current）；其余为链接 + 分隔符。
 */
export function Breadcrumb(props: BreadcrumbProps) {
  const separator = () => props.separator ?? '/';
  const ariaLabel = () => props['aria-label'] ?? '路径导航';
  const itemsArr = () => props.items || [];
  return (
    <nav
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-breadcrumb', props.className)}
      aria-label={ariaLabel()}
      style={props.style}
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
