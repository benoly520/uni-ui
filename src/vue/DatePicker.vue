<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue';

type DatePickerValue = string | [string, string] | null;

const props = withDefaults(
  defineProps<{
    /** 范围模式（选起止两日）；否则单日 */
    range?: boolean;
    /** 受控值：单日 'YYYY-MM-DD'；范围 [起, 止]；未选 null */
    value?: DatePickerValue;
    /** 非受控初始值 */
    defaultValue?: DatePickerValue;
    /** 未选占位；单日默认「选择日期」，范围默认「选择日期区间」 */
    placeholder?: string;
    'aria-label'?: string;
  }>(),
  {
    range: false,
    defaultValue: null,
    placeholder: undefined,
    'aria-label': undefined,
  },
);

const emit = defineEmits<{
  (e: 'change', value: DatePickerValue): void;
}>();

const isControlled = computed(() => props.value != null);
const open = ref(false);
const today = new Date();
today.setHours(0, 0, 0, 0);

function fmt(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function parse(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function same(a: Date | null, b: Date | null): boolean {
  return !!a && !!b && a.getTime() === b.getTime();
}

function initFrom(v: DatePickerValue): { start: Date | null; end: Date | null; view: Date } {
  if (props.range) {
    const arr = (v as [string, string] | null) ?? null;
    const s = arr?.[0] ? parse(arr[0]) : null;
    const e = arr?.[1] ? parse(arr[1]) : null;
    return { start: s, end: e, view: new Date((s ?? today).getFullYear(), (s ?? today).getMonth(), 1) };
  }
  const s = typeof v === 'string' && v ? parse(v) : null;
  return { start: s, end: null, view: new Date((s ?? today).getFullYear(), (s ?? today).getMonth(), 1) };
}

const init = initFrom(props.defaultValue ?? null);
const view = ref<Date>(init.view);
const start = ref<Date | null>(init.start);
const end = ref<Date | null>(init.end);

watch(
  () => props.value,
  (v) => {
    if (!isControlled.value || v == null) return;
    const r = initFrom(v);
    start.value = r.start;
    end.value = r.end;
    view.value = r.view;
  },
);

const popAria = computed(() => (props.range ? '选择日期区间' : '选择日期'));
const triggerAria = computed(() => props['aria-label'] ?? popAria.value);

const triggerText = computed(() => {
  if (props.range) {
    if (start.value && end.value) return `${fmt(start.value)} ~ ${fmt(end.value)}`;
    if (start.value) return fmt(start.value);
    return props.placeholder ?? '选择日期区间';
  }
  return start.value ? fmt(start.value) : props.placeholder ?? '选择日期';
});

function commit(s: Date | null, e: Date | null) {
  if (props.range) emit('change', s && e ? [fmt(s), fmt(e)] : null);
  else emit('change', s ? fmt(s) : null);
}

function pick(date: Date) {
  if (props.range) {
    let ns = start.value;
    let ne = end.value;
    if (!start.value || (start.value && end.value)) {
      ns = date;
      ne = null;
    } else if (date < start.value) {
      ne = start.value;
      ns = date;
    } else {
      ne = date;
    }
    start.value = ns;
    end.value = ne;
    if (ns && ne) {
      commit(ns, ne);
      open.value = false;
    }
  } else {
    start.value = date;
    commit(date, null);
    open.value = false;
  }
}

const cells = computed(() => {
  const first = new Date(view.value.getFullYear(), view.value.getMonth(), 1);
  const lead = (first.getDay() + 6) % 7;
  const days = new Date(view.value.getFullYear(), view.value.getMonth() + 1, 0).getDate();
  const prevDays = new Date(view.value.getFullYear(), view.value.getMonth(), 0).getDate();
  const out: { key: string; text: number; cls: string; date?: string; out: boolean }[] = [];
  for (let i = 0; i < lead; i++) {
    out.push({ key: `o${i}`, text: prevDays - lead + 1 + i, cls: 'dp-cell is-out', out: true });
  }
  for (let d = 1; d <= days; d++) {
    const date = new Date(view.value.getFullYear(), view.value.getMonth(), d);
    const parts = ['dp-cell'];
    if (same(date, today)) parts.push('is-today');
    if (props.range) {
      if (same(date, start.value)) parts.push('is-selected', 'is-start');
      if (same(date, end.value)) parts.push('is-selected', 'is-end');
      if (start.value && end.value && date > start.value && date < end.value) parts.push('in-range');
    } else if (same(date, start.value)) parts.push('is-selected');
    out.push({ key: `d${d}`, text: d, cls: parts.join(' '), date: fmt(date), out: false });
  }
  return out;
});

function toggle() {
  open.value = !open.value;
}

function onToday() {
  if (props.range) {
    start.value = new Date(today);
    end.value = new Date(today);
    commit(new Date(today), new Date(today));
  } else {
    start.value = new Date(today);
    commit(new Date(today), null);
  }
  open.value = false;
}

function onClear() {
  start.value = null;
  end.value = null;
}

let onDoc: ((e: MouseEvent) => void) | null = null;
watch(open, (o) => {
  if (o) {
    onDoc = (e: MouseEvent) => {
      const root = document.querySelector('.ui-datepicker');
      if (root && !root.contains(e.target as Node)) open.value = false;
    };
    document.addEventListener('mousedown', onDoc);
  } else if (onDoc) {
    document.removeEventListener('mousedown', onDoc);
    onDoc = null;
  }
});
onBeforeUnmount(() => {
  if (onDoc) document.removeEventListener('mousedown', onDoc);
});
</script>

<template>
  <div class="ui-datepicker" :data-range="range ? '' : undefined">
    <button
      type="button"
      class="ui-datepicker-trigger ui-input"
      aria-haspopup="dialog"
      :aria-expanded="open"
      :aria-label="triggerAria"
      @click.stop="toggle"
    >
      <span class="ui-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" />
        </svg>
      </span>
      <span class="dp-text">{{ triggerText }}</span>
    </button>
    <div class="ui-datepicker-pop" role="dialog" :aria-label="popAria" :hidden="!open">
      <div class="dp-head">
        <button type="button" class="dp-nav" data-nav="prev" aria-label="上个月" @click="view = new Date(view.getFullYear(), view.getMonth() - 1, 1)">
          <span class="ui-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg></span>
        </button>
        <span class="dp-title">{{ view.getFullYear() }}年{{ view.getMonth() + 1 }}月</span>
        <button type="button" class="dp-nav" data-nav="next" aria-label="下个月" @click="view = new Date(view.getFullYear(), view.getMonth() + 1, 1)">
          <span class="ui-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6" /></svg></span>
        </button>
      </div>
      <div class="dp-week"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div>
      <div class="dp-grid">
        <div
          v-for="c in cells"
          :key="c.key"
          :class="c.cls"
          :data-disabled="c.out ? '1' : undefined"
          :data-date="c.date"
          @click="!c.out && pick(new Date(view.getFullYear(), view.getMonth(), c.text))"
        >{{ c.text }}</div>
      </div>
      <div class="dp-foot">
        <button type="button" class="ui-btn ui-btn--ghost ui-size-sm" data-act="today" @click="onToday">今天</button>
        <button type="button" class="ui-btn ui-btn--primary ui-size-sm" data-act="clear" @click="onClear">清除</button>
      </div>
    </div>
  </div>
</template>
