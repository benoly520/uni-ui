import React, {
  forwardRef,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from '../utils/cx';

export interface PaginationProps {
  /** 总条目数 */
  total: number;
  /** 每页条目数 */
  pageSize?: number;
  /** 受控当前页（1-based） */
  page?: number;
  /** 非受控初始页 */
  defaultPage?: number;
  /** 翻页回调 */
  onChange?: (page: number) => void;
  /** 当前页两侧保留页码数 */
  siblingCount?: number;
  /** 无障碍标签 */
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

type PageItem = number | 'ellipsis';

function getPages(current: number, totalPages: number, sibling: number): PageItem[] {
  const totalNumbers = sibling * 2 + 5; // 1 … (sibling + current + sibling) … total
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const left = Math.max(2, current - sibling);
  const right = Math.min(totalPages - 1, current + sibling);
  const showLeft = left > 2;
  const showRight = right < totalPages - 1;
  const pages: PageItem[] = [1];
  if (showLeft) pages.push('ellipsis');
  for (let i = left; i <= right; i++) pages.push(i);
  if (showRight) pages.push('ellipsis');
  pages.push(totalPages);
  return pages;
}

/**
 * Pagination · 翻页（浮层导航组）
 * - 当前页 `is-active`+`aria-current`；上/下页 `data-prev/next`+`aria-label`；页码省略 `…`
 * - 受控/非受控双模式；不携带样式，全部走 theme.css
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    total,
    pageSize = 10,
    page,
    defaultPage = 1,
    onChange,
    siblingCount = 1,
    ariaLabel = '分页',
    className,
    style,
  },
  ref,
) {
  const isControlled = page != null;
  const [inner, setInner] = useState(defaultPage);
  const current = isControlled ? (page as number) : inner;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safeCurrent = Math.min(Math.max(1, current), totalPages);

  const go = (p: number) => {
    if (p < 1 || p > totalPages || p === safeCurrent) return;
    if (!isControlled) setInner(p);
    onChange?.(p);
  };

  const items = getPages(safeCurrent, totalPages, siblingCount);

  return (
    <nav
      ref={ref}
      className={cx('ui-pagination', className)}
      style={style}
      role="navigation"
      aria-label={ariaLabel}
    >
      <button
        aria-label="上一页"
        data-prev
        type="button"
        disabled={safeCurrent <= 1}
        onClick={() => go(safeCurrent - 1)}
      >
        ‹
      </button>
      {items.map((it, i) =>
        it === 'ellipsis' ? (
          <button
            key={`e-${i}`}
            className="ui-pagination--ellipsis"
            type="button"
            disabled
            aria-label="更多页"
          >
            …
          </button>
        ) : (
          <button
            key={it}
            type="button"
            className={cx(it === safeCurrent && 'is-active')}
            aria-current={it === safeCurrent ? 'page' : undefined}
            onClick={() => go(it)}
          >
            {it}
          </button>
        ),
      )}
      <button
        aria-label="下一页"
        data-next
        type="button"
        disabled={safeCurrent >= totalPages}
        onClick={() => go(safeCurrent + 1)}
      >
        ›
      </button>
    </nav>
  );
});
