<script setup lang="ts">
import { type CSSProperties } from 'vue';

withDefaults(
  defineProps<{
    /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
    glass?: boolean;
    /** 可见性；命令式/受控都用 show 切换入场/退场动画 */
    show?: boolean;
    /** 类型，左 .dot 用语义色 token */
    type?: 'success' | 'warning' | 'info' | 'danger';
    /** 通知正文 */
    content?: string;
    /** 内联样式 */
    style?: CSSProperties;
  }>(),
  { glass: true, show: false, type: 'info', content: '' },
);
</script>

<template>
  <div class="ui-message" :class="[`ui-message--${type}`, { show }]" role="status" aria-live="polite" :style="style" :data-glass="glass === false ? 'off' : undefined">
    <span class="dot"></span>
    <span class="msg-text"><slot>{{ content }}</slot></span>
  </div>
</template>
