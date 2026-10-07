<script setup lang="ts">
import { computed, ref } from 'vue';

type SwitchSize = 'lg' | 'md' | 'xs' | 'sm';

const props = withDefaults(
  defineProps<{
    /** 受控开/关 */
    checked?: boolean;
    /** 非受控初始值 */
    defaultChecked?: boolean;
    /** 尺寸 Scale（track 高=控件高，宽=1.7×高） */
    size?: SwitchSize;
    disabled?: boolean;
    /** 无障碍标签（纯图标 toggle 必须） */
    label?: string;
  }>(),
  {
    size: 'md',
    disabled: false,
    defaultChecked: false,
  },
);

const emit = defineEmits<{
  (e: 'change', checked: boolean): void;
}>();

const isControlled = computed(() => props.checked != null);
const inner = ref<boolean>(props.defaultChecked);
const on = computed(() => (isControlled.value ? (props.checked as boolean) : inner.value));

const cls = computed(() => [
  'ui-switch',
  props.size !== 'md' && `ui-size-${props.size}`,
]);

function toggle() {
  if (props.disabled) return;
  const next = !on.value;
  if (!isControlled.value) inner.value = next;
  emit('change', next);
}
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="on"
    :aria-label="label"
    :class="cls"
    :disabled="disabled"
    @click="toggle"
  />
</template>
