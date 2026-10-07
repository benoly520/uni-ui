<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import TreeNode from './TreeNode.vue';
import type { TreeData } from './tree-types';

const props = withDefaults(
  defineProps<{
    data: TreeData[];
    /** 是否显示勾选框（金融筛选=筛入板块），默认 true */
    checkable?: boolean;
    defaultExpandedKeys?: string[];
    defaultCheckedKeys?: string[];
    /** 受控：展开节点 key 列表 */
    expandedKeys?: string[];
    /** 受控：勾选节点 key 列表 */
    checkedKeys?: string[];
  }>(),
  {
    checkable: true,
    defaultExpandedKeys: () => [],
    defaultCheckedKeys: () => [],
  },
);

const emit = defineEmits<{
  (e: 'expand', keys: string[], info: { key: string; expanded: boolean }): void;
  (e: 'check', keys: string[], info: { key: string; checked: boolean }): void;
}>();

function collectParentKeys(nodes: TreeData[], acc: string[] = []): string[] {
  for (const n of nodes) {
    if (n.children?.length) {
      acc.push(n.key);
      collectParentKeys(n.children, acc);
    }
  }
  return acc;
}

const isExpControlled = computed(() => props.expandedKeys != null);
const isChkControlled = computed(() => props.checkedKeys != null);

const expanded = ref<string[]>(props.defaultExpandedKeys.length ? props.defaultExpandedKeys.slice() : collectParentKeys(props.data));
const checked = ref<string[]>(props.defaultCheckedKeys.slice());

watch(
  () => props.expandedKeys,
  (v) => {
    if (v) expanded.value = v.slice();
  },
  { deep: true },
);
watch(
  () => props.checkedKeys,
  (v) => {
    if (v) checked.value = v.slice();
  },
  { deep: true },
);

function toggleExpand(key: string) {
  const isOpen = expanded.value.includes(key);
  const next = isOpen
    ? expanded.value.filter((k) => k !== key)
    : [...expanded.value, key];
  if (!isExpControlled.value) expanded.value = next;
  emit('expand', next, { key, expanded: !isOpen });
}
function toggleCheck(key: string) {
  const isOn = checked.value.includes(key);
  const next = isOn ? checked.value.filter((k) => k !== key) : [...checked.value, key];
  if (!isChkControlled.value) checked.value = next;
  emit('check', next, { key, checked: !isOn });
}

defineExpose({ expandedKeys: expanded, checkedKeys: checked });
</script>

<template>
  <div class="ui-tree" role="tree">
    <ul class="ui-tree-children">
      <TreeNode
        v-for="node in data"
        :key="node.key"
        :node="node"
        :expanded="expanded"
        :checked="checked"
        :checkable="checkable"
        :on-expand="toggleExpand"
        :on-check="toggleCheck"
      />
    </ul>
  </div>
</template>
