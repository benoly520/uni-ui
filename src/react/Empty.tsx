import React, { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../utils/cx';
import { IconTable } from './icons';

export interface EmptyProps {
  /** 空状态描述文案 */
  description?: ReactNode;
  /** 图标插槽（24×24 + currentColor）；默认内置 table 图标，可覆盖 */
  icon?: ReactNode;
  /** 操作插槽（按钮等），置于描述下 */
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Empty · 空状态（反馈组）
 * - 根 ui-empty；固定结构：.ico.ui-icon（默认内置 table 图标）+ .ui-label（描述）+ 操作插槽
 * - 不携带样式，全部走 theme.css
 */
export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  { description, icon, children, className, style },
  ref,
) {
  return (
    <div ref={ref} className={cx('ui-empty', className)} style={style}>
      <span className="ico ui-icon">{icon ?? <IconTable />}</span>
      {description != null && <span className="ui-label">{description}</span>}
      {children}
    </div>
  );
});
