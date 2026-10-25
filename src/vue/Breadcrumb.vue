<script setup lang="ts">
import { ref } from 'vue';

interface BreadcrumbItem {
  label: unknown;
  href?: string;
}

withDefaults(
  defineProps<{
    /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
    glass?: boolean;
    items: BreadcrumbItem[];
    separator?: string;
    ariaLabel?: string;
  }>(),
  {
    glass: true,
    separator: '/',
    ariaLabel: '路径导航',
  },
);
</script>

<template>
  <nav class="ui-breadcrumb" :aria-label="ariaLabel" :data-glass="glass === false ? 'off' : undefined">
    <template v-for="(it, i) in items" :key="`g-${i}`">
      <span v-if="i === items.length - 1" class="current" aria-current="page">{{ it.label }}</span>
      <a v-else :href="it.href">{{ it.label }}</a>
      <span v-if="i !== items.length - 1" class="sep">{{ separator }}</span>
    </template>
  </nav>
</template>
