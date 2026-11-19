<script setup lang="ts">
import { computed } from 'vue';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'large' | 'medium' | 'small';

const props = withDefaults(
  defineProps<{
    /** 语义变体，默认 primary */
    variant?: ButtonVariant;
    /** 尺寸，默认 medium */
    size?: ButtonSize;
    /** 通栏（占满父容器宽度） */
    block?: boolean;
    /** 胶囊形状 */
    round?: boolean;
    /** 加载态：展示 spinner、禁用点击并设置 aria-busy */
    loading?: boolean;
    /** 表单语义：button / submit / reset */
    type?: 'button' | 'submit' | 'reset';
    /** 图标节点（任意 1em 尺寸、currentColor 的 SVG），置于文本前 */
    icon?: unknown;
    /** 原生禁用 */
    disabled?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    block: false,
    round: false,
    loading: false,
    type: 'button',
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void;
}>();

const isDisabled = computed(() => props.disabled || props.loading);

const cls = computed(() => [
  'h5-btn',
  `h5-btn--${props.variant}`,
  props.size !== 'medium' && `h5-btn--${props.size}`,
  props.block && 'h5-btn--block',
  props.round && 'h5-btn--round',
  props.loading && 'h5-btn--loading',
]);

/** 禁用 / 加载时不向外派发 click */
function onClick(event: MouseEvent) {
  if (isDisabled.value) return;
  emit('click', event);
}
</script>

<template>
  <button
    :class="cls"
    :type="type"
    :disabled="isDisabled"
    :aria-busy="loading || undefined"
    @click="onClick"
  >
    <span v-if="loading" class="h5-btn__spinner" aria-hidden="true" />
    <span v-else-if="icon != null" class="h5-btn__icon">
      <component :is="icon" />
    </span>
    <slot />
  </button>
</template>
