<template>
  <div class="demo-row">
    <Badge tone="brand" :count="9"><Avatar name="A" /></Badge>
    <Badge tone="success" dot><Avatar name="B" /></Badge>
    <Badge tone="danger" :count="99"><Button>消息</Button></Badge>
  </div>
</template>
<script setup lang="ts">
import { Badge, Avatar, Button } from 'uni-ui/vue';
</script>
