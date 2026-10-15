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
  id?: MaybeGetter<string>;
}

/**
 * Steps · 步骤条（导航）
 * 已完成步实心品牌色 + check，当前步高亮；可点击跳转（受 clickable 控制）。
 */
export function Steps(props: StepsProps) {
  const isControlled = () => resolve(props.current) != null;
  const clickable = () => resolve(props.clickable) ?? true;
  const inner = signal<number>(Number(resolve(props.defaultCurrent) ?? 0));
  const cur = () => (isControlled() ? Number(resolve(props.current)) : inner());
  const stepsArr = () => resolve(props.steps) || [];
  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-steps', resolve(props.className))}
      style={resolve(props.style)}
    >
      {stepsArr().map((git, i) => {
        const it = git;
        return (
          <div
            class={cx(
              'ui-step',
              i < cur() && 'is-done',
              i === cur() && 'is-current',
              clickable() && 'is-clickable',
            )}
            data-step={i}
            onClick={() => {
              if (!clickable()) return;
              if (!isControlled()) inner.set(i);
              props.onChange?.(i);
            }}
          >
            <span class="ui-step-dot">
              {i < cur() ? <IconCheck /> : '' + (i + 1)}
            </span>
            <span class="ui-step-text">
              <span class="ui-step-title">{it.title}</span>
              {it.desc != null && <span class="ui-step-desc">{it.desc}</span>}
            </span>
            {i < stepsArr().length - 1 && <span class="ui-step-line"></span>}
          </div>
        );
      })}
    </div>
  );
}
