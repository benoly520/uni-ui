<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

type SkeletonShape = 'text' | 'circle' | 'rect';

const props = withDefaults(
  defineProps<{
    /** 占位形状 */
    shape?: SkeletonShape;
    /** 宽度（数字转 px） */
    width?: string | number;
    /** 高度（数字转 px）；text 默认 14px */
    height?: string | number;
    /** 是否显示微光动画 */
    active?: boolean;
    /** 内联样式 */
    style?: CSSProperties;
  }>(),
  { shape: 'rect', active: true },
);

function toSize(v?: string | number): string | undefined {
  if (v == null) return undefined;
  return typeof v === 'number' ? `${v}px` : v;
}

const shapeStyle = computed<CSSProperties>(() => {
  const s: CSSProperties = {};
  if (props.shape === 'circle') {
    const size = toSize(props.width ?? props.height ?? 40);
    s.width = size;
    s.height = size ?? toSize(props.height ?? 40);
    s.borderRadius = '50%';
  } else if (props.shape === 'text') {
    if (props.height != null) s.height = toSize(props.height);
    else if (!props.style?.height) s.height = '14px';
    if (props.width != null) s.width = toSize(props.width);
  } else {
    if (props.width != null) s.width = toSize(props.width);
    if (props.height != null) s.height = toSize(props.height);
  }
  return s;
});
</script>

<template>
  <div
    class="ui-skeleton"
    role="presentation"
    :data-active="active ? 'true' : 'false'"
    :style="{ ...shapeStyle, ...style }"
  ></div>
</template>
