<template>
  <Tree :data="treeData" :default-expanded-keys="['1']" :default-checked-keys="['1-1']" />
</template>
<script setup lang="ts">
import { Tree } from 'uni-ui/vue';
const treeData = [
  {
    key: '1',
    label: '金融',
    count: 128,
    children: [
      { key: '1-1', label: '银行', count: 42 },
      { key: '1-2', label: '券商', count: 51 },
      { key: '1-3', label: '保险', count: 35 },
    ],
  },
  {
    key: '2',
    label: '消费',
    count: 86,
    children: [
      { key: '2-1', label: '白酒', count: 19 },
      { key: '2-2', label: '家电', count: 67 },
    ],
  },
];
</script>
