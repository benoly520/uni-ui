<template>
  <div class="demo-row">
    <DatePicker default-value="2026-01-01" />
    <DatePicker range :default-value="['2026-01-01', '2026-01-31']" />
  </div>
</template>
<script setup lang="ts">
import { DatePicker } from 'uni-ui/vue';
</script>
