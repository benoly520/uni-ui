<template>
  <div class="demo-row">
    <Stat label="上证指数" :value="3218.45" delta="+1.24%" trend="up" />
    <Stat label="创业板指" :value="2012.8" delta="-0.86%" trend="down" />
    <Stat label="成交额" value="1.02" suffix="万亿" trend="muted" />
  </div>
</template>
<script setup lang="ts">
import { Stat } from 'uni-ui/vue';
</script>
