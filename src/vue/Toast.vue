<script setup lang="ts">
import { type CSSProperties, type VNode } from 'vue';

withDefaults(
  defineProps<{
    /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
    show?: boolean;
    /** 轻提示正文 */
    content?: string;
    /** 前置图标插槽（24×24 + currentColor） */
    icon?: unknown;
    /** 内联样式（位置/尺寸微调） */
    style?: CSSProperties;
  }>(),
  { show: false, content: '', icon: undefined },
);
</script>

<template>
  <div class="ui-toast ui-glass" :class="{ 'ui-toast.show': show }" role="status" aria-live="polite" :style="style">
    <span v-if="icon != null" class="ui-icon"><component :is="(icon as VNode)" /></span>
    <slot>{{ content }}</slot>
  </div>
</template>
