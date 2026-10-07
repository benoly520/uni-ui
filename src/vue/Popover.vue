<script setup lang="ts">
import { computed, cloneVNode, ref, onMounted, onUnmounted, type VNode } from 'vue';

const props = withDefaults(
  defineProps<{
    /** 受控显示 */
    open?: boolean;
    /** 非受控初始显示 */
    defaultOpen?: boolean;
    /** 面板无障碍标签 */
    ariaLabel?: string;
    /** 面板 id（默认自动生成，用于 aria-controls） */
    id?: string;
  }>(),
  {
    defaultOpen: false,
    ariaLabel: 'Popover',
  },
);

const emit = defineEmits<{
  (e: 'open-change', open: boolean): void;
}>();

let _uid = 0;
const popId = props.id ?? `pop-${(_uid += 1)}`;

const isControlled = computed(() => props.open != null);
const innerOpen = ref(props.defaultOpen);
const open = computed(() => (isControlled.value ? (props.open as boolean) : innerOpen.value));

const rootRef = ref<HTMLElement | null>(null);
let hideTimer: number | undefined;

function setOpen(next: boolean) {
  if (!isControlled.value) innerOpen.value = next;
  emit('open-change', next);
}
function show() {
  window.clearTimeout(hideTimer);
  setOpen(true);
}
function hide() {
  window.clearTimeout(hideTimer);
  hideTimer = window.setTimeout(() => setOpen(false), 120);
}

function onRootEnter() {
  show();
}
function onRootLeave() {
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
    const el = (e.currentTarget as HTMLElement).querySelector('[aria-controls]') ||
      (e.currentTarget as HTMLElement).firstElementChild;
    (el as HTMLElement | null)?.focus();
  }
}

function onDocClick(e: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(e.target as Node)) setOpen(false);
}
onMounted(() => document.addEventListener('click', onDocClick));
onUnmounted(() => document.removeEventListener('click', onDocClick));

const slots = defineSlots<{ default?: () => VNode[]; content?: () => VNode[] }>();
const triggerNode = computed(() => {
  const vns = slots.default?.() ?? [];
  const first = vns[0];
  if (!first) return null;
  const prevOnClick = (first.props as Record<string, unknown> | null)?.onClick as
    | ((e: MouseEvent) => void)
    | undefined;
  return cloneVNode(first, {
    'aria-expanded': open.value,
    'aria-controls': popId,
    onClick: (e: MouseEvent) => {
      prevOnClick?.(e);
      setOpen(!open.value);
    },
  });
});
</script>

<template>
  <div
    ref="rootRef"
    class="ui-popover"
    @mouseenter="onRootEnter"
    @mouseleave="onRootLeave"
    @focusin="onFocusIn"
    @focusout="onFocusOut"
    @keydown="onKeyDown"
  >
    <component :is="triggerNode" />
    <div
      class="ui-popover-panel"
      :id="popId"
      role="dialog"
      :aria-label="ariaLabel"
      :hidden="!open"
    >
      <slot name="content" />
    </div>
  </div>
</template>
