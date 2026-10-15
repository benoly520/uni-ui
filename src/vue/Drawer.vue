<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, type VNode } from 'vue';

type DrawerSide = 'right' | 'left' | 'bottom';

const props = withDefaults(
  defineProps<{
    /** 受控打开状态 */
    open: boolean;
    /** 滑出方向：right（默认）/ left / bottom */
    side?: DrawerSide;
    /** 标题 */
    title?: unknown;
    /** 副标题（位于标题下方 .ui-label） */
    subtitle?: unknown;
    /** 是否显示关闭按钮（header 内） */
    showClose?: boolean;
    /** 无障碍标签（默认取 title 或 '抽屉'） */
    ariaLabel?: string;
    /** 点击遮罩是否关闭 */
    closeOnOverlay?: boolean;
  }>(),
  {
    side: 'right',
    showClose: true,
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
    escHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') emit('open-change', false);
    };
    document.addEventListener('keydown', escHandler);
  } else {
    overlay.setAttribute('inert', '');
    overlay.setAttribute('aria-hidden', 'true');
    lastFocus?.focus?.();
  }
}

watch(() => props.open, applyOpen, { immediate: true });
// immediate 回调在模板 ref 绑定时执行（此时 overlayRef 仍为 null），故挂载后需再同步一次初始关闭态
onMounted(() => applyOpen(props.open));

onBeforeUnmount(() => {
  if (escHandler) document.removeEventListener('keydown', escHandler);
});

const slots = defineSlots<{ default?: () => VNode[] }>();
const labelText = () =>
  props.ariaLabel ?? (typeof props.title === 'string' ? props.title : '抽屉');
</script>

<template>
  <div
    ref="overlayRef"
    class="ui-drawer-overlay"
    :class="{ show: open }"
    role="presentation"
    :aria-hidden="open ? undefined : true"
    @mousedown="onOverlayMouseDown"
    @keydown="onKeyDown"
  >
    <aside
      class="ui-drawer ui-glass"
      :class="side !== 'right' && `ui-drawer--${side}`"
      role="dialog"
      aria-modal="true"
      :aria-label="labelText()"
    >
      <header v-if="title != null || showClose">
        <div>
          <div v-if="title != null" class="ui-drawer-title">{{ title }}</div>
          <div v-if="subtitle != null" class="ui-label">{{ subtitle }}</div>
        </div>
        <button
          v-if="showClose"
          class="ui-btn ui-btn--ghost ui-size-sm"
          aria-label="关闭"
          type="button"
          @click="emit('open-change', false)"
        >
          ✕
        </button>
      </header>
      <div class="body">
        <slot />
      </div>
    </aside>
  </div>
</template>
