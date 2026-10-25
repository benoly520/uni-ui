<script setup lang="ts">
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'default' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'lg' | 'md' | 'xs' | 'sm';

const props = withDefaults(
  defineProps<{
    /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
    glass?: boolean;
    /** 语义变体（颜色语义） */
    variant?: ButtonVariant;
    /** 尺寸 Scale（全局修饰，md 默认无类） */
    size?: ButtonSize;
    /** 胶囊形状，与语义正交，可叠加任意变体 */
    pill?: boolean;
    /** 文字透明 + spinner，pointer-events:none，aria-busy */
    loading?: boolean;
    /** 表单语义：button / submit / reset */
    type?: 'button' | 'submit' | 'reset';
    /** 原生禁用 */
    disabled?: boolean;
    /** 图标插槽：任意 24×24 + currentColor 节点，置于文本前 */
    icon?: unknown;
  }>(),
  {
    glass: true,
    variant: 'default',
    size: 'md',
    pill: false,
    loading: false,
    type: 'button',
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void;
}>();

const isDisabled = computed(() => props.disabled || props.loading);

const cls = computed(() => [
  'ui-btn',
  `ui-btn--${props.variant}`,
  props.size !== 'md' && `ui-size-${props.size}`,
  props.pill && 'ui-btn--pill',
  props.loading && 'ui-btn--loading',
]);

function onClick(ev: MouseEvent) {
  if (isDisabled.value) return;
  emit('click', ev);
}
</script>

<template>
  <button
    :data-glass="glass === false ? 'off' : undefined"
    :class="cls"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <span v-if="icon != null" class="ui-icon"><component :is="icon" /></span>
    <slot />
  </button>
</template>
