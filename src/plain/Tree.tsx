import { resolve, signal } from 'plain';
import { cx } from './_shared';
import { IconCaret } from './icons';
import type { MaybeGetter } from './_shared';

export interface TreeData {
  key: string;
  label: string;
  count?: number;
  children?: TreeData[];
}

export interface TreeProps {
  data: MaybeGetter<TreeData[]>;
  checkable?: MaybeGetter<boolean>;
  defaultExpandedKeys?: MaybeGetter<string[]>;
  defaultCheckedKeys?: MaybeGetter<string[]>;
  expandedKeys?: MaybeGetter<string[]>;
  checkedKeys?: MaybeGetter<string[]>;
  onExpand?: (keys: string[], info: { key: string; expanded: boolean }) => void;
  onCheck?: (keys: string[], info: { key: string; checked: boolean }) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  'aria-label'?: MaybeGetter<string>;
  id?: MaybeGetter<string>;
}

function allParentKeys(nodes: any[], acc: string[] = []): string[] {
  (nodes || []).forEach((n) => {
    if (n.children && n.children.length) {
      acc.push(n.key);
      allParentKeys(n.children, acc);
    }
  });
  return acc;
}

/**
 * Tree · 树（数据）
 * 层级展示 / 勾选；展开、勾选均支持受控与默认态；勾选不触发折叠。
 */
export function Tree(props: TreeProps) {
  const checkable = () => resolve(props.checkable) ?? true;
  // 受控 / 非受控模式在挂载时确定（与 React 一致：prop != null 即为受控）
  const expControlled = resolve(props.expandedKeys) != null;
  const chkControlled = resolve(props.checkedKeys) != null;

  const expInner = signal<string[]>(
    expControlled
      ? [...(resolve(props.expandedKeys) as string[])]
      : props.defaultExpandedKeys != null
        ? [...(resolve(props.defaultExpandedKeys) as string[])]
        : allParentKeys(resolve(props.data) as TreeData[]),
  );
  const expSet = () =>
    new Set(expControlled ? (resolve(props.expandedKeys) as string[]) || [] : expInner());

  const chkInner = signal<string[]>(
    chkControlled
      ? [...(resolve(props.checkedKeys) as string[])]
      : props.defaultCheckedKeys != null
        ? [...(resolve(props.defaultCheckedKeys) as string[])]
        : [],
  );
  const chkSet = () =>
    new Set(chkControlled ? (resolve(props.checkedKeys) as string[]) || [] : chkInner());

  const toggleExpand = (node: TreeData) => {
    const set = new Set(expSet());
    const wasOpen = set.has(node.key);
    if (wasOpen) set.delete(node.key);
    else set.add(node.key);
    if (!expControlled) expInner.set([...set]);
    props.onExpand?.([...set], { key: node.key, expanded: !wasOpen });
  };
  const toggleCheck = (node: TreeData) => {
    const set = new Set(chkSet());
    const wasOn = set.has(node.key);
    if (wasOn) set.delete(node.key);
    else set.add(node.key);
    if (!chkControlled) chkInner.set([...set]);
    props.onCheck?.([...set], { key: node.key, checked: !wasOn });
  };

  // 说明：renderNode 是被当作「子组件」对待的（命名函数返回 JSX），其入参 node
  // 被视为 props，故所有属性读取都用 resolve(node.x)（同组件 props 的读法）。
  const renderNode = (node: TreeData) => {
    const label = () => resolve(node.label);
    const key = () => resolve(node.key);
    const count = () => resolve(node.count);
    const children = () => resolve(node.children);
    const hasChildren = () => !!(children() && children()!.length);
    const isOpen = () => expSet().has(key());
    const isOn = () => chkSet().has(key());
    const ariaExpanded = () => (!hasChildren() ? undefined : isOpen() ? 'true' : 'false');
    return (
      <li
        class={cx('ui-tree-node', !hasChildren() && 'ui-tree-leaf', !isOpen() && 'is-collapsed')}
        role="treeitem"
        aria-expanded={ariaExpanded()}
      >
        <div
          class="ui-tree-row"
          onClick={(e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('.ui-tree-check')) return;
            if (hasChildren()) toggleExpand(node);
          }}
        >
          <span
            class="ui-tree-caret ui-icon"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              if (hasChildren()) toggleExpand(node);
            }}
          >
            <IconCaret strokeWidth={2.4} />
          </span>
          {checkable() && (
            <input
              class="ui-tree-check"
              type="checkbox"
              checked={isOn()}
              aria-label={'选择 ' + label()}
              onClick={(e: MouseEvent) => e.stopPropagation()}
              onChange={() => toggleCheck(node)}
            />
          )}
          <span class="ui-tree-label">{label()}</span>
          {count() != null && <span class="ui-tree-count">{'' + count()}</span>}
        </div>
        {hasChildren() && isOpen() && (
          <ul class="ui-tree-children">
            {(children() || []).map((gc) => renderNode(gc))}
          </ul>
        )}
      </li>
    );
  };

  const ariaLabel = () => resolve(props['aria-label']) ?? '树';

  return (
    <div
      id={resolve(props.id)}
      class={cx('ui-tree', resolve(props.className))}
      role="tree"
      aria-label={ariaLabel()}
      style={resolve(props.style)}
    >
      <ul class="ui-tree-children">
        {(resolve(props.data) as TreeData[]).map((gn) => renderNode(gn))}
      </ul>
    </div>
  );
}
