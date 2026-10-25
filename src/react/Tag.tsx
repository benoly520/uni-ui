import React, {
  forwardRef,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export type TagType = 'brand' | 'up' | 'down' | 'default';

export interface TagProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  /** 语义类型（default 无修饰类） */
  type?: TagType;
  /** 可关闭：渲染关闭按钮并发出 onClose */
  closable?: boolean;
  /** 自定义色（覆盖 type）：同时写 color + border-color */
  color?: string;
  /** 图标插槽（24×24 + currentColor），置于文本前 */
  icon?: ReactNode;
  /** 关闭按钮点击 */
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const CLOSE_STYLE: CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'currentColor',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  padding: 0,
  marginLeft: '2px',
  fontSize: 'inherit',
  lineHeight: 1,
};

/**
 * Tag · 标签（反馈组）
 * - type: brand/up/down/default；closable 渲染 ui-tag-close 按钮
 * - color 内联覆盖 type 着色（双向）；icon 包入 .ui-icon
 * - 不携带样式，全部走 theme.css（关闭钮内联 var(--ui-*)）
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { glass, type = 'default', closable = false, color, icon, onClose, className, style, children },
  ref,
) {
  const customStyle: CSSProperties | undefined = color
    ? { color, borderColor: color }
    : undefined;
  return (
    <span
      data-glass={glass === false ? 'off' : undefined}
      ref={ref}
      className={cx(
        'ui-tag',
        type !== 'default' && `ui-tag--${type}`,
        closable && 'ui-tag--closable',
        className,
      )}
      style={{ ...customStyle, ...style }}
    >
      {icon != null && <span className="ui-icon">{icon}</span>}
      {children}
      {closable && (
        <button type="button" className="ui-tag-close" aria-label="关闭" style={CLOSE_STYLE} onClick={onClose}>
          <span aria-hidden="true">×</span>
        </button>
      )}
    </span>
  );
});
