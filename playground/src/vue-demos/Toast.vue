<template>
  <div class="demo-row">
    <Button @click="toast('操作成功')">默认 Toast</Button>
    <Button variant="glass" @click="toast('正在保存…', { duration: 0 })">常驻 Toast</Button>
  </div>
</template>
<script setup lang="ts">
import { Button, toast } from 'uni-ui/vue';
</script>
