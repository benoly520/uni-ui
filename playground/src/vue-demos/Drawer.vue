<template>
  <div class="demo-row">
    <Button @click="open = true">打开 Drawer</Button>
    <Drawer :open="open" title="筛选条件" subtitle="右侧滑出" @open-change="open = $event">
      <p>Drawer 用于承载较复杂的筛选 / 表单。</p>
    </Drawer>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { Button, Drawer } from 'uni-ui/vue';
const open = ref(false);
</script>
