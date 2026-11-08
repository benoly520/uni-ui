import { signal } from 'plain';
import { cx } from './_shared';
import { IconCaret } from './icons';

export interface TreeData {
  key: string;
  label: string;
  count?: number;
  children?: TreeData[];
}

export interface TreeProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  data: TreeData[];
  checkable?: boolean;
  defaultExpandedKeys?: string[];
  defaultCheckedKeys?: string[];
  expandedKeys?: string[];
  checkedKeys?: string[];
  onExpand?: (keys: string[], info: { key: string; expanded: boolean }) => void;
  onCheck?: (keys: string[], info: { key: string; checked: boolean }) => void;
  className?: string;
  style?: string | Record<string, string>;
  'aria-label'?: string;
  id?: string;
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
  const checkable = () => props.checkable ?? true;
  // 受控 / 非受控模式在挂载时确定（与 React 一致：prop != null 即为受控）
  const expControlled = props.expandedKeys != null;
  const chkControlled = props.checkedKeys != null;

  const expInner = signal<string[]>(
    expControlled
      ? [...(props.expandedKeys as string[])]
      : props.defaultExpandedKeys != null
        ? [...(props.defaultExpandedKeys as string[])]
        : allParentKeys(props.data as TreeData[]),
  );
  const expSet = () =>
    new Set(expControlled ? (props.expandedKeys as string[]) || [] : expInner());

  const chkInner = signal<string[]>(
    chkControlled
      ? [...(props.checkedKeys as string[])]
      : props.defaultCheckedKeys != null
        ? [...(props.defaultCheckedKeys as string[])]
        : [],
  );
  const chkSet = () =>
    new Set(chkControlled ? (props.checkedKeys as string[]) || [] : chkInner());

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
  // 是普通数据对象，属性直接读 node.x。
  const renderNode = (node: TreeData) => {
    const label = () => node.label;
    const key = () => node.key;
    const count = () => node.count;
    const children = () => node.children;
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

  const ariaLabel = () => props['aria-label'] ?? '树';

  return (
    <div
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx('ui-tree', props.className)}
      role="tree"
      aria-label={ariaLabel()}
      style={props.style}
    >
      <ul class="ui-tree-children">
        {(props.data as TreeData[]).map((gn) => renderNode(gn))}
      </ul>
    </div>
  );
}
