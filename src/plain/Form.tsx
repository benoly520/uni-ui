import { resolve, signal } from 'plain';
import { cx } from './_shared';
import type { MaybeGetter } from './_shared';

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
  fields: MaybeGetter<FormField[]>;
  /** 字段栅格布局，默认 true */
  grid?: MaybeGetter<boolean>;
  submitText?: MaybeGetter<string>;
  onSubmit?: (values: Record<string, string>) => void;
  /** id 命名空间前缀：同页多个 Form 必须传唯一值，否则同名字段会串 label */
  idPrefix?: MaybeGetter<string>;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  id?: MaybeGetter<string>;
}

function validateField(field: FormField, value: string): string {
  const v = (value ?? '').trim();
  for (const rule of field.rules ?? []) {
    if (rule.required && !v) return rule.message ?? '必填';
    if (rule.pattern && !rule.pattern.test(v)) return rule.message ?? '格式不正确';
    if (rule.min != null && field.type === 'number' && !(Number(v) > rule.min))
      return rule.message ?? `需大于 ${rule.min}`;
  }
  return '';
}

/**
 * Form · 表单栅格 + 字段校验（数据表单组）
 * label/control 布局、错误态；提交时逐字段校验，通过则 onSubmit(values)。
 */
export function Form(props: FormProps) {
  const fieldsArr = () => resolve(props.fields) || [];
  const grid = () => resolve(props.grid) ?? true;
  const submitText = () => resolve(props.submitText) ?? '提交';

  const initValues = () =>
    Object.fromEntries(fieldsArr().map((f) => [f.name, f.defaultValue ?? '']));
  const values = signal<Record<string, string>>(initValues());
  const errors = signal<Record<string, string>>({});

  // 字段 id/htmlFor 的命名空间：不传前缀时保持 id === name（与既有契约快照一致）
  const fid = (name: string) => {
    const p = resolve(props.idPrefix);
    return p ? p + '-' + name : name;
  };

  const setVal = (name: string, e: Event) => {
    const v = (e.target as HTMLInputElement).value;
    values.set({ ...values(), [name]: v });
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    for (const f of fieldsArr()) {
      const msg = validateField(f, values()[f.name] ?? '');
      if (msg) nextErrors[f.name] = msg;
    }
    errors.set(nextErrors);
    if (Object.keys(nextErrors).length === 0) props.onSubmit?.(values());
  };

  const rowMap = () =>
    fieldsArr().map((f) => {
      const err = () => errors()[f.name];
      return (
        <div class={cx('ui-form-row', err() && 'ui-form-item--error')}>
          <label class="ui-label" htmlFor={fid(f.name)}>
            {f.label}
          </label>
          <input
            class={cx('ui-input', err() && 'ui-input--error')}
            id={fid(f.name)}
            name={f.name}
            type={f.type ?? 'text'}
            placeholder={f.placeholder}
            value={values()[f.name] ?? ''}
            onChange={(e: Event) => setVal(f.name, e)}
          />
          <div class="ui-form-error" data-for={f.name}>
            {err() ?? ''}
          </div>
        </div>
      );
    });

  return (
    <form
      id={resolve(props.id)}
      class={cx('ui-form', resolve(props.className))}
      style={resolve(props.style)}
      noValidate
      onSubmit={handleSubmit}
    >
      {grid() ? <div class="ui-form-grid">{rowMap()}</div> : rowMap()}
      <div class="row">
        <button type="submit" class="ui-btn ui-btn--primary">
          {submitText()}
        </button>
      </div>
    </form>
  );
}
