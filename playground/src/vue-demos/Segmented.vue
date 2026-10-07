<template>
  <div class="demo-row">
    <Segmented :options="opts" default-value="d" />
  </div>
</template>
<script setup lang="ts">
import { Segmented } from 'uni-ui/vue';
const opts = [
  { label: '日K', value: 'd' },
  { label: '周K', value: 'w' },
  { label: '月K', value: 'm' },
];
</script>
