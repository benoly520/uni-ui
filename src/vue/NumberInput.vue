<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    min?: number;
    max?: number;
    step?: number;
    precision?: number;
    prefix?: string;
    suffix?: string;
    value?: number | null;
    defaultValue?: number;
    ariaLabel?: string;
  }>(),
  {
    min: -Infinity,
    max: Infinity,
    step: 1,
    precision: 0,
    prefix: undefined,
    suffix: undefined,
    value: undefined,
    defaultValue: 0,
  },
);

const emit = defineEmits<{
  (e: 'change', value: number): void;
}>();

const isControlled = computed(() => props.value != null);
const inner = ref<number>(props.defaultValue);
const draft = ref<string | null>(null);
const v = computed(() => (isControlled.value ? (props.value as number) : inner.value));

const clamp = (n: number) => Math.min(props.max, Math.max(props.min, n));
const group = (n: number) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: props.precision,
    maximumFractionDigits: props.precision,
  });
const show = (n: number) => `${props.prefix ? props.prefix : ''}${group(n)}${props.suffix ? props.suffix : ''}`;

function parse(raw: string): number {
  const pRE = props.prefix ? props.prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*' : '';
  const sRE = props.suffix ? `\\s*${props.suffix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}` : '';
  const s = raw.replace(new RegExp(pRE), '').replace(new RegExp(sRE), '').replace(/[, ]/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? 0 : n;
}

function commit(n: number) {
  const c = clamp(n);
  if (!isControlled.value) inner.value = c;
  emit('change', c);
}

const display = computed(() => draft.value ?? show(v.value));

function onInput(e: Event) {
  draft.value = (e.target as HTMLInputElement).value;
}
function onBlur() {
  const n = clamp(parse(draft.value ?? show(v.value)));
  draft.value = null;
  commit(n);
}
function onEnter(e: KeyboardEvent) {
  if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
}
function stepBy(dir: 1 | -1) {
  draft.value = null;
  commit(clamp(v.value + dir * props.step));
}
</script>

<template>
  <div
    class="ui-number"
    :data-min="min !== -Infinity ? min : undefined"
    :data-max="max !== Infinity ? max : undefined"
    :data-step="step"
    :data-precision="precision"
    :data-prefix="prefix"
    :data-suffix="suffix"
  >
    <span v-if="prefix != null" class="ui-number-prefix">{{ prefix }}</span>
    <button type="button" class="ui-number-step" data-step="down" aria-label="减少" @click="stepBy(-1)">−</button>
    <input
      class="ui-number-input"
      inputmode="decimal"
      :aria-label="ariaLabel"
      :value="display"
      @input="onInput"
      @blur="onBlur"
      @keydown="onEnter"
    />
    <button type="button" class="ui-number-step" data-step="up" aria-label="增加" @click="stepBy(1)">+</button>
    <span v-if="suffix != null" class="ui-number-suffix">{{ suffix }}</span>
  </div>
</template>
