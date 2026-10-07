<template>
  <div class="demo-row">
    <NumberInput prefix="¥" :precision="2" :default-value="1234567.5" />
    <NumberInput suffix="%" :precision="1" :default-value="12.3" :min="0" :max="100" />
  </div>
</template>
<script setup lang="ts">
import { NumberInput } from 'uni-ui/vue';
</script>
