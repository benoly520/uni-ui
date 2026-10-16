import React, {
  forwardRef,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
} from 'react';
import { cx } from '../utils/cx';
import { IconCaret } from './icons';

export interface TreeData {
  /** 唯一键，受控/非受控状态都以它为标识 */
  key: string;
  /** 显示文案 */
  label: string;
  /** 右侧计数徽标（如板块成分股数） */
  count?: number;
  /** 子节点；无则为叶子 */
  children?: TreeData[];
}

export interface TreeProps {
  /** 层级数据 */
  data: TreeData[];
  /** 是否显示勾选框（金融筛选=筛入板块），默认 true */
  checkable?: boolean;
  /** 非受控：默认展开的节点 key */
  defaultExpandedKeys?: string[];
  /** 非受控：默认勾选的节点 key */
  defaultCheckedKeys?: string[];
  /** 受控：展开节点 key 列表 */
  expandedKeys?: string[];
  /** 受控：勾选节点 key 列表 */
  checkedKeys?: string[];
  onExpand?: (keys: string[], info: { key: string; expanded: boolean }) => void;
  onCheck?: (keys: string[], info: { key: string; checked: boolean }) => void;
  className?: string;
  style?: CSSProperties;
  'aria-label'?: string;
}

function parentKeys(nodes: TreeData[], acc: string[] = []): string[] {
  for (const n of nodes) {
    if (n.children?.length) {
      acc.push(n.key);
      parentKeys(n.children, acc);
    }
  }
  return acc;
}

/**
 * Tree · 行业/板块层级树（金融筛选骨架组件）
 * - 点击箭头或行折叠/展开（`is-collapsed` + `aria-expanded`）；叶子无子节点不折叠
 * - 勾选框筛入板块，勾选不触发折叠（`@click.stop`）
 * - 数据驱动、受控/非受控双模式；不携带任何样式，全部走 theme.css
 */
export const Tree = forwardRef<HTMLDivElement, TreeProps>(function Tree(
  {
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
  },
  ref,
) {
  const isExpControlled = expandedKeys != null;
  const isChkControlled = checkedKeys != null;

  const [expandedInner, setExpandedInner] = useState<string[]>(
    () => defaultExpandedKeys ?? parentKeys(data),
  );
  const [checkedInner, setCheckedInner] = useState<string[]>(
    () => defaultCheckedKeys ?? [],
  );

  const expanded = isExpControlled ? (expandedKeys as string[]) : expandedInner;
  const checked = isChkControlled ? (checkedKeys as string[]) : checkedInner;

  const expandedSet = useMemo(() => new Set(expanded), [expanded]);
  const checkedSet = useMemo(() => new Set(checked), [checked]);

  const toggleExpand = useCallback(
    (key: string) => {
      const isOpen = expandedSet.has(key);
      const next = isOpen
        ? expanded.filter((k) => k !== key)
        : [...expanded, key];
      if (!isExpControlled) setExpandedInner(next);
      onExpand?.(next, { key, expanded: !isOpen });
    },
    [expanded, expandedSet, isExpControlled, onExpand],
  );

  const toggleCheck = useCallback(
    (key: string) => {
      const isOn = checkedSet.has(key);
      const next = isOn ? checked.filter((k) => k !== key) : [...checked, key];
      if (!isChkControlled) setCheckedInner(next);
      onCheck?.(next, { key, checked: !isOn });
    },
    [checked, checkedSet, isChkControlled, onCheck],
  );

  const renderNode = (node: TreeData): React.ReactNode => {
    const hasChildren = !!node.children?.length;
    const isOpen = expandedSet.has(node.key);
    const isOn = checkedSet.has(node.key);
    return (
      <li
        key={node.key}
        className={cx(
          'ui-tree-node',
          !hasChildren && 'ui-tree-leaf',
          !isOpen && 'is-collapsed',
        )}
        role="treeitem"
        aria-expanded={hasChildren ? isOpen : undefined}
      >
        <div
          className="ui-tree-row"
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('.ui-tree-check')) return;
            if (hasChildren) toggleExpand(node.key);
          }}
        >
          <span
            className="ui-tree-caret ui-icon"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) toggleExpand(node.key);
            }}
          >
            <IconCaret strokeWidth={2.4} />
          </span>
          {checkable && (
            <input
              type="checkbox"
              className="ui-tree-check"
              checked={isOn}
              aria-label={`选择 ${node.label}`}
              onChange={() => toggleCheck(node.key)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
          <span className="ui-tree-label">{node.label}</span>
          {node.count != null && (
            <span className="ui-tree-count">{node.count}</span>
          )}
        </div>
        {hasChildren && isOpen && (
          <ul className="ui-tree-children">
            {node.children!.map(renderNode)}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={cx('ui-tree', className)} style={style} ref={ref} role="tree" aria-label={ariaLabel}>
      <ul className="ui-tree-children">{data.map(renderNode)}</ul>
    </div>
  );
});
