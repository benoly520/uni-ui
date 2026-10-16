<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount } from 'vue';
import { IconSearch } from './icons';

interface SearchTag {
  text: string;
  variant?: 'up' | 'down' | 'brand';
}
interface SearchOption {
  label: string;
  value: string;
  code?: string;
  tag?: SearchTag;
}
interface SearchProps {
  options?: SearchOption[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<SearchProps>(), {
  options: () => [],
  placeholder: '搜索…',
});
const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'select', option: SearchOption): void;
}>();

const isControlled = computed(() => props.value != null);
const inner = ref<string>(props.defaultValue ?? '');
const curVal = computed(() => (isControlled.value ? (props.value as string) : inner.value));

const open = ref(false);
const active = ref(-1);

const visible = computed(() => {
  const q = curVal.value.trim().toLowerCase();
  if (!q) return props.options;
  return props.options.filter(
    (o) => o.label.toLowerCase().includes(q) || (o.code ?? '').toLowerCase().includes(q),
  );
});

function commitValue(next: string) {
  if (!isControlled.value) inner.value = next;
  emit('change', next);
}
function selectOption(opt: SearchOption) {
  commitValue(opt.label);
  emit('select', opt);
  open.value = false;
  active.value = -1;
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') {
    e.preventDefault();
    active.value = Math.min(active.value + 1, visible.value.length - 1);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    active.value = Math.max(active.value - 1, 0);
  } else if (e.key === 'Enter') {
    if (visible.value[active.value]) {
      e.preventDefault();
      selectOption(visible.value[active.value]);
    }
  } else if (e.key === 'Escape') {
    open.value = false;
    active.value = -1;
  }
}

const rootRef = ref<HTMLElement | null>(null);
function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
    open.value = false;
    active.value = -1;
  }
}
watch(open, (v) => {
  if (v) document.addEventListener('click', onDocClick);
  else document.removeEventListener('click', onDocClick);
});
onBeforeUnmount(() => document.removeEventListener('click', onDocClick));
</script>

<template>
  <div ref="rootRef" class="ui-search" :class="open && 'open'">
    <span class="ico ui-icon">
      <IconSearch />
    </span>
    <input
      class="ui-search-input"
      :placeholder="placeholder"
      aria-label="全局搜索"
      :value="curVal"
      @focus="open = true"
      @input="(e: any) => { commitValue(e.target.value); open = true; active = -1; }"
      @keydown="onKeyDown"
    />
    <div class="ui-search-suggest" role="listbox">
      <div
        v-for="(opt, i) in visible"
        :key="opt.value"
        class="opt"
        :class="i === active && 'active'"
        role="option"
        @mousedown.prevent="selectOption(opt)"
      >
        <span>
          {{ opt.label }}
          <span
            v-if="opt.tag"
            class="ui-tag"
            :class="opt.tag.variant && `ui-tag--${opt.tag.variant}`"
          >
            {{ opt.tag.text }}
          </span>
        </span>
        <span v-if="opt.code" class="code">{{ opt.code }}</span>
      </div>
    </div>
  </div>
</template>
