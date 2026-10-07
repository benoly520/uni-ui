<template>
  <div class="demo-row">
    <Tooltip content="这是一条提示"><Button>悬停查看</Button></Tooltip>
    <Tooltip content="跟随主题表面" variant="surface">
      <Button variant="glass">surface 变体</Button>
    </Tooltip>
  </div>
</template>
<script setup lang="ts">
import { Tooltip, Button } from 'uni-ui/vue';
</script>
