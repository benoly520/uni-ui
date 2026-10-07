<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

interface AccordionItemData {
  key: string;
  title: unknown;
  badge?: unknown;
  content?: unknown;
}

const props = withDefaults(
  defineProps<{
    items: AccordionItemData[];
    activeKeys?: string[];
    defaultActiveKeys?: string[];
  }>(),
  {
    activeKeys: undefined,
    defaultActiveKeys: () => [],
  },
);

const emit = defineEmits<{
  (e: 'change', keys: string[]): void;
}>();

const isControlled = computed(() => props.activeKeys != null);
const inner = ref<string[]>(props.defaultActiveKeys ?? []);
const keys = computed(() => (isControlled.value ? (props.activeKeys as string[]) : inner.value));
const set = computed(() => new Set(keys.value));

const panels = ref<Record<string, HTMLElement | null>>({});

function syncPanel(key: string) {
  const p = panels.value[key];
  if (!p) return;
  p.style.maxHeight = set.value.has(key) ? `${p.scrollHeight}px` : '0px';
}

function toggle(key: string) {
  const next = set.value.has(key)
    ? keys.value.filter((k) => k !== key)
    : [...keys.value, key];
  if (!isControlled.value) inner.value = next;
  emit('change', next);
}

watch(
  () => [keys.value, props.items],
  async () => {
    await nextTick();
    props.items.forEach((it) => syncPanel(it.key));
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="ui-accordion">
    <div
      v-for="item in items"
      :key="item.key"
      :class="['ui-accordion-item', set.has(item.key) && 'is-open']"
    >
      <button
        type="button"
        class="ui-accordion-header"
        :aria-expanded="set.has(item.key)"
        @click="toggle(item.key)"
      >
        <span>{{ item.title }}</span>
        <span v-if="item.badge != null" class="ui-accordion-badge">{{ item.badge }}</span>
        <span class="ui-accordion-caret ui-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </button>
      <div
        class="ui-accordion-panel"
        :ref="(el) => { panels[item.key] = (el as HTMLElement) ?? null; }"
      >
        <div class="ui-accordion-panel-inner">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>
