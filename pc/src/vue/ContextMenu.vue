<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';

interface ContextMenuItem {
  key: string;
  label: unknown;
  shortcut?: string;
  danger?: boolean;
  separator?: boolean;
}

const props = withDefaults(
  defineProps<{
    /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
    glass?: boolean;
    items: ContextMenuItem[];
    targetRef: Ref<HTMLElement | null>;
    open?: boolean;
    defaultOpen?: boolean;
    ariaLabel?: string;
  }>(),
  {
    glass: true,
    open: undefined,
    defaultOpen: false,
    ariaLabel: '操作菜单',
  },
);

const emit = defineEmits<{
  (e: 'open-change', open: boolean): void;
  (e: 'select', key: string): void;
}>();

const isControlled = computed(() => props.open != null);
const innerOpen = ref(props.defaultOpen);
const isOpen = computed(() => (isControlled.value ? (props.open as boolean) : innerOpen.value));
const pos = ref({ x: 0, y: 0 });
const menuRef = ref<HTMLElement | null>(null);

function setOpen(next: boolean) {
  if (!isControlled.value) innerOpen.value = next;
  emit('open-change', next);
}

function openAt(x: number, y: number) {
  pos.value = { x, y };
  setOpen(true);
}

let onCtx: ((e: MouseEvent) => void) | null = null;
let onDoc: ((e: MouseEvent) => void) | null = null;
let onKey: ((e: KeyboardEvent) => void) | null = null;

onMounted(() => {
  const target = props.targetRef?.value;
  if (target) {
    onCtx = (e: MouseEvent) => {
      e.preventDefault();
      openAt(e.clientX, e.clientY);
    };
    target.addEventListener('contextmenu', onCtx);
  }
});

watch(isOpen, (o) => {
  if (o) {
    onDoc = (e: MouseEvent) => {
      if (menuRef.value && !menuRef.value.contains(e.target as Node)) setOpen(false);
    };
    onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
  } else {
    if (onDoc) document.removeEventListener('mousedown', onDoc);
    if (onKey) document.removeEventListener('keydown', onKey);
  }
});

watch(
  () => [isOpen.value, pos.value, props.items],
  () => {
    if (!isOpen.value || !menuRef.value) return;
    const r = menuRef.value.getBoundingClientRect();
    let px = pos.value.x;
    let py = pos.value.y;
    if (px + r.width > window.innerWidth) px = px - r.width;
    if (py + r.height > window.innerHeight) py = py - r.height;
    pos.value = { x: px, y: py };
  },
  { deep: true },
);

onBeforeUnmount(() => {
  const target = props.targetRef?.value;
  if (target && onCtx) target.removeEventListener('contextmenu', onCtx);
  if (onDoc) document.removeEventListener('mousedown', onDoc);
  if (onKey) document.removeEventListener('keydown', onKey);
});
</script>

<template>
  <div
    :data-glass="glass === false ? 'off' : undefined"
    ref="menuRef"
    :class="['ui-contextmenu', isOpen && 'is-open']"
    role="menu"
    :aria-label="ariaLabel"
    :style="{ left: pos.x + 'px', top: pos.y + 'px' }"
  >
    <template v-for="it in items" :key="it.key">
      <div v-if="it.separator" class="ui-contextmenu-sep" />
      <div
        v-else
        :class="['ui-contextmenu-item', it.danger && 'is-danger']"
        role="menuitem"
        :data-key="it.key"
        @click="() => { emit('select', it.key); setOpen(false); }"
      >
        <span>{{ it.label }}</span>
        <span v-if="it.shortcut != null" class="ui-contextmenu-shortcut">{{ it.shortcut }}</span>
      </div>
    </template>
  </div>
</template>
