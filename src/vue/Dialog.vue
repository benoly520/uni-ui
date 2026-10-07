<script setup lang="ts">
import { ref, watch, onBeforeUnmount, type CSSProperties, type VNode } from 'vue';

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

watch(
  () => props.open,
  (open) => {
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
      escHandler = (e: KeyboardEvent) => {
        if (e.key === 'Escape') emit('open-change', false);
      };
      document.addEventListener('keydown', escHandler);
    } else {
      overlay.setAttribute('inert', '');
      overlay.setAttribute('aria-hidden', 'true');
      lastFocus?.focus?.();
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  if (escHandler) document.removeEventListener('keydown', escHandler);
});

const slots = defineSlots<{ default?: () => VNode[]; footer?: () => VNode[] }>();
const labelText = () =>
  props.ariaLabel ?? (typeof props.title === 'string' ? props.title : '对话框');
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
      <h3 v-if="title != null">{{ title }}</h3>
      <slot />
      <div v-if="$slots.footer || footer != null" class="ui-dialog-actions">
        <slot name="footer">{{ footer }}</slot>
      </div>
    </div>
  </div>
</template>
