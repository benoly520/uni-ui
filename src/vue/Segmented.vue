<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

interface SegmentedOption {
  /** 选项显示文案（文本或节点） */
  label: unknown;
  /** 选项值（受控/非受控标识） */
  value: string | number;
  /** 单选项禁用 */
  disabled?: boolean;
}

type SegmentedSize = 'lg' | 'md' | 'xs' | 'sm';

const props = withDefaults(
  defineProps<{
    /** 选项列表 */
    options: SegmentedOption[];
    /** 受控选中值 */
    value?: string | number;
    /** 非受控初始值（缺省取首项 value） */
    defaultValue?: string | number;
    /** 尺寸 Scale（全局修饰，md 默认无类） */
    size?: SegmentedSize;
    /** 整组禁用 */
    disabled?: boolean;
    ariaLabel?: string;
  }>(),
  {
    size: 'md',
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'change', value: string | number): void;
}>();

const isControlled = computed(() => props.value != null);
const inner = ref<string | number>(props.defaultValue ?? props.options[0]?.value);
const selected = computed(() => (isControlled.value ? (props.value as string | number) : inner.value));

const rootRef = ref<HTMLElement | null>(null);
const thumb = ref<{ left: number; width: number }>({ left: 0, width: 0 });

function updateThumb() {
  const root = rootRef.value;
  if (!root) return;
  const btns = Array.from(root.querySelectorAll<HTMLButtonElement>('button'));
  const idx = props.options.findIndex((o) => o.value === selected.value);
  const btn = btns[idx];
  if (btn) thumb.value = { left: btn.offsetLeft, width: btn.offsetWidth };
}

let ro: ResizeObserver | null = null;
onMounted(() => {
  updateThumb();
  if (typeof window !== 'undefined' && window.ResizeObserver && rootRef.value) {
    ro = new ResizeObserver(() => updateThumb());
    ro.observe(rootRef.value);
  }
  window.addEventListener('resize', updateThumb);
});
onBeforeUnmount(() => {
  ro?.disconnect();
  window.removeEventListener('resize', updateThumb);
});
watch(selected, () => nextTick(updateThumb));
watch(() => props.options, () => nextTick(updateThumb), { deep: true });

function select(o: SegmentedOption) {
  if (props.disabled || o.disabled) return;
  if (!isControlled.value) inner.value = o.value;
  emit('change', o.value);
}

const cls = computed(() => [
  'ui-segmented',
  props.size !== 'md' && `ui-size-${props.size}`,
]);
</script>

<template>
  <div
    ref="rootRef"
    :class="cls"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
  >
    <span class="thumb" :style="{ left: thumb.left + 'px', width: thumb.width + 'px' }" />
    <button
      v-for="o in options"
      :key="String(o.value)"
      type="button"
      :aria-pressed="o.value === selected"
      :disabled="disabled || o.disabled"
      @click="select(o)"
    >
      <component :is="o.label as any" v-if="typeof o.label === 'object' && o.label !== null" />
      <template v-else>{{ o.label }}</template>
    </button>
  </div>
</template>
