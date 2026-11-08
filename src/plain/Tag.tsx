import { cx } from './_shared';
import type { Renderable } from './_shared';

/** 关闭按钮内联样式：与 React / Vue 端保持一致（.ui-tag-close 无 theme.css 规则） */
const CLOSE_STYLE = {
  border: 'none',
  background: 'transparent',
  color: 'currentColor',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0',
  marginLeft: '2px',
  fontSize: 'inherit',
  lineHeight: '1',
};

export type TagType = 'brand' | 'up' | 'down' | 'default';

export interface TagProps {
  /** 玻璃材质开关：false 时根节点输出 data-glass="off"，由 theme.css 回退为不透明实心面；默认 true 保持既有磨砂观感 */
  glass?: boolean;
  type?: TagType;
  closable?: boolean;
  color?: string;
  icon?: Renderable;
  onClose?: () => void;
  className?: string;
  style?: string | Record<string, string>;
  id?: string;
  /** lazy subtree：运行时是 thunk，显式调用 props.children() */
  children?: any;
}

/** 合并 color 覆盖 + 透传 style（作为 JSX 属性表达式，编译器自动按依赖重跑） */
function tagStyle(color: any, style: any): any {
  if (color) return { color, borderColor: color, ...(style || {}) };
  return style;
}

/**
 * Tag · 标签（基础）
 * 语义类型 brand/up/down/default；closable 渲染关闭按钮；color 覆盖 type 配色。
 */
export function Tag(props: TagProps) {
  const type = () => props.type ?? 'default';
  const closable = () => props.closable ?? false;
  return (
    <span
      data-glass={props.glass === false ? 'off' : undefined}
      id={props.id}
      class={cx(
        'ui-tag',
        type() !== 'default' && 'ui-tag--' + type(),
        closable() && 'ui-tag--closable',
        props.className,
      )}
      style={tagStyle(props.color, props.style)}
    >
      {props.icon != null && <span class="ui-icon">{props.icon}</span>}
      {props.children?.()}
      {closable() && (
        <button
          type="button"
          class="ui-tag-close"
          aria-label="关闭"
          style={CLOSE_STYLE}
          onClick={() => props.onClose?.()}
        >
          <span aria-hidden="true">×</span>
        </button>
      )}
    </span>
  );
}
