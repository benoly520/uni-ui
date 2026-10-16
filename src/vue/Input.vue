<script setup lang="ts">
import { computed } from 'vue';

type InputSize = 'lg' | 'md' | 'xs' | 'sm';

const props = withDefaults(
  defineProps<{
    /** 受控值 */
    value?: string;
    /** 非受控初始值 */
    defaultValue?: string;
    /** 尺寸 Scale（全局修饰，md 默认无类） */
    size?: InputSize;
    /** 禁用 */
    disabled?: boolean;
    /** 错误态：danger 描边 + 软光晕 + aria-invalid */
    error?: boolean;
    placeholder?: string;
    type?: string;
    name?: string;
    id?: string;
    maxLength?: number;
    /** 前导图标/装饰（包入 .ui-icon，装饰性 sibling） */
    prefix?: unknown;
    /** 后导图标/装饰（包入 .ui-icon，装饰性 sibling） */
    suffix?: unknown;
    ariaLabel?: string;
  }>(),
  {
    size: 'md',
    disabled: false,
    error: false,
    type: 'text',
  },
);

const emit = defineEmits<{
  (e: 'change', value: string, ev: Event): void;
}>();

const isControlled = computed(() => props.value != null);

// 受控时绑定 value；非受控时绑定原生 DOM property defaultValue。
// 不能写连字符名 'default-value'：HTML 无该 attribute，Vue 会走 setAttribute 写成无效属性，
// 而非受控初值必须落到 input.defaultValue 上才生效。
const inputBind = computed(() => {
  if (isControlled.value) return { value: props.value };
  if (props.defaultValue == null) return {};
  return { defaultValue: props.defaultValue };
});

const cls = computed(() => [
  'ui-input',
  props.size !== 'md' && `ui-size-${props.size}`,
  props.error && 'ui-input--error',
]);

function onInput(ev: Event) {
  const target = ev.target as HTMLInputElement;
  emit('change', target.value, ev);
}
</script>

<template>
  <span v-if="prefix || suffix" class="ui-input-wrap">
    <span v-if="prefix != null" class="ui-icon" aria-hidden="true"><component :is="prefix" /></span>
    <input
      v-bind="inputBind"
      :class="cls"
      :type="type"
      :placeholder="placeholder"
      :name="name"
      :id="id"
      :maxlength="maxLength"
      :disabled="disabled"
      :aria-invalid="error || undefined"
      :aria-label="ariaLabel"
      @input="onInput"
    />
    <span v-if="suffix != null" class="ui-icon" aria-hidden="true"><component :is="suffix" /></span>
  </span>
  <input
    v-else
    v-bind="inputBind"
    :class="cls"
    :type="type"
    :placeholder="placeholder"
    :name="name"
    :id="id"
    :maxlength="maxLength"
    :disabled="disabled"
    :aria-invalid="error || undefined"
    :aria-label="ariaLabel"
    @input="onInput"
  />
</template>
