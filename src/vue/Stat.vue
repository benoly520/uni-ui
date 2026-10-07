<script setup lang="ts">
import { computed } from 'vue';

type StatTrend = 'up' | 'down' | 'muted';

const props = withDefaults(
  defineProps<{
    /** 指标名（如「上证指数」） */
    label?: string;
    /** 主值，强制 tabular-nums 等宽数字 */
    value?: string | number;
    /** 前缀（如 ¥） */
    prefix?: string;
    /** 后缀（如 亿） */
    suffix?: string;
    /** 涨跌文案（如 +1.24% / 较昨日 —） */
    delta?: string;
    /** 涨跌着色：走 --ui-color-up/down；muted 灰色 */
    trend?: StatTrend;
  }>(),
  {},
);

const trendClass = computed(() =>
  props.trend == null ? undefined : `ui-num--${props.trend}`,
);
</script>

<template>
  <div class="ui-stat">
    <span v-if="label != null" class="label">{{ label }}</span>
    <span
      v-if="value != null"
      class="value ui-num"
      :class="trendClass"
      :data-num="trend"
    >
      {{ prefix }}{{ value }}{{ suffix }}
    </span>
    <span
      v-if="delta != null"
      class="delta"
      :class="trendClass"
      :data-num="trend"
    >
      {{ delta }}
    </span>
  </div>
</template>
