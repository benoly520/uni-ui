<script setup lang="ts">
import { type CSSProperties, type VNode } from 'vue';
import { IconTable } from './icons';

withDefaults(
  defineProps<{
    /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
    glass?: boolean;
    /** 空状态描述文案 */
    description?: string;
    /** 图标插槽（24×24 + currentColor）；默认内置 table 图标，可覆盖 */
    icon?: unknown;
    /** 内联样式 */
    style?: CSSProperties;
  }>(),
  { glass: true, description: '', icon: undefined },
);
</script>

<template>
  <div class="ui-empty" :style="style" :data-glass="glass === false ? 'off' : undefined">
    <span class="ico ui-icon">
      <!-- 默认内置内联 SVG（图形等价于 lucide table），不依赖图标库运行时 -->
      <component :is="(icon as VNode)" v-if="icon != null" />
      <IconTable v-else />
    </span>
    <span v-if="description" class="ui-label">{{ description }}</span>
    <slot />
  </div>
</template>
