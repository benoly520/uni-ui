<template>
  <div>
    <div ref="target" class="demo-target">右键此区域唤出菜单</div>
    <ContextMenu :target-ref="target" :items="items" @select="onSelect" />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { ContextMenu, toast } from 'uni-ui/vue';
const target = ref<HTMLElement | null>(null);
const items = [
  { key: 'edit', label: '编辑' },
  { key: 'copy', label: '复制' },
  { key: 'del', label: '删除', danger: true },
];
const onSelect = (k: string) => toast(`执行：${k}`);
</script>
