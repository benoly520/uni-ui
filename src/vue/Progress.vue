<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

const props = withDefaults(
  defineProps<{
    /** 当前进度（受控） */
    value?: number;
    /** 满值 */
    max?: number;
    /** 不确定态：无具体进度 */
    indeterminate?: boolean;
    /** 内联样式 */
    style?: CSSProperties;
  }>(),
  { value: 0, max: 100, indeterminate: false },
);

const pct = computed(() =>
  props.indeterminate ? 0 : Math.min(100, Math.max(0, (props.value / (props.max || 1)) * 100)),
);
const widthStyle = computed(() =>
  props.indeterminate ? undefined : { width: `${pct.value}%` },
);
</script>

<template>
  <div
    class="ui-progress"
    :class="{ 'ui-progress--indeterminate': indeterminate }"
    role="progressbar"
    aria-valuemin="0"
    :aria-valuemax="max"
    :aria-valuenow="indeterminate ? undefined : value"
    :style="style"
  >
    <span :style="widthStyle"></span>
  </div>
</template>
