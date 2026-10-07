<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

interface VTableColumn {
  key: string;
  title: string;
  numeric?: boolean;
  sticky?: boolean;
  trend?: (row: Record<string, any>) => 'up' | 'down' | undefined;
  width?: string;
}
interface VirtualTableProps {
  rows: Record<string, any>[];
  columns: VTableColumn[];
  rowHeight?: number;
  buffer?: number;
  ariaLabel?: string;
}

const props = withDefaults(defineProps<VirtualTableProps>(), {
  rowHeight: 33,
  buffer: 6,
});

const scrollRef = ref<HTMLElement | null>(null);
const range = ref<[number, number]>([0, 0]);
const total = computed(() => props.rows.length);

const gridStyle = computed(() => ({
  gridTemplateColumns: props.columns.map((c) => c.width || '1fr').join(' '),
}));

function computeRange(
  scrollTop: number,
  clientHeight: number,
  t: number,
  rh: number,
  buf: number,
): [number, number] {
  const ch = clientHeight || 320;
  const start = Math.floor(scrollTop / rh);
  const vis = Math.ceil(ch / rh) + buf * 2;
  const s = Math.max(0, start - buf);
  const e = Math.min(t, s + vis);
  return [s, e];
}

function recompute() {
  const el = scrollRef.value;
  if (!el) return;
  range.value = computeRange(el.scrollTop, el.clientHeight, total.value, props.rowHeight, props.buffer);
}

const windowRows = computed(() => {
  const [s, e] = range.value;
  const out: number[] = [];
  for (let i = s; i < e; i++) out.push(i);
  return out;
});

onMounted(recompute);
</script>

<template>
  <div
    ref="scrollRef"
    class="ui-vtable"
    :aria-label="ariaLabel"
    @scroll="recompute"
  >
    <div class="ui-vtable-head" :style="gridStyle">
      <span
        v-for="col in columns"
        :key="col.key"
        :class="col.sticky && 'sticky-col'"
        :data-num="col.numeric || undefined"
      >
        {{ col.title }}
      </span>
    </div>
    <div class="ui-vtable-viewport" :style="{ height: total * rowHeight + 'px' }">
      <div
        v-for="i in windowRows"
        :key="i"
        class="ui-vtable-row"
        :style="{ ...gridStyle, transform: `translateY(${i * rowHeight}px)` }"
      >
        <span
          v-for="col in columns"
          :key="col.key"
          :class="[
            col.sticky && 'sticky-col',
            col.numeric && 'ui-num',
            col.trend && col.trend(rows[i]) && `ui-num--${col.trend(rows[i])}`,
          ]"
          :data-num="col.numeric || undefined"
        >
          {{ rows[i][col.key] }}
        </span>
      </div>
    </div>
  </div>
  <div class="ui-vtable-meta">渲染 {{ range[1] - range[0] }} 行 / 共 {{ total }} 行</div>
</template>
