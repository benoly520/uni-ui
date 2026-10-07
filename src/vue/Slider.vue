<script setup lang="ts">
import { computed, ref } from 'vue';

type SliderFormat = 'pct' | 'num' | ((v: number) => string);

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    /** 受控值：[低值, 高值] */
    value?: [number, number];
    defaultValue?: [number, number];
    format?: SliderFormat;
    minLabel?: string;
    maxLabel?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    format: 'num',
    minLabel: '最小值',
    maxLabel: '最大值',
  },
);

const emit = defineEmits<{
  (e: 'change', value: [number, number]): void;
}>();

const isControlled = computed(() => props.value != null);
const inner = ref<[number, number]>(props.defaultValue ?? [props.min, props.max]);
const lo = computed(() => (isControlled.value ? (props.value as [number, number])[0] : inner.value[0]));
const hi = computed(() => (isControlled.value ? (props.value as [number, number])[1] : inner.value[1]));

const trackRef = ref<HTMLElement | null>(null);
const range = computed(() => props.max - props.min || 1);

function formatVal(v: number, fmt: SliderFormat): string {
  if (typeof fmt === 'function') return fmt(v);
  if (fmt === 'pct') return (v >= 0 ? '+' : '') + v.toFixed(1) + '%';
  return String(v);
}
function clampStep(v: number): number {
  const snapped = Math.round((v - props.min) / props.step) * props.step;
  return Math.min(props.max, Math.max(props.min, snapped));
}

const pct = (v: number) => ((v - props.min) / range.value) * 100;

function commit(next: [number, number]) {
  if (!isControlled.value) inner.value = next;
  emit('change', next);
}

function valFromX(clientX: number): number {
  const r = trackRef.value!.getBoundingClientRect();
  let p = (clientX - r.left) / r.width;
  p = Math.min(1, Math.max(0, p));
  return clampStep(props.min + p * range.value);
}

function startDrag(handle: 0 | 1, e: PointerEvent) {
  e.preventDefault();
  const move = (ev: PointerEvent) => {
    const v = valFromX(ev.clientX);
    const next: [number, number] =
      handle === 0 ? [Math.min(v, hi.value), hi.value] : [lo.value, Math.max(v, lo.value)];
    commit(next);
  };
  const up = () => {
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
}

function onKey(handle: 0 | 1, e: KeyboardEvent) {
  let d = 0;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') d = -props.step;
  else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') d = props.step;
  else if (e.key === 'Home') d = handle === 0 ? props.min - lo.value : props.min - hi.value;
  else if (e.key === 'End') d = handle === 0 ? props.max - lo.value : props.max - hi.value;
  else return;
  e.preventDefault();
  const next: [number, number] =
    handle === 0
      ? [Math.min(Math.max(props.min, lo.value + d), hi.value), hi.value]
      : [lo.value, Math.max(Math.min(props.max, hi.value + d), lo.value)];
  commit(next);
}

const pLo = computed(() => pct(lo.value));
const pHi = computed(() => pct(hi.value));
</script>

<template>
  <div class="ui-slider-wrap">
    <div class="ui-slider">
      <div class="ui-slider-track" ref="trackRef">
        <div
          class="ui-slider-fill"
          :style="{ left: pLo + '%', width: pHi - pLo + '%' }"
        />
        <div
          class="ui-slider-thumb"
          data-handle="0"
          tabindex="0"
          role="slider"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="lo"
          :aria-label="minLabel"
          :style="{ left: pLo + '%' }"
          @pointerdown="startDrag(0, $event)"
          @keydown="onKey(0, $event)"
        />
        <div
          class="ui-slider-thumb"
          data-handle="1"
          tabindex="0"
          role="slider"
          :aria-valuemin="min"
          :aria-valuemax="max"
          :aria-valuenow="hi"
          :aria-label="maxLabel"
          :style="{ left: pHi + '%' }"
          @pointerdown="startDrag(1, $event)"
          @keydown="onKey(1, $event)"
        />
      </div>
    </div>
    <div class="ui-slider-vals">
      <span class="s-min">{{ formatVal(lo, format) }}</span>
      <span class="s-max">{{ formatVal(hi, format) }}</span>
    </div>
  </div>
</template>
