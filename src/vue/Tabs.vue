<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, type CSSProperties } from 'vue';

interface TabItem {
  key: string;
  label?: unknown;
  content?: unknown;
}

const props = withDefaults(
  defineProps<{
    items: TabItem[];
    value?: string;
    defaultValue?: string;
    ariaLabel?: string;
  }>(),
  {
    ariaLabel: '标签页',
  },
);

const emit = defineEmits<{
  (e: 'change', key: string): void;
}>();

const isControlled = computed(() => props.value != null);
const inner = ref<string>(props.defaultValue ?? props.items[0]?.key ?? '');
const selected = computed(() => (isControlled.value ? (props.value as string) : inner.value));

const wrapRef = ref<HTMLElement | null>(null);
const scrollRef = ref<HTMLElement | null>(null);

function select(key: string) {
  if (!isControlled.value) inner.value = key;
  emit('change', key);
}

function updateArrows() {
  const scroller = scrollRef.value;
  const wrap = wrapRef.value;
  if (!scroller || !wrap) return;
  const max = scroller.scrollWidth - scroller.clientWidth;
  const x = scroller.scrollLeft;
  const left = wrap.querySelector('.ui-tabs-arrow--left');
  const right = wrap.querySelector('.ui-tabs-arrow--right');
  left?.classList.toggle('is-visible', x > 1);
  right?.classList.toggle('is-visible', x < max - 1);
}

function onScroll() {
  updateArrows();
}
function onWinResize() {
  updateArrows();
}

let ro: ResizeObserver | null = null;
onMounted(() => {
  updateArrows();
  scrollRef.value?.addEventListener('scroll', onScroll, { passive: true });
  ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateArrows) : null;
  ro?.observe(scrollRef.value as Element);
  window.addEventListener('resize', onWinResize);
});
onUnmounted(() => {
  scrollRef.value?.removeEventListener('scroll', onScroll);
  ro?.disconnect();
  window.removeEventListener('resize', onWinResize);
});

watch(selected, () => {
  const tab = scrollRef.value?.querySelector<HTMLElement>(`#tab-${CSS.escape(selected.value)}`);
  tab?.scrollIntoView({ inline: 'nearest', block: 'nearest', behavior: 'smooth' });
});

function onKeyDown(e: KeyboardEvent) {
  const tabs = props.items;
  const i = tabs.findIndex((t) => t.key === selected.value);
  if (i < 0) return;
  let n = -1;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') n = 0;
  else if (e.key === 'End') n = tabs.length - 1;
  else return;
  e.preventDefault();
  const key = tabs[n].key;
  select(key);
  const el = scrollRef.value?.querySelector<HTMLElement>(`#tab-${CSS.escape(key)}`);
  el?.focus();
}

function scrollByStep(dir: -1 | 1) {
  const scroller = scrollRef.value;
  if (!scroller) return;
  const step = Math.max(80, scroller.clientWidth * 0.8);
  scroller.scrollBy({ left: dir * step, behavior: 'smooth' });
}
</script>

<template>
  <div class="ui-tabs-wrap" ref="wrapRef">
    <button
      class="ui-tabs-arrow ui-tabs-arrow--left"
      aria-label="向左滚动标签"
      type="button"
      @click="scrollByStep(-1)"
    />
    <div class="ui-tabs-scroll" ref="scrollRef">
      <div class="ui-tabs" role="tablist" :aria-label="ariaLabel" @keydown="onKeyDown">
        <button
          v-for="it in items"
          :key="it.key"
          role="tab"
          :id="`tab-${it.key}`"
          :aria-selected="it.key === selected"
          :aria-controls="`panel-${it.key}`"
          :tabindex="it.key === selected ? 0 : -1"
          @click="select(it.key)"
        >
          {{ it.label }}
        </button>
      </div>
    </div>
    <button
      class="ui-tabs-arrow ui-tabs-arrow--right"
      aria-label="向右滚动标签"
      type="button"
      @click="scrollByStep(1)"
    />
  </div>
  <div
    v-for="it in items"
    :key="it.key"
    class="ui-tabpanel"
    :id="`panel-${it.key}`"
    role="tabpanel"
    :aria-labelledby="`tab-${it.key}`"
    :hidden="it.key !== selected"
  >
    {{ it.content }}
  </div>
</template>
