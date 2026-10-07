import React, { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../utils/cx';

export interface BreadcrumbItem {
  /** 节点文案 */
  label: ReactNode;
  /** 链接地址（末项忽略，始终为当前页不链接） */
  href?: string;
}

export interface BreadcrumbProps {
  /** 路径节点 */
  items: BreadcrumbItem[];
  /** 分隔符 */
  separator?: ReactNode;
  /** 根 nav aria-label */
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Breadcrumb · 路径导航（研究路径）
 * - 末项 aria-current=page 不链接、不 hover 高亮；链接 hover 跟随品牌色
 * - 纯展示，items 驱动；不携带样式，全部走 theme.css
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(
  function Breadcrumb(
    { items, separator = '/', 'aria-label': ariaLabel = '路径导航', className, style },
    ref,
  ) {
    const nodes: React.ReactNode[] = [];
    items.forEach((it, i) => {
      const isLast = i === items.length - 1;
      if (isLast) {
        nodes.push(
          <span key={`c-${i}`} className="current" aria-current="page">
            {it.label}
          </span>,
        );
      } else {
        nodes.push(
          <a key={`a-${i}`} href={it.href}>
            {it.label}
          </a>,
        );
        nodes.push(
          <span key={`s-${i}`} className="sep">
            {separator}
          </span>,
        );
      }
    });

    return (
      <nav className={cx('ui-breadcrumb', className)} style={style} aria-label={ariaLabel} ref={ref as React.Ref<HTMLElement>}>
        {nodes}
      </nav>
    );
  },
);
