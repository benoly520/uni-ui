<script lang="ts">
/** 模块级自增：保证同一页面多个 Tooltip 的气泡 id 唯一（实例级计数器会让每个实例都从 1 开始） */
let tipSeq = 0;
function nextTipId() {
  return `tip-${++tipSeq}`;
}
</script>

<script setup lang="ts">
import { computed, cloneVNode, ref, type CSSProperties, type VNode } from 'vue';

type TooltipVariant = 'invert' | 'surface';
type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

const props = withDefaults(
  defineProps<{
    /** 气泡内容（与 React / Plain 端同名的 prop；亦可使用 content 插槽） */
    content?: unknown;
    /** invert=反转色（默认 macOS 惯例）；surface=跟随主题表面 + 毛玻璃 */
    variant?: TooltipVariant;
    /** 气泡方位（仅 top 已有 CSS，其余见交付报告） */
    placement?: TooltipPlacement;
    /** 受控显示 */
    open?: boolean;
    /** 非受控初始显示 */
    defaultOpen?: boolean;
    /** 显示延迟（ms） */
    delay?: number;
    /** 禁用提示 */
    disabled?: boolean;
    /** 气泡 id（默认自动生成，用于 aria-describedby） */
    id?: string;
  }>(),
  {
    variant: 'invert',
    placement: 'top',
    defaultOpen: false,
    delay: 0,
    disabled: false,
  },
);

const emit = defineEmits<{
  (e: 'open-change', open: boolean): void;
}>();

const tipId = props.id ?? nextTipId();

const isControlled = computed(() => props.open != null);
const innerOpen = ref(props.defaultOpen);
const open = computed(() => (isControlled.value ? (props.open as boolean) : innerOpen.value));

let hideTimer: number | undefined;
let showTimer: number | undefined;

function clearTimers() {
  window.clearTimeout(hideTimer);
  window.clearTimeout(showTimer);
}
function setOpen(next: boolean) {
  if (!isControlled.value) innerOpen.value = next;
  emit('open-change', next);
}
function show() {
  if (props.disabled) return;
  clearTimers();
  showTimer = window.setTimeout(() => setOpen(true), props.delay);
}
function hide() {
  if (props.disabled) return;
  clearTimers();
  hideTimer = window.setTimeout(() => setOpen(false), 120);
}

function onMouseEnter() {
  show();
}
function onMouseLeave() {
  hide();
}
function onFocusIn() {
  show();
}
function onFocusOut(e: FocusEvent) {
  const cur = e.currentTarget as HTMLElement;
  if (e.relatedTarget && cur.contains(e.relatedTarget as Node)) return;
  hide();
}
function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    setOpen(false);
    const el = (e.currentTarget as HTMLElement).querySelector('[aria-describedby]') ||
      (e.currentTarget as HTMLElement).firstElementChild;
    (el as HTMLElement | null)?.focus();
  }
}

const slots = defineSlots<{ default?: () => VNode[]; content?: () => VNode[] }>();
const triggerNode = computed(() => {
  const vns = slots.default?.() ?? [];
  const first = vns[0];
  if (!first) return null;
  return cloneVNode(first, { 'aria-describedby': tipId });
});

/** content prop：节点 / 函数走 <component :is>，字符串直接插值 */
const hasContent = computed(() => props.content != null);
const contentIsNode = computed(
  () => typeof props.content === 'object' || typeof props.content === 'function',
);
const renderContent = () => props.content as VNode;
</script>

<template>
  <span
    class="ui-tip"
    :class="[
      variant === 'surface' && 'ui-tip--surface',
      placement !== 'top' && `ui-tip--${placement}`,
      open && 'is-open',
    ]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown="onKeyDown"
  >
    <component :is="triggerNode" />
    <span
      class="bubble"
      role="tooltip"
      :id="tipId"
      :aria-hidden="open ? undefined : true"
    >
      <slot name="content">
        <component :is="renderContent" v-if="contentIsNode" />
        <template v-else-if="hasContent">{{ content }}</template>
      </slot>
    </span>
  </span>
</template>
