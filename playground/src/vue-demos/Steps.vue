<template>
  <Steps :steps="steps" :default-current="1" />
</template>
<script setup lang="ts">
import { Steps } from 'uni-ui/vue';
const steps = [
  { title: '选股', desc: '筛选池' },
  { title: '回测', desc: '历史验证' },
  { title: '实盘', desc: '跟踪' },
];
</script>
