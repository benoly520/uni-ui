<script setup lang="ts">
import { type CSSProperties, type VNode } from 'vue';
import { IconTable } from './icons';

withDefaults(
  defineProps<{
    /** 空状态描述文案 */
    description?: string;
    /** 图标插槽（24×24 + currentColor）；默认内置 table 图标，可覆盖 */
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
      <!-- 默认内置内联 SVG（图形等价于 lucide table），不依赖图标库运行时 -->
      <component :is="(icon as VNode)" v-if="icon != null" />
      <IconTable v-else />
    </span>
    <span v-if="description" class="ui-label">{{ description }}</span>
    <slot />
  </div>
</template>
