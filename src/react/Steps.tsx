import React, {
  forwardRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cx } from '../utils/cx';

export interface StepItem {
  /** 步骤标题 */
  title: ReactNode;
  /** 步骤描述（可选） */
  desc?: ReactNode;
}

export interface StepsProps {
  /** 流程步骤 */
  steps: StepItem[];
  /** 受控当前步索引（高亮 + 描边） */
  current?: number;
  /** 非受控初始当前 */
  defaultCurrent?: number;
  /** 点击重算链（默认 true） */
  clickable?: boolean;
  /** 点击步骤重算并回调新当前 */
  onChange?: (index: number) => void;
  className?: string;
  style?: CSSProperties;
}

const Check = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/**
 * Steps · 流程向导（回测流程）
 * - 已完成步实心品牌色 + check、当前步高亮、点击步骤重算 is-done 链并重建圆点
 * - 受控 current + onChange；不携带样式，全部走 theme.css
 */
export const Steps = forwardRef<HTMLDivElement, StepsProps>(function Steps(
  {
    steps,
    current,
    defaultCurrent = 0,
    clickable = true,
    onChange,
    className,
    style,
  },
  ref,
) {
  const isControlled = current != null;
  const [inner, setInner] = useState<number>(defaultCurrent);
  const cur = isControlled ? (current as number) : inner;

  const go = (i: number) => {
    if (!clickable) return;
    if (!isControlled) setInner(i);
    onChange?.(i);
  };

  const nodes: React.ReactNode[] = [];
  steps.forEach((s, i) => {
    const isDone = i < cur;
    const isCurrent = i === cur;
    nodes.push(
      <div
        key={`step-${i}`}
        className={cx(
          'ui-step',
          isDone && 'is-done',
          isCurrent && 'is-current',
          clickable && 'is-clickable',
        )}
        data-step={i}
        onClick={clickable ? () => go(i) : undefined}
      >
        <span className="ui-step-dot">{isDone ? <Check /> : i + 1}</span>
        <span className="ui-step-text">
          <span className="ui-step-title">{s.title}</span>
          {s.desc != null && <span className="ui-step-desc">{s.desc}</span>}
        </span>
      </div>,
    );
    if (i < steps.length - 1) {
      nodes.push(<span key={`line-${i}`} className="ui-step-line" />);
    }
  });

  return (
    <div className={cx('ui-steps', className)} style={style} ref={ref}>
      {nodes}
    </div>
  );
});
