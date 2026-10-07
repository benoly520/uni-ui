<script setup lang="ts">
import { computed } from 'vue';
import type { TreeData } from './tree-types';

const props = defineProps<{
  node: TreeData;
  expanded: string[];
  checked: string[];
  checkable: boolean;
  onExpand: (key: string) => void;
  onCheck: (key: string) => void;
}>();

const hasChildren = computed(() => !!props.node.children?.length);
const isExpanded = computed(() => props.expanded.includes(props.node.key));
const isChecked = computed(() => props.checked.includes(props.node.key));

function onRowClick(e: MouseEvent) {
  if ((e.target as HTMLElement).closest('.ui-tree-check')) return;
  if (hasChildren.value) props.onExpand(props.node.key);
}
function onCaretClick() {
  if (hasChildren.value) props.onExpand(props.node.key);
}
function onCheckClick() {
  props.onCheck(props.node.key);
}
</script>

<template>
  <li
    :class="[
      'ui-tree-node',
      !hasChildren && 'ui-tree-leaf',
      !isExpanded && 'is-collapsed',
    ]"
    role="treeitem"
    :aria-expanded="hasChildren ? isExpanded : undefined"
  >
    <div class="ui-tree-row" @click="onRowClick">
      <span class="ui-tree-caret ui-icon" @click.stop="onCaretClick">
        <svg v-if="hasChildren" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </span>
      <input
        v-if="checkable"
        type="checkbox"
        class="ui-tree-check"
        :checked="isChecked"
        :aria-label="`选择 ${node.label}`"
        @change="onCheckClick"
        @click.stop
      />
      <span class="ui-tree-label">{{ node.label }}</span>
      <span v-if="node.count != null" class="ui-tree-count">{{ node.count }}</span>
    </div>
    <ul v-if="hasChildren && isExpanded" class="ui-tree-children">
      <TreeNode
        v-for="c in node.children"
        :key="c.key"
        :node="c"
        :expanded="expanded"
        :checked="checked"
        :checkable="checkable"
        :on-expand="onExpand"
        :on-check="onCheck"
      />
    </ul>
  </li>
</template>
