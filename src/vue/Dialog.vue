<script setup lang="ts">
import { computed, ref, watch, onMounted, onBeforeUnmount, type VNode } from 'vue';

const props = withDefaults(
  defineProps<{
    /** 受控打开状态 */
    open: boolean;
    /** 标题，渲染为面板内 <h3>，并作默认 aria-label */
    title?: unknown;
    /** 无障碍标签（默认取 title 或 '对话框'） */
    ariaLabel?: string;
    /** 点击遮罩是否关闭 */
    closeOnOverlay?: boolean;
    /** 底部操作区（按钮组），亦可用 footer 插槽 */
    footer?: unknown;
  }>(),
  {
    closeOnOverlay: true,
  },
);

const emit = defineEmits<{
  (e: 'open-change', open: boolean): void;
}>();

const overlayRef = ref<HTMLElement | null>(null);
let lastFocus: HTMLElement | null = null;

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function focusables(): HTMLElement[] {
  const root = overlayRef.value;
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.hasAttribute('disabled'),
  );
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key !== 'Tab') return;
  const f = focusables();
  if (!f.length) return;
  const first = f[0];
  const last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function onOverlayMouseDown(e: MouseEvent) {
  if (props.closeOnOverlay && e.target === overlayRef.value) emit('open-change', false);
}

let escHandler: ((e: KeyboardEvent) => void) | null = null;

function applyOpen(open: boolean) {
  const overlay = overlayRef.value;
  if (!overlay) return;
  if (open) {
    lastFocus = document.activeElement as HTMLElement | null;
    overlay.removeAttribute('inert');
    overlay.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => {
      const f = focusables();
      (f[0] ?? overlay).focus();
    });
    // 先摘旧监听：immediate 与 onMounted 可能对同一开态调用两次，避免重复累积
    if (escHandler) document.removeEventListener('keydown', escHandler);
    escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') emit('open-change', false);
    };
    document.addEventListener('keydown', escHandler);
  } else {
    overlay.setAttribute('inert', '');
    overlay.setAttribute('aria-hidden', 'true');
    // 关闭时同步摘除 Esc 监听，否则反复开合会累积（onBeforeUnmount 只能摘到最后一个引用）
    if (escHandler) {
      document.removeEventListener('keydown', escHandler);
      escHandler = null;
    }
    lastFocus?.focus?.();
  }
}

watch(() => props.open, applyOpen, { immediate: true });
// immediate 回调在模板 ref 绑定时执行（此时 overlayRef 仍为 null），故挂载后需再同步一次初始关闭态
onMounted(() => applyOpen(props.open));

onBeforeUnmount(() => {
  if (escHandler) document.removeEventListener('keydown', escHandler);
});

const slots = defineSlots<{ default?: () => VNode[]; footer?: () => VNode[] }>();
const labelText = () =>
  props.ariaLabel ?? (typeof props.title === 'string' ? props.title : '对话框');

/**
 * footer / title 允许直接传 VNode（与 React 端 footer={<Button/>} 等价）。
 * 不能用 {{ footer }} 插值：toDisplayString 会对 VNode 做 JSON.stringify，触发
 * "Converting circular structure to JSON"（VNode.component.vnode 自引用）。
 */
const renderFooter = () => props.footer as VNode;
const renderTitle = () => props.title as VNode;
const titleIsNode = computed(
  () => typeof props.title === 'object' || typeof props.title === 'function',
);
</script>

<template>
  <div
    ref="overlayRef"
    class="ui-overlay"
    :class="{ show: open }"
    role="presentation"
    :aria-hidden="open ? undefined : true"
    @mousedown="onOverlayMouseDown"
    @keydown="onKeyDown"
  >
    <div
      class="ui-dialog ui-glass"
      role="dialog"
      aria-modal="true"
      :aria-label="labelText()"
    >
      <h3 v-if="title != null">
        <component :is="renderTitle" v-if="titleIsNode" />
        <template v-else>{{ title }}</template>
      </h3>
      <slot />
      <div v-if="$slots.footer || footer != null" class="ui-dialog-actions">
        <slot name="footer">
          <component :is="renderFooter" />
        </slot>
      </div>
    </div>
  </div>
</template>
