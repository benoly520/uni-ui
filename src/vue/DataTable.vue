<script setup lang="ts">
import { computed, ref } from 'vue';

interface DataTableColumn {
  key: string;
  title: string;
  numeric?: boolean;
  sortable?: boolean;
  sticky?: boolean;
  render?: (row: Record<string, any>, rowIndex: number) => any;
}
interface DataTableProps {
  columns: DataTableColumn[];
  data: Record<string, any>[];
  compact?: boolean;
  selectable?: boolean;
  rowKey?: string;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  defaultSortKey?: string;
  defaultSortDir?: 'asc' | 'desc';
  selectedKeys?: string[];
}

const props = withDefaults(defineProps<DataTableProps>(), {
  compact: false,
  selectable: false,
  rowKey: 'id',
  defaultSortDir: 'asc',
});
const emit = defineEmits<{
  (e: 'sort', key: string, dir: 'asc' | 'desc'): void;
  (e: 'select', keys: string[]): void;
}>();

const isSortControlled = computed(() => props.sortKey != null);
const sortInner = ref<{ key?: string; dir: 'asc' | 'desc' }>({
  key: props.defaultSortKey,
  dir: props.defaultSortDir,
});
const curSort = computed(() =>
  isSortControlled.value
    ? { key: props.sortKey, dir: props.sortDir ?? 'asc' }
    : sortInner.value,
);

const isSelControlled = computed(() => props.selectedKeys != null);
const selInner = ref<string[]>([]);
const selected = computed<string[]>(() =>
  isSelControlled.value ? (props.selectedKeys as string[]) : selInner.value,
);
const selectedSet = computed(() => new Set(selected.value));

function sortRows(
  rows: Record<string, any>[],
  key: string,
  dir: 'asc' | 'desc',
  numeric: boolean,
): Record<string, any>[] {
  const sign = dir === 'asc' ? 1 : -1;
  return rows
    .map((r, i) => ({ r, i }))
    .sort((a, b) => {
      const va = a.r[key];
      const vb = b.r[key];
      if (numeric) {
        const na = parseFloat(String(va).replace(/[+,%\s]/g, ''));
        const nb = parseFloat(String(vb).replace(/[+,%\s]/g, ''));
        if (na < nb) return -1 * sign;
        if (na > nb) return 1 * sign;
      } else {
        const sa = String(va);
        const sb = String(vb);
        if (sa < sb) return -1 * sign;
        if (sa > sb) return 1 * sign;
      }
      return a.i - b.i;
    })
    .map((x) => x.r);
}

const displayed = computed(() => {
  if (!curSort.value.key) return props.data;
  const col = props.columns.find((c) => c.key === curSort.value.key);
  return sortRows(props.data, curSort.value.key, curSort.value.dir, !!col?.numeric);
});

function handleSort(col: DataTableColumn) {
  if (!col.sortable) return;
  const isSorted = curSort.value.key === col.key;
  const asc = !isSorted || curSort.value.dir === 'desc';
  const nextDir: 'asc' | 'desc' = asc ? 'asc' : 'desc';
  if (!isSortControlled.value) sortInner.value = { key: col.key, dir: nextDir };
  emit('sort', col.key, nextDir);
}

function commitSel(next: string[]) {
  if (!isSelControlled.value) selInner.value = next;
  emit('select', next);
}
function toggleRow(key: string) {
  const next = selectedSet.value.has(key)
    ? selected.value.filter((k) => k !== key)
    : [...selected.value, key];
  commitSel(next);
}
const allChecked = computed(
  () =>
    displayed.value.length > 0 &&
    displayed.value.every((r) => selectedSet.value.has(r[props.rowKey])),
);
function toggleAll() {
  if (allChecked.value) {
    const remove = new Set(displayed.value.map((r) => r[props.rowKey]));
    commitSel(selected.value.filter((k) => !remove.has(k)));
  } else {
    const add = displayed.value.map((r) => r[props.rowKey]);
    commitSel(Array.from(new Set([...selected.value, ...add])));
  }
}

function onRowClick(e: MouseEvent, key: string) {
  if (props.selectable && (e.target as HTMLElement).closest('.col-check')) return;
  if (props.selectable) toggleRow(key);
}
</script>

<template>
  <div
    class="ui-table"
    :class="[
      compact && 'ui-table--compact',
      selectable && 'ui-table--selectable',
    ]"
  >
    <table>
      <thead>
        <tr>
          <th v-if="selectable" class="col-check">
            <input
              type="checkbox"
              class="row-check-all"
              aria-label="全选"
              :checked="allChecked"
              @change="toggleAll"
            />
          </th>
          <th
            v-for="col in columns"
            :key="col.key"
            :class="[
              col.sticky && 'sticky-col',
              col.sortable && 'ui-th--sortable',
              curSort.key === col.key && 'is-sorted',
            ]"
            :data-key="col.key"
            :data-num="col.numeric || undefined"
            :data-dir="curSort.key === col.key ? curSort.dir : undefined"
            @click="handleSort(col)"
          >
            {{ col.title }}
            <span v-if="col.sortable" class="arrow">▾</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="row in displayed"
          :key="row[rowKey]"
          :class="selectedSet.has(row[rowKey]) && 'is-selected'"
          :aria-selected="selectedSet.has(row[rowKey]) || undefined"
          @click="onRowClick($event, row[rowKey])"
        >
          <td v-if="selectable" class="col-check">
            <input
              type="checkbox"
              class="row-check"
              aria-label="选择"
              :checked="selectedSet.has(row[rowKey])"
              @change="toggleRow(row[rowKey])"
              @click.stop
            />
          </td>
          <td
            v-for="col in columns"
            :key="col.key"
            :class="[col.sticky && 'sticky-col', col.numeric && 'ui-num']"
            :data-num="col.numeric || undefined"
          >
            <template v-if="col.render">{{ col.render(row, 0) }}</template>
            <template v-else>{{ row[col.key] }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
