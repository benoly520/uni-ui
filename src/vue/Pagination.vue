<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    /** 总条目数 */
    total: number;
    /** 每页条目数 */
    pageSize?: number;
    /** 受控当前页（1-based） */
    page?: number;
    /** 非受控初始页 */
    defaultPage?: number;
    /** 当前页两侧保留页码数 */
    siblingCount?: number;
    /** 无障碍标签 */
    ariaLabel?: string;
  }>(),
  {
    pageSize: 10,
    defaultPage: 1,
    siblingCount: 1,
    ariaLabel: '分页',
  },
);

const emit = defineEmits<{
  (e: 'change', page: number): void;
}>();

const isControlled = computed(() => props.page != null);
const inner = ref(props.defaultPage);
const current = computed(() => (isControlled.value ? (props.page as number) : inner.value));
const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const safeCurrent = computed(() => Math.min(Math.max(1, current.value), totalPages.value));

type PageItem = number | 'ellipsis';
function getPages(cur: number, tp: number, sibling: number): PageItem[] {
  const totalNumbers = sibling * 2 + 5;
  if (tp <= totalNumbers) {
    return Array.from({ length: tp }, (_, i) => i + 1);
  }
  const left = Math.max(2, cur - sibling);
  const right = Math.min(tp - 1, cur + sibling);
  const showLeft = left > 2;
  const showRight = right < tp - 1;
  const pages: PageItem[] = [1];
  if (showLeft) pages.push('ellipsis');
  for (let i = left; i <= right; i++) pages.push(i);
  if (showRight) pages.push('ellipsis');
  pages.push(tp);
  return pages;
}

const items = computed(() => getPages(safeCurrent.value, totalPages.value, props.siblingCount));

function go(p: number) {
  if (p < 1 || p > totalPages.value || p === safeCurrent.value) return;
  if (!isControlled.value) inner.value = p;
  emit('change', p);
}
</script>

<template>
  <nav
    class="ui-pagination"
    role="navigation"
    :aria-label="ariaLabel"
  >
    <button
      aria-label="上一页"
      data-prev
      type="button"
      :disabled="safeCurrent <= 1"
      @click="go(safeCurrent - 1)"
    >
      ‹
    </button>
    <template v-for="(it, i) in items" :key="typeof it === 'number' ? it : `e-${i}`">
      <button
        v-if="it === 'ellipsis'"
        class="ui-pagination--ellipsis"
        type="button"
        disabled
        aria-label="更多页"
      >
        …
      </button>
      <button
        v-else
        type="button"
        :class="{ 'is-active': it === safeCurrent }"
        :aria-current="it === safeCurrent ? 'page' : undefined"
        @click="go(it)"
      >
        {{ it }}
      </button>
    </template>
    <button
      aria-label="下一页"
      data-next
      type="button"
      :disabled="safeCurrent >= totalPages"
      @click="go(safeCurrent + 1)"
    >
      ›
    </button>
  </nav>
</template>
