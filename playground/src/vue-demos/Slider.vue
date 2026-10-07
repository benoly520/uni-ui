<template>
  <div class="demo-row" style="width: 320px">
    <Slider :min="0" :max="100" :default-value="[20, 80]" format="pct" />
  </div>
</template>
<script setup lang="ts">
import { Slider } from 'uni-ui/vue';
</script>
