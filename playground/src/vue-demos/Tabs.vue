<template>
  <Tabs :items="items" />
</template>
<script setup lang="ts">
import { Tabs } from 'uni-ui/vue';
const items = [
  { key: 'a', label: '概况', content: '公司基本面与行业地位。' },
  { key: 'b', label: '财务', content: '营收 / 利润 / 现金流。' },
  { key: 'c', label: '研报', content: '近期券商观点。' },
];
</script>
