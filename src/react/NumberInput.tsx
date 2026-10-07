import React, {
  forwardRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { cx } from '../utils/cx';

export interface NumberInputProps {
  /** 下限钳制 */
  min?: number;
  /** 上限钳制 */
  max?: number;
  /** 步进增量 */
  step?: number;
  /** 小数位（千分位 + 定点） */
  precision?: number;
  /** 前置符号（如 ¥），渲染在步进前 */
  prefix?: string;
  /** 后置符号（如 %），渲染在步进后 */
  suffix?: string;
  /** 受控值；null 视为 0 */
  value?: number | null;
  /** 非受控初始值 */
  defaultValue?: number;
  /** 步进 / 失焦 / 回车提交钳制后的值 */
  onChange?: (value: number) => void;
  /** 录入框 aria-label */
  'aria-label'?: string;
  className?: string;
  style?: CSSProperties;
}

const toNum = (v: number | null | undefined, d: number) => (v == null ? d : v);

/**
 * NumberInput · 格式化数值录入（金融增强）
 * - 千分位 + 定点格式化、步进钳制、¥/% 插槽
 * - 录入中保留草稿不重排，blur/change 才格式化；受控 value + onChange
 * - 不携带样式，全部走 theme.css
 */
export const NumberInput = forwardRef<HTMLDivElement, NumberInputProps>(
  function NumberInput(
    {
      min = -Infinity,
      max = Infinity,
      step = 1,
      precision = 0,
      prefix,
      suffix,
      value,
      defaultValue = 0,
      onChange,
      'aria-label': ariaLabel,
      className,
      style,
    },
    ref,
  ) {
    const isControlled = value != null;
    const [inner, setInner] = useState<number>(defaultValue);
    const [draft, setDraft] = useState<string | null>(null);
    const v = toNum(isControlled ? (value as number) : inner, 0);

    const clamp = (n: number) => Math.min(max, Math.max(min, n));
    const group = (n: number) =>
      n.toLocaleString('en-US', {
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });
    const show = (n: number) =>
      `${prefix ? prefix : ''}${group(n)}${suffix ? suffix : ''}`;

    const parse = (raw: string) => {
      const re = new RegExp(
        `${prefix ? prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*' : ''}`,
      );
      const s = raw
        .replace(re, '')
        .replace(new RegExp(`\\s*${suffix ? suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : ''}`), '')
        .replace(/[, ]/g, '');
      const n = parseFloat(s);
      return isNaN(n) ? 0 : n;
    };

    const commit = (n: number) => {
      const c = clamp(n);
      if (!isControlled) setInner(c);
      onChange?.(c);
    };

    const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDraft(e.target.value);
    };
    const onBlur = () => {
      const n = clamp(parse(draft ?? show(v)));
      setDraft(null);
      commit(n);
    };
    const onKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
    };
    const stepBy = (dir: 1 | -1) => {
      setDraft(null);
      commit(clamp(v + dir * step));
    };

    const display = draft ?? show(v);

    return (
      <div
        ref={ref}
        className={cx('ui-number', className)}
        style={style}
        data-min={min !== -Infinity ? min : undefined}
        data-max={max !== Infinity ? max : undefined}
        data-step={step}
        data-precision={precision}
        data-prefix={prefix}
        data-suffix={suffix}
      >
        {prefix != null && <span className="ui-number-prefix">{prefix}</span>}
        <button
          type="button"
          className="ui-number-step"
          data-step="down"
          aria-label="减少"
          onClick={() => stepBy(-1)}
        >
          −
        </button>
        <input
          className="ui-number-input"
          inputMode="decimal"
          aria-label={ariaLabel}
          value={display}
          onChange={onInput}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
        <button
          type="button"
          className="ui-number-step"
          data-step="up"
          aria-label="增加"
          onClick={() => stepBy(1)}
        >
          +
        </button>
        {suffix != null && <span className="ui-number-suffix">{suffix}</span>}
      </div>
    );
  },
);
