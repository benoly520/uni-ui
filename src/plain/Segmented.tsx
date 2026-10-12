import { resolve, signal, effect } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter, Renderable } from './_shared';

export interface SegmentedOption {
  label: Renderable | (() => Renderable);
  value: string | number;
  disabled?: boolean;
}

export interface SegmentedProps {
  options: MaybeGetter<SegmentedOption[]>;
  value?: MaybeGetter<string | number>;
  defaultValue?: MaybeGetter<string | number>;
  onChange?: (value: string | number) => void;
  size?: MaybeGetter<'lg' | 'md' | 'sm' | 'xs'>;
  disabled?: MaybeGetter<boolean>;
  'aria-label'?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

let segSeq = 0;

/**
 * Segmented · 分段控件（输入）
 * 滑块跟随选中项平滑移动（基于按钮 offsetLeft/offsetWidth）；受控/非受控。
 */
export function Segmented(props: SegmentedProps) {
  const {
    options,
    value,
    defaultValue,
    onChange,
    size = 'md',
    disabled = false,
    'aria-label': ariaLabel,
    className,
    style,
    ...rest
  } = props;
  const uid = 'seg-' + ++segSeq;
  const isControlled = value != null;
  const inner = signal<string | number>(
    value != null
      ? (resolve(value) as any)
      : defaultValue != null
        ? (resolve(defaultValue) as any)
        : ((resolve(options) as SegmentedOption[])[0]?.value as any),
  );
  const selected = () => (isControlled ? (resolve(value) as any) : inner());
  const opts = (resolve(options) as SegmentedOption[]) || [];
  const disabledAttr = () => resolve(disabled) || undefined;

  const moveThumb = () => {
    requestAnimationFrame(() => {
      const root = document.getElementById(uid);
      if (!root) return;
      const idx = opts.findIndex((o) => o.value === selected());
      const b = root.querySelector('[data-seg="' + idx + '"]') as HTMLElement | null;
      const thumb = root.querySelector('.thumb') as HTMLElement | null;
      if (b && thumb) {
        thumb.style.left = b.offsetLeft + 'px';
        thumb.style.width = b.offsetWidth + 'px';
      }
    });
  };

  const select = (o: SegmentedOption) => {
    if (resolve(disabled) || o.disabled) return;
    if (!isControlled) inner.set(o.value);
    onChange?.(o.value);
    moveThumb();
  };

  effect(moveThumb);
  window.addEventListener('resize', moveThumb);

  return (
    <div
      {...rest}
      id={uid}
      class={cx('ui-segmented', resolve(size) !== 'md' && 'ui-size-' + resolve(size), resolve(className))}
      aria-label={resolve(ariaLabel)}
      aria-disabled={disabledAttr()}
      style={resolve(style)}
    >
      <span class="thumb"></span>
      {opts.map((git, idx) => {
        // 列表项在 plain 中是行代理（rowProxy），不能用 indexOf 反查下标，直接用 map 的索引
        const o = git;
        return (
          <button
            type="button"
            data-seg={idx}
            aria-pressed={selected() === o.value}
            disabled={resolve(disabled) || !!o.disabled}
            onClick={() => select(o)}
          >
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
