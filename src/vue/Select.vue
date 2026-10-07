<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue';

interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}
interface SelectProps {
  options: SelectOption[];
  value?: string | string[];
  defaultValue?: string | string[];
  multiple?: boolean;
  searchable?: boolean;
  placeholder?: string;
}

const props = withDefaults(defineProps<SelectProps>(), {
  multiple: false,
  searchable: false,
  placeholder: '请选择',
});
const emit = defineEmits<{
  (e: 'change', value: string | string[], option: SelectOption | SelectOption[] | undefined): void;
}>();

const isControlled = computed(() => props.value != null);
const inner = ref<string | string[]>(props.defaultValue ?? (props.multiple ? [] : ''));
const curVal = computed(() => (isControlled.value ? (props.value as string | string[]) : inner.value));
const selectedSet = computed(() => new Set(Array.isArray(curVal.value) ? curVal.value : curVal.value ? [curVal.value] : []));

const open = ref(false);
const query = ref('');

const filtered = computed(() => {
  if (!props.searchable || !query.value.trim()) return props.options;
  const q = query.value.trim().toLowerCase();
  return props.options.filter(
    (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q),
  );
});

const labelText = computed(() => {
  if (props.multiple) {
    const labels = props.options.filter((o) => selectedSet.value.has(o.value)).map((o) => o.label);
    return labels.length ? labels.join('、') : props.placeholder;
  }
  const opt = props.options.find((o) => o.value === curVal.value);
  return opt ? opt.label : props.placeholder;
});

function commit(next: string | string[]) {
  if (!isControlled.value) inner.value = next;
  if (props.multiple) {
    const opts = props.options.filter((o) => (next as string[]).includes(o.value));
    emit('change', next, opts);
  } else {
    const opt = props.options.find((o) => o.value === next);
    emit('change', next, opt);
  }
}

function onOptionClick(opt: SelectOption) {
  if (opt.disabled) return;
  if (props.multiple) {
    const arr = selectedSet.value.has(opt.value)
      ? (curVal.value as string[]).filter((v) => v !== opt.value)
      : [...(curVal.value as string[]), opt.value];
    commit(arr);
  } else {
    commit(opt.value);
    open.value = false;
  }
}

const rootRef = ref<HTMLElement | null>(null);
function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) open.value = false;
}
watch(open, (v) => {
  if (v) document.addEventListener('click', onDocClick);
  else document.removeEventListener('click', onDocClick);
});
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<template>
  <div
    ref="rootRef"
    class="ui-select"
    :class="open && 'open'"
    :data-multiple="multiple || undefined"
    @keydown="(e: KeyboardEvent) => { if (e.key === 'Escape') open = false; }"
  >
    <button
      type="button"
      class="ui-select-trigger"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click.stop="open = !open"
    >
      {{ labelText }}
      <span class="caret ui-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
    </button>
    <div class="ui-select-menu" role="listbox">
      <input
        v-if="searchable"
        class="ui-select-search"
        placeholder="搜索…"
        v-model="query"
        @click.stop
      />
      <div
        v-for="opt in filtered"
        :key="opt.value"
        class="ui-select-option"
        :class="multiple && 'multi'"
        role="option"
        :data-val="opt.value"
        :aria-selected="selectedSet.has(opt.value)"
        @click="onOptionClick(opt)"
      >
        {{ opt.label }}
        <span v-if="multiple" class="check ui-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>
