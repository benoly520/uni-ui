<template>
  <div class="demo-row">
    <Button @click="open = true">打开 Dialog</Button>
    <Dialog
      :open="open"
      title="新建策略"
      :footer="footerNode"
      @open-change="open = $event"
    >
      <p>Dialog 支持焦点陷阱、Esc / 点遮罩关闭，纯走 theme.css。</p>
    </Dialog>
  </div>
</template>
<script setup lang="ts">
import { ref, h } from 'vue';
import { Button, Dialog } from 'uni-ui/vue';
const open = ref(false);
const footerNode = h(Button, { variant: 'primary', onClick: () => (open.value = false) }, '确定');
</script>
