<template>
  <div class="demo-row">
    <Button @click="showMessage('数据已更新', 'success')">success</Button>
    <Button variant="glass" @click="showMessage('请求失败', 'error')">error</Button>
  </div>
</template>
<script setup lang="ts">
import { Button, showMessage } from 'uni-ui/vue';
</script>
