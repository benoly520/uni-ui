import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

export interface PaginationProps {
  total: MaybeGetter<number>;
  pageSize?: MaybeGetter<number>;
  page?: MaybeGetter<number>;
  defaultPage?: MaybeGetter<number>;
  onChange?: (page: number) => void;
  siblingCount?: MaybeGetter<number>;
  'aria-label'?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

function range(start: number, end: number): number[] {
  const a: number[] = [];
  for (let i = start; i <= end; i++) a.push(i);
  return a;
}

function getPages(current: number, totalPages: number, sibling: number): (number | '...')[] {
  const totalNumbers = sibling * 2 + 5;
  if (totalPages <= totalNumbers) return range(1, totalPages);
  const left = Math.max(current - sibling, 1);
  const right = Math.min(current + sibling, totalPages);
  const showLeft = left > 2;
  const showRight = right < totalPages - 1;
  if (!showLeft && showRight) {
    const leftCount = 3 + 2 * sibling;
    return [...range(1, leftCount), '...', totalPages];
  }
  if (showLeft && !showRight) {
    const rightCount = 3 + 2 * sibling;
    return [1, '...', ...range(totalPages - rightCount + 1, totalPages)];
  }
  return [1, '...', ...range(left, right), '...', totalPages];
}

/**
 * Pagination · 分页（导航）
 * 受控/非受控；超出时显示省略号（1 … left..right … total）。
 */
export function Pagination(props: PaginationProps) {
  const {
    total,
    pageSize = 10,
    page,
    defaultPage = 1,
    onChange,
    siblingCount = 1,
    'aria-label': ariaLabel = '分页',
    className,
    style,
    ...rest
  } = props;
  const isControlled = page != null;
  const inner = signal<number>(Number(resolve(defaultPage)));
  const cur = () => (isControlled ? Number(resolve(page)) : inner());
  const totalPages = () =>
    Math.max(1, Math.ceil(Number(resolve(total)) / Number(resolve(pageSize))));
  const go = (p: number) => {
    const tp = totalPages();
    const next = Math.min(tp, Math.max(1, p));
    if (next === cur()) return;
    if (!isControlled) inner.set(next);
    onChange?.(next);
  };
  return (
    <nav
      {...rest}
      class={cx('ui-pagination', resolve(className))}
      role="navigation"
      aria-label={resolve(ariaLabel)}
      style={resolve(style)}
    >
      <button aria-label="上一页" data-prev={true} disabled={cur() <= 1} onClick={() => go(cur() - 1)}>
        ‹
      </button>
      {getPages(cur(), totalPages(), Number(resolve(siblingCount))).map((git) => {
        const it = git;
        if (String(it) === '...')
          return (
            <button class="ui-pagination--ellipsis" type="button" disabled={true} aria-label="更多页">
              …
            </button>
          );
        const p = Number(it);
        const ariaCurrent = () => (p === cur() ? 'page' : undefined);
        return (
          <button
            type="button"
            class={cx(p === cur() && 'is-active')}
            aria-current={ariaCurrent()}
            onClick={() => go(p)}
          >
            {'' + p}
          </button>
        );
      })}
      <button aria-label="下一页" data-next={true} disabled={cur() >= totalPages()} onClick={() => go(cur() + 1)}>
        ›
      </button>
    </nav>
  );
}
