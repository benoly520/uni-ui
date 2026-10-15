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
  /**
   * 步骤与连接线的扁平序列：连接线是 .ui-step 的兄弟节点（与 React / Vue 端及设计稿一致）。
   * 用「序列 + map + 三元」而不是 Fragment：plain 编译器的列表项必须是单个顶层元素。
   * 注意：plain 的 map 回调首参会包成 rowProxy，**不能用 `item === 'line'` 这类原始值比较**，
   * 因此这里返回带 line/index 字段的对象，统一走属性读取。
   */
  interface StepSeqItem {
    line: boolean;
    index: number;
  }
  const seq = (): StepSeqItem[] => {
    const steps = stepsArr();
    const out: StepSeqItem[] = [];
    steps.forEach((_, i) => {
      out.push({ line: false, index: i });
      if (i < steps.length - 1) out.push({ line: true, index: i });
    });
    return out;
  };
  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-steps', resolve(props.className))}
      style={resolve(props.style)}
    >
      {seq().map((git) =>
        git.line ? (
          <span class="ui-step-line"></span>
        ) : (
          <div
            class={cx(
              'ui-step',
              git.index < cur() && 'is-done',
              git.index === cur() && 'is-current',
              clickable() && 'is-clickable',
            )}
            data-step={git.index}
            onClick={() => {
              if (!clickable()) return;
              if (!isControlled()) inner.set(git.index);
              props.onChange?.(git.index);
            }}
          >
            <span class="ui-step-dot">
              {git.index < cur() ? <IconCheck /> : '' + (git.index + 1)}
            </span>
            <span class="ui-step-text">
              <span class="ui-step-title">{stepsArr()[git.index].title}</span>
              {stepsArr()[git.index].desc != null && (
                <span class="ui-step-desc">{stepsArr()[git.index].desc}</span>
              )}
            </span>
          </div>
        ),
      )}
    </div>
  );
}
