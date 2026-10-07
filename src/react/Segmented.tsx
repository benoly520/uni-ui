import React, {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export interface SegmentedOption {
  /** 选项显示文案（文本或节点） */
  label: ReactNode;
  /** 选项值（受控/非受控标识） */
  value: string | number;
  /** 单选项禁用 */
  disabled?: boolean;
}

export type SegmentedSize = 'lg' | 'md' | 'xs' | 'sm';

export interface SegmentedProps {
  /** 选项列表 */
  options: SegmentedOption[];
  /** 受控选中值 */
  value?: string | number;
  /** 非受控初始值（缺省取首项 value） */
  defaultValue?: string | number;
  /** 选中变更回调 */
  onChange?: (value: string | number) => void;
  /** 尺寸 Scale（全局修饰，md 默认无类） */
  size?: SegmentedSize;
  /** 整组禁用 */
  disabled?: boolean;
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Segmented · 苹果分段控件（基础输入组）
 * - 选中滑块 .thumb 位置由选中按钮 offsetLeft/offsetWidth 计算（挂载/变更/resize 重算）
 * - 受控 value + onChange；非受控 defaultValue；选项 aria-pressed 为选中真理源
 * - 不携带样式，全部走 theme.css
 */
export const Segmented = forwardRef<HTMLDivElement, SegmentedProps>(function Segmented(
  {
    options,
    value,
    defaultValue,
    onChange,
    size = 'md',
    disabled = false,
    'aria-label': ariaLabel,
    className,
    style,
  },
  ref,
) {
  const isControlled = value != null;
  const [inner, setInner] = useState<string | number>(
    () => defaultValue ?? options[0]?.value,
  );
  const selected = isControlled ? (value as string | number) : inner;

  const rootRef = useRef<HTMLDivElement | null>(null);
  const [thumb, setThumb] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });

  const updateThumb = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const btns = Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
    const idx = options.findIndex((o) => o.value === selected);
    const btn = btns[idx];
    if (btn) setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
  }, [options, selected]);

  useLayoutEffect(() => {
    updateThumb();
    const onResize = () => updateThumb();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateThumb]);

  const select = (o: SegmentedOption) => {
    if (disabled || o.disabled) return;
    if (!isControlled) setInner(o.value);
    onChange?.(o.value);
  };

  return (
    <div
      ref={(node) => {
        rootRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={cx('ui-segmented', size !== 'md' && `ui-size-${size}`, className)}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      style={style}
    >
      <span
        className="thumb"
        style={{ left: `${thumb.left}px`, width: `${thumb.width}px` }}
      />
      {options.map((o) => (
        <button
          key={String(o.value)}
          type="button"
          aria-pressed={o.value === selected}
          disabled={disabled || o.disabled}
          onClick={() => select(o)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
});
