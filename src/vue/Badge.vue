<script setup lang="ts">
import { computed } from 'vue';

type BadgeTone = 'brand' | 'danger' | 'success' | 'warning' | 'info';

const props = withDefaults(
  defineProps<{
    /** 语义色（token 驱动，无硬色值） */
    tone?: BadgeTone;
    /** 前置状态圆点 */
    dot?: boolean;
    /** 计数值；配合 max 截断为 99+ */
    count?: number;
    /** 截断阈值 */
    max?: number;
    /** count===0 时是否仍渲染 */
    showZero?: boolean;
  }>(),
  {
    tone: 'brand',
    dot: false,
    max: 99,
    showZero: false,
  },
);

const visible = computed(() => !(props.count != null && props.count === 0 && !props.showZero));

const toneStyle = computed(() => ({
  background: `var(--ui-color-${props.tone}-soft, var(--ui-color-brand-soft))`,
  color: `var(--ui-color-${props.tone}, var(--ui-color-brand))`,
}));

const content = computed(() => {
  if (props.count != null) return props.count > props.max ? `${props.max}+` : `${props.count}`;
  return null;
});
</script>

<template>
  <span v-if="visible" class="ui-badge" :style="toneStyle">
    <span
      v-if="dot"
      class="ui-badge-dot"
      style="width:8px;height:8px;border-radius:50%;background:currentColor;flex:none;"
    />
    <template v-if="content !== null">{{ content }}</template>
    <slot v-else />
  </span>
</template>
