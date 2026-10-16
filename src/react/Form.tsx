import React,
  {
    forwardRef,
    useCallback,
    useState,
    type CSSProperties,
    type FormEvent,
  } from 'react';
import { cx } from '../utils/cx';

export interface FormRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  message?: string;
}
export interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'email';
  placeholder?: string;
  defaultValue?: string;
  rules?: FormRule[];
}
export interface FormProps {
  fields: FormField[];
  /** 字段栅格布局，默认 true */
  grid?: boolean;
  submitText?: string;
  onSubmit?: (values: Record<string, string>) => void;
  /** id 命名空间前缀：同页多个 Form 必须传唯一值，否则同名字段会串 label */
  idPrefix?: string;
  className?: string;
  style?: CSSProperties;
}

function validateField(field: FormField, value: string): string {
  const v = (value ?? '').trim();
  for (const rule of field.rules ?? []) {
    if (rule.required && !v) return rule.message ?? '必填';
    if (rule.pattern && !rule.pattern.test(v))
      return rule.message ?? '格式不正确';
    if (rule.min != null && field.type === 'number' && !(Number(v) > rule.min))
      return rule.message ?? `需大于 ${rule.min}`;
  }
  return '';
}

/**
 * Form · 表单栅格 + 字段校验（数据表单组）
 * - label/control 布局、错误态 .ui-form-item--error（行）+ .ui-input--error（红边）
 * - 提交时逐字段校验，通过则 onSubmit(values)
 * - 还原预览 demoForm 校验语义（两侧一致）
 */
export const Form = forwardRef<HTMLFormElement, FormProps>(function Form(
  {
    fields,
    grid = true,
    submitText = '提交',
    onSubmit,
    idPrefix,
    className,
    style,
  },
  ref,
) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ''])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 字段 id/htmlFor 的命名空间：不传前缀时保持 id === name（与既有契约快照一致）
  const fid = (name: string) => (idPrefix ? `${idPrefix}-${name}` : name);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const nextErrors: Record<string, string> = {};
      for (const f of fields) {
        const msg = validateField(f, values[f.name] ?? '');
        if (msg) nextErrors[f.name] = msg;
      }
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length === 0) onSubmit?.(values);
    },
    [fields, values, onSubmit],
  );

  const rows = (
    <>
      {fields.map((f) => (
        <div
          key={f.name}
          className={cx('ui-form-row', errors[f.name] && 'ui-form-item--error')}
        >
          <label className="ui-label">
            {f.label}
            <input
              className={cx('ui-input', errors[f.name] && 'ui-input--error')}
              id={fid(f.name)}
              name={f.name}
              type={f.type ?? 'text'}
              placeholder={f.placeholder}
              value={values[f.name] ?? ''}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, [f.name]: e.target.value }))
              }
            />
          </label>
          <div className="ui-form-error" data-for={f.name}>
            {errors[f.name]}
          </div>
        </div>
      ))}
    </>
  );

  return (
    <form
      ref={ref}
      className={cx('ui-form', className)}
      style={style}
      noValidate
      onSubmit={handleSubmit}
    >
      {grid ? <div className="ui-form-grid">{rows}</div> : rows}
      <div className="row">
        <button type="submit" className="ui-btn ui-btn--primary">
          {submitText}
        </button>
      </div>
    </form>
  );
});
