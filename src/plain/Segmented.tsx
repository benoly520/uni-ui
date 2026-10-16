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
  id?: MaybeGetter<string>;
}

/**
 * Segmented · 分段控件（输入）
 * 滑块跟随选中项平滑移动（基于按钮 offsetLeft/offsetWidth）；受控/非受控。
 * 改用 ref 抓取根节点定位滑块，resize 监听在 ref 清理里回收，消除旧实现的监听器泄漏。
 */
export function Segmented(props: SegmentedProps) {
  const isControlled = () => resolve(props.value) != null;
  const size = () => resolve(props.size) ?? 'md';
  const disabled = () => resolve(props.disabled) ?? false;
  const ariaLabel = () => resolve(props['aria-label']);
  const opts = () => resolve(props.options) || [];
  const inner = signal<string | number>(
    isControlled()
      ? (resolve(props.value) as any)
      : resolve(props.defaultValue) != null
        ? (resolve(props.defaultValue) as any)
        : (opts()[0]?.value as any),
  );
  const selected = () => (isControlled() ? (resolve(props.value) as any) : inner());

  let rootEl: HTMLElement | null = null;
  const moveThumb = () => {
    // 依赖必须在同步执行期读取：effect 只在同步阶段收集依赖，
    // 若放进 rAF（activeEffect 已还原）或放在早退之后，选中项变化将不触发重跑。
    const idx = opts().findIndex((o) => o.value === selected());
    const el = rootEl;
    if (!el) return;
    requestAnimationFrame(() => {
      // 不用自定义 data-* 标记（会与 React / Vue 端 DOM 不一致）：thumb 是第 0 个子节点
      const b = (el.children[idx + 1] as HTMLElement | undefined) ?? null;
      const thumb = el.querySelector('.thumb') as HTMLElement | null;
      if (b && thumb) {
        thumb.style.left = b.offsetLeft + 'px';
        thumb.style.width = b.offsetWidth + 'px';
      }
    });
  };
  // 选中项变化 / 挂载后移动滑块（effect 随 selected()/opts() 自动重跑并回收）
  effect(moveThumb);

  const select = (o: SegmentedOption) => {
    if (disabled() || o.disabled) return;
    if (!isControlled()) inner.set(o.value);
    props.onChange?.(o.value);
  };

  return (
    <div
      id={resolve(props.id)}
      ref={(el) => {
        rootEl = el;
        moveThumb();
        const onResize = () => moveThumb();
        window.addEventListener('resize', onResize);
        return () => {
          window.removeEventListener('resize', onResize);
          rootEl = null;
        };
      }}
      class={cx('ui-segmented', size() !== 'md' && 'ui-size-' + size(), resolve(props.className))}
      aria-label={ariaLabel()}
      aria-disabled={disabled() || undefined}
      style={resolve(props.style)}
    >
      <span class="thumb"></span>
      {opts().map((git, idx) => {
        const o = git;
        return (
          <button
            type="button"
            aria-pressed={selected() === o.value ? 'true' : 'false'}
            disabled={disabled() || !!o.disabled}
            onClick={() => select(o)}
          >
            {resolve(o.label)}
          </button>
        );
      })}
    </div>
  );
}
