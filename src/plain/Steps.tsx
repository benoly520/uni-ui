import { resolve, signal } from 'plain';
import { cx } from './_shared';
import { IconCheck } from './icons';
import type { MaybeGetter, Renderable } from './_shared';

export interface StepItem {
  title: Renderable | (() => Renderable);
  desc?: Renderable | (() => Renderable);
}

export interface StepsProps {
  steps: MaybeGetter<StepItem[]>;
  current?: MaybeGetter<number>;
  defaultCurrent?: MaybeGetter<number>;
  clickable?: MaybeGetter<boolean>;
  onChange?: (index: number) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

/**
 * Steps · 步骤条（导航）
 * 已完成步实心品牌色 + check，当前步高亮；可点击跳转（受 clickable 控制）。
 */
export function Steps(props: StepsProps) {
  const {
    steps,
    current,
    defaultCurrent = 0,
    clickable = true,
    onChange,
    className,
    style,
    ...rest
  } = props;
  const isControlled = current != null;
  const inner = signal<number>(Number(resolve(defaultCurrent)));
  const cur = () => (isControlled ? Number(resolve(current)) : inner());
  const arr = resolve(steps) || [];
  return (
    <div {...rest} class={cx('ui-steps', resolve(className))} style={resolve(style)}>
      {arr.map((git, i) => {
        const it = git;
        return (
          <div
            class={cx(
              'ui-step',
              i < cur() && 'is-done',
              i === cur() && 'is-current',
              resolve(clickable) && 'is-clickable',
            )}
            data-step={i}
            onClick={() => {
              if (!resolve(clickable)) return;
              if (!isControlled) inner.set(i);
              onChange?.(i);
            }}
          >
            <span class="ui-step-dot">{i < cur() ? <IconCheck /> : '' + (i + 1)}</span>
            <span class="ui-step-text">
              <span class="ui-step-title">{it.title}</span>
              {it.desc != null && <span class="ui-step-desc">{it.desc}</span>}
            </span>
            {i < arr.length - 1 && <span class="ui-step-line"></span>}
          </div>
        );
      })}
    </div>
  );
}
