<script setup lang="ts">
import { computed, ref } from 'vue';
import { IconCheck } from './icons';

interface StepItem {
  title: unknown;
  desc?: unknown;
}

const props = withDefaults(
  defineProps<{
    /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
    glass?: boolean;
    steps: StepItem[];
    current?: number;
    defaultCurrent?: number;
    clickable?: boolean;
  }>(),
  {
    glass: true,
    current: undefined,
    defaultCurrent: 0,
    clickable: true,
  },
);

const emit = defineEmits<{
  (e: 'change', index: number): void;
}>();

const isControlled = computed(() => props.current != null);
const inner = ref<number>(props.defaultCurrent);
const cur = computed(() => (isControlled.value ? (props.current as number) : inner.value));

function go(i: number) {
  if (!props.clickable) return;
  if (!isControlled.value) inner.value = i;
  emit('change', i);
}
</script>

<template>
  <div class="ui-steps" :data-glass="glass === false ? 'off' : undefined">
    <template v-for="(s, i) in steps" :key="`step-${i}`">
      <div
        :class="[
          'ui-step',
          i < cur && 'is-done',
          i === cur && 'is-current',
          clickable && 'is-clickable',
        ]"
        :data-step="i"
        @click="clickable ? go(i) : undefined"
      >
        <span class="ui-step-dot">
          <IconCheck v-if="i < cur" :stroke-width="3" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span class="ui-step-text">
          <span class="ui-step-title">{{ s.title }}</span>
          <span v-if="s.desc != null" class="ui-step-desc">{{ s.desc }}</span>
        </span>
      </div>
      <span v-if="i < steps.length - 1" class="ui-step-line" />
    </template>
  </div>
</template>
