<template>
  <DataTable :columns="cols" :data="rows" compact selectable row-key="code" />
</template>
<script setup lang="ts">
import { DataTable } from 'uni-ui/vue';
const cols = [
  { key: 'name', title: '名称', sticky: true },
  { key: 'code', title: '代码', numeric: true },
  { key: 'price', title: '最新价', numeric: true },
  { key: 'chg', title: '涨跌幅', numeric: true },
];
const rows = [
  { name: '贵州茅台', code: '600519', price: 1685.2, chg: '+1.24%' },
  { name: '宁德时代', code: '300750', price: 241.8, chg: '-0.86%' },
  { name: '招商银行', code: '600036', price: 38.42, chg: '+0.31%' },
];
</script>
