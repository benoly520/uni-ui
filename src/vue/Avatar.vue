<script setup lang="ts">
import { computed } from 'vue';

type AvatarTone = 'brand' | 'danger' | 'success' | 'warning' | 'info';
type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | number;

const props = withDefaults(
  defineProps<{
    /** 图片头像（优先）；存在时忽略 text / icon */
    src?: string;
    /** 图片替代文本（无障碍） */
    alt?: string;
    /** 文字头像（首字母/文字） */
    text?: string;
    /** 图标头像节点（24×24 + currentColor） */
    icon?: unknown;
    /** 尺寸：预设档或自定义像素 */
    size?: AvatarSize;
    /** 文字/图标头像底色（token 驱动） */
    tone?: AvatarTone;
    ariaLabel?: string;
  }>(),
  {
    size: 'md',
    tone: 'brand',
  },
);

const SIZE_PX: Record<'xs' | 'sm' | 'md' | 'lg', number> = { xs: 24, sm: 28, md: 32, lg: 40 };
function pxOf(size: AvatarSize): number {
  if (typeof size === 'number') return size;
  return SIZE_PX[size] ?? 32;
}

const px = computed(() => pxOf(props.size));
const fs = computed(() => Math.round(px.value * 0.4));
const rootStyle = computed(() => ({
  width: `${px.value}px`,
  height: `${px.value}px`,
  fontSize: `${fs.value}px`,
  background: `var(--ui-color-${props.tone})`,
}));
</script>

<template>
  <span class="ui-avatar" :style="rootStyle" :aria-label="ariaLabel">
    <img
      v-if="src"
      class="ui-avatar-img"
      :src="src"
      :alt="alt ?? ''"
      style="width:100%;height:100%;borderRadius:50%;objectFit:cover;"
    />
    <template v-else>
      <span v-if="icon != null" class="ui-icon"><component :is="icon" /></span>
      <template v-else>{{ text }}</template>
    </template>
  </span>
</template>
