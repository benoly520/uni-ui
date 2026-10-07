<script setup lang="ts">
import { type CSSProperties, type VNode } from 'vue';

withDefaults(
  defineProps<{
    /** 空状态描述文案 */
    description?: string;
    /** 图标插槽（24×24 + currentColor）；默认 table 占位，可覆盖 */
    icon?: unknown;
    /** 内联样式 */
    style?: CSSProperties;
  }>(),
  { description: '', icon: undefined },
);
</script>

<template>
  <div class="ui-empty" :style="style">
    <span class="ico ui-icon">
      <component :is="(icon as VNode)" v-if="icon != null" />
      <i v-else data-lucide="table"></i>
    </span>
    <span v-if="description" class="ui-label">{{ description }}</span>
    <slot />
  </div>
</template>
