<script setup lang="ts">
import { type CSSProperties, type VNode } from 'vue';

type TagType = 'brand' | 'up' | 'down' | 'default';

withDefaults(
  defineProps<{
    /** 语义类型（default 无修饰类） */
    type?: TagType;
    /** 可关闭：渲染关闭按钮并发出 close */
    closable?: boolean;
    /** 自定义色（覆盖 type）：同时写 color + border-color */
    color?: string;
    /** 图标插槽（24×24 + currentColor），置于文本前 */
    icon?: unknown;
  }>(),
  { type: 'default', closable: false, color: '', icon: undefined },
);

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const closeStyle: CSSProperties = {
  border: 'none',
  background: 'transparent',
  color: 'currentColor',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  padding: 0,
  marginLeft: '2px',
  fontSize: 'inherit',
  lineHeight: 1,
};
</script>

<template>
  <span
    class="ui-tag"
    :class="[type !== 'default' && `ui-tag--${type}`, closable && 'ui-tag--closable']"
    :style="color ? { color, borderColor: color } : undefined"
  >
    <span v-if="icon != null" class="ui-icon"><component :is="icon as VNode" /></span>
    <slot />
    <button v-if="closable" type="button" class="ui-tag-close" aria-label="关闭" :style="closeStyle" @click="emit('close')">
      <span aria-hidden="true">×</span>
    </button>
  </span>
</template>
