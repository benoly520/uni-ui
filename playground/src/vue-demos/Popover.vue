<template>
  <div class="demo-row">
    <Popover>
      <Button>触发浮层</Button>
      <template #content>面板可放<strong>可交互</strong>内容，如按钮。</template>
    </Popover>
  </div>
</template>
<script setup lang="ts">
import { Popover, Button } from 'uni-ui/vue';
</script>
