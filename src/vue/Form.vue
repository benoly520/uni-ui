<script setup lang="ts">
import { reactive, ref } from 'vue';

interface FormRule {
  required?: boolean;
  pattern?: RegExp;
  min?: number;
  message?: string;
}
interface FormField {
  name: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'email';
  placeholder?: string;
  defaultValue?: string;
  rules?: FormRule[];
}
interface FormProps {
  fields: FormField[];
  grid?: boolean;
  submitText?: string;
  /** id 命名空间前缀：同页多个 Form 必须传唯一值，否则同名字段会串 label */
  idPrefix?: string;
}

const props = withDefaults(defineProps<FormProps>(), {
  grid: true,
  submitText: '提交',
});
const emit = defineEmits<{
  (e: 'submit', values: Record<string, string>): void;
}>();

const values = reactive<Record<string, string>>(
  Object.fromEntries(props.fields.map((f) => [f.name, f.defaultValue ?? ''])),
);
const errors = ref<Record<string, string>>({});

// 字段 id/for 的命名空间：不传前缀时保持 id === name（与既有契约快照一致）
const fid = (name: string) => (props.idPrefix ? `${props.idPrefix}-${name}` : name);

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

function handleSubmit() {
  const nextErrors: Record<string, string> = {};
  for (const f of props.fields) {
    const msg = validateField(f, values[f.name] ?? '');
    if (msg) nextErrors[f.name] = msg;
  }
  errors.value = nextErrors;
  if (Object.keys(nextErrors).length === 0) emit('submit', { ...values });
}
</script>

<template>
  <form class="ui-form" novalidate @submit.prevent="handleSubmit">
    <div v-if="grid" class="ui-form-grid">
      <div
        v-for="f in fields"
        :key="f.name"
        class="ui-form-row"
        :class="errors[f.name] && 'ui-form-item--error'"
      >
        <label class="ui-label" :for="fid(f.name)">{{ f.label }}</label>
        <input
          class="ui-input"
          :class="errors[f.name] && 'ui-input--error'"
          :id="fid(f.name)"
          :name="f.name"
          :type="f.type ?? 'text'"
          :placeholder="f.placeholder"
          v-model="values[f.name]"
        />
        <div class="ui-form-error" :data-for="f.name">{{ errors[f.name] }}</div>
      </div>
    </div>
    <template v-else>
      <div
        v-for="f in fields"
        :key="f.name"
        class="ui-form-row"
        :class="errors[f.name] && 'ui-form-item--error'"
      >
        <label class="ui-label" :for="fid(f.name)">{{ f.label }}</label>
        <input
          class="ui-input"
          :class="errors[f.name] && 'ui-input--error'"
          :id="fid(f.name)"
          :name="f.name"
          :type="f.type ?? 'text'"
          :placeholder="f.placeholder"
          v-model="values[f.name]"
        />
        <div class="ui-form-error" :data-for="f.name">{{ errors[f.name] }}</div>
      </div>
    </template>
    <div class="row">
      <button type="submit" class="ui-btn ui-btn--primary">{{ submitText }}</button>
    </div>
  </form>
</template>
