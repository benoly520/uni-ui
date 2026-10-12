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
  [key: string]: any;
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
  const {
    data,
    checkable = true,
    defaultExpandedKeys,
    defaultCheckedKeys,
    expandedKeys,
    checkedKeys,
    onExpand,
    onCheck,
    className,
    style,
    'aria-label': ariaLabel = '树',
    ...rest
  } = props;

  const expControlled = expandedKeys != null;
  const expInner = signal<string[]>(
    expControlled
      ? [...(resolve(expandedKeys) as string[])]
      : defaultExpandedKeys != null
        ? [...(resolve(defaultExpandedKeys) as string[])]
        : allParentKeys(resolve(data) as TreeData[]),
  );
  const expSet = () =>
    new Set(expControlled ? (resolve(expandedKeys) as string[]) || [] : expInner());

  const chkControlled = checkedKeys != null;
  const chkInner = signal<string[]>(
    chkControlled
      ? [...(resolve(checkedKeys) as string[])]
      : defaultCheckedKeys != null
        ? [...(resolve(defaultCheckedKeys) as string[])]
        : [],
  );
  const chkSet = () =>
    new Set(chkControlled ? (resolve(checkedKeys) as string[]) || [] : chkInner());

  const toggleExpand = (node: TreeData) => {
    const set = new Set(expSet());
    const wasOpen = set.has(node.key);
    if (wasOpen) set.delete(node.key);
    else set.add(node.key);
    if (!expControlled) expInner.set([...set]);
    onExpand?.([...set], { key: node.key, expanded: !wasOpen });
  };
  const toggleCheck = (node: TreeData) => {
    const set = new Set(chkSet());
    const wasOn = set.has(node.key);
    if (wasOn) set.delete(node.key);
    else set.add(node.key);
    if (!chkControlled) chkInner.set([...set]);
    onCheck?.([...set], { key: node.key, checked: !wasOn });
  };

  const renderNode = (node: TreeData) => {
    const hasChildren = !!(node.children && node.children.length);
    const isOpen = () => expSet().has(node.key);
    const isOn = () => chkSet().has(node.key);
    const ariaExpanded = () => (!hasChildren ? undefined : isOpen() ? 'true' : 'false');
    return (
      <li
        class={cx('ui-tree-node', !hasChildren && 'ui-tree-leaf', !isOpen() && 'is-collapsed')}
        role="treeitem"
        aria-expanded={ariaExpanded()}
      >
        <div
          class="ui-tree-row"
          onClick={(e: MouseEvent) => {
            if ((e.target as HTMLElement).closest('.ui-tree-check')) return;
            if (hasChildren) toggleExpand(node);
          }}
        >
          <span
            class="ui-tree-caret ui-icon"
            onClick={(e: MouseEvent) => {
              e.stopPropagation();
              if (hasChildren) toggleExpand(node);
            }}
          >
            <IconCaret />
          </span>
          {resolve(checkable) && (
            <input
              class="ui-tree-check"
              type="checkbox"
              checked={isOn()}
              aria-label={'选择 ' + node.label}
              onClick={(e: MouseEvent) => e.stopPropagation()}
              onChange={() => toggleCheck(node)}
            />
          )}
          <span class="ui-tree-label">{node.label}</span>
          {node.count != null && <span class="ui-tree-count">{'' + node.count}</span>}
        </div>
        {hasChildren && isOpen() && (
          <ul class="ui-tree-children">
            {(node.children || []).map((gc) => renderNode(gc))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div
      {...rest}
      class={cx('ui-tree', resolve(className))}
      role="tree"
      aria-label={resolve(ariaLabel)}
      style={resolve(style)}
    >
      <ul class="ui-tree-children">
        {(resolve(data) as TreeData[]).map((gn) => renderNode(gn))}
      </ul>
    </div>
  );
}
