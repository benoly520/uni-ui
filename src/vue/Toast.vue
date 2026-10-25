<script setup lang="ts">
import { type CSSProperties, type VNode } from 'vue';

withDefaults(
  defineProps<{
    /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
    glass?: boolean;
    /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
    show?: boolean;
    /** 轻提示正文 */
    content?: string;
    /** 前置图标插槽（24×24 + currentColor） */
    icon?: unknown;
    /** 内联样式（位置/尺寸微调） */
    style?: CSSProperties;
  }>(),
  { glass: true, show: false, content: '', icon: undefined },
);
</script>

<template>
  <div class="ui-toast ui-glass" :class="{ show }" role="status" aria-live="polite" :style="style" :data-glass="glass === false ? 'off' : undefined">
    <span v-if="icon != null" class="ui-icon"><component :is="(icon as VNode)" /></span>
    <slot>{{ content }}</slot>
  </div>
</template>
