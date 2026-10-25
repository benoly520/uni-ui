<script setup lang="ts">
import { computed, ref } from 'vue';

type SwitchSize = 'lg' | 'md' | 'xs' | 'sm';

const props = withDefaults(
  defineProps<{
    /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
    glass?: boolean;
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
    glass: true,
    size: 'md',
    disabled: false,
    defaultChecked: false,
    // 显式给 checked 一个 default，避免 Vue 的 Boolean prop 兜底把「未传」规范成 false
    // 从而误判为受控模式、让 defaultChecked 永久失效
    checked: undefined,
  },
);

const emit = defineEmits<{
  (e: 'change', checked: boolean): void;
}>();

const isControlled = computed(() => props.checked !== undefined);
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
    :data-glass="glass === false ? 'off' : undefined"
    type="button"
    role="switch"
    :aria-checked="on"
    :aria-label="label"
    :class="cls"
    :disabled="disabled"
    @click="toggle"
  />
</template>
