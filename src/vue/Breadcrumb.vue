<script setup lang="ts">
import { ref } from 'vue';

interface BreadcrumbItem {
  label: unknown;
  href?: string;
}

withDefaults(
  defineProps<{
    items: BreadcrumbItem[];
    separator?: string;
    ariaLabel?: string;
  }>(),
  {
    separator: '/',
    ariaLabel: '路径导航',
  },
);
</script>

<template>
  <nav class="ui-breadcrumb" :aria-label="ariaLabel">
    <template v-for="(it, i) in items" :key="`g-${i}`">
      <span v-if="i === items.length - 1" class="current" aria-current="page">{{ it.label }}</span>
      <a v-else :href="it.href">{{ it.label }}</a>
      <span v-if="i !== items.length - 1" class="sep">{{ separator }}</span>
    </template>
  </nav>
</template>
