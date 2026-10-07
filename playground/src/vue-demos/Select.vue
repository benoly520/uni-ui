<template>
  <div class="demo-row">
    <Select :options="opts" placeholder="选择标的" />
    <Select multiple searchable :options="opts2" placeholder="多选 + 搜索" />
  </div>
</template>
<script setup lang="ts">
import { Select } from 'uni-ui/vue';
const opts = [
  { label: '贵州茅台', value: '600519' },
  { label: '宁德时代', value: '300750' },
  { label: '招商银行', value: '600036' },
];
const opts2 = [
  { label: '银行', value: 'bank' },
  { label: '券商', value: 'broker' },
  { label: '保险', value: 'ins' },
];
</script>
