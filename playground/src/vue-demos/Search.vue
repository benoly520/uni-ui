<template>
  <div class="demo-row">
    <Search :options="opts" placeholder="搜索股票 / 代码" />
  </div>
</template>
<script setup lang="ts">
import { Search } from 'uni-ui/vue';
const opts = [
  { label: '贵州茅台', value: '600519', code: 'SH', tag: { text: '白酒', variant: 'up' } },
  { label: '宁德时代', value: '300750', code: 'SZ' },
];
</script>
