<template>
  <Breadcrumb :items="items" />
</template>
<script setup lang="ts">
import { Breadcrumb } from 'uni-ui/vue';
const items = [
  { label: '研究', href: '#' },
  { label: '行业', href: '#' },
  { label: '白酒' },
];
</script>
