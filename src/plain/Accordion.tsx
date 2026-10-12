import { resolve, signal, effect } from 'plain';
import { cx } from './_shared';
import { IconCaret } from './icons';
import type { MaybeGetter, Renderable } from './_shared';

export interface AccordionItemData {
  key: string;
  title: Renderable | (() => Renderable);
  badge?: Renderable | (() => Renderable);
  content?: Renderable | (() => Renderable);
}

export interface AccordionProps {
  items: MaybeGetter<AccordionItemData[]>;
  activeKeys?: MaybeGetter<string[]>;
  defaultActiveKeys?: MaybeGetter<string[]>;
  onChange?: (keys: string[]) => void;
  className?: MaybeGetter<string>;
  style?: MaybeGetter<string | Record<string, string>>;
  [key: string]: any;
}

let accSeq = 0;

/**
 * Accordion · 手风琴（基础）
 * 多组可同时展开；面板 maxHeight 用 effect + rAF 测量（plain JSX 无 ref）。
 */
export function Accordion(props: AccordionProps) {
  const {
    items,
    activeKeys,
    defaultActiveKeys,
    onChange,
    className,
    style,
    ...rest
  } = props;
  const uid = 'acc-' + ++accSeq;
  const isControlled = activeKeys != null;
  const inner = signal<string[]>(
    defaultActiveKeys != null ? [...(resolve(defaultActiveKeys) as string[])] : [],
  );
  const openSet = () =>
    new Set(isControlled ? (resolve(activeKeys) as string[]) || [] : inner());

  const toggle = (key: string) => {
    const set = new Set(openSet());
    if (set.has(key)) set.delete(key);
    else set.add(key);
    if (!isControlled) inner.set([...set]);
    onChange?.([...set]);
  };

  const arr = resolve(items) || [];
  return (
    <div {...rest} id={uid} class={cx('ui-accordion', resolve(className))} style={resolve(style)}>
      {arr.map((git) => {
        const item = git;
        const isOpen = () => openSet().has(item.key);
        effect(() => {
          const open = isOpen();
          requestAnimationFrame(() => {
            const root = document.getElementById(uid);
            const panel = root?.querySelector(
              '[data-key="' + item.key + '"] .ui-accordion-panel',
            ) as HTMLElement | null;
            if (panel) panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
          });
        });
        return (
          <div class={cx('ui-accordion-item', isOpen() && 'is-open')} data-key={item.key}>
            <button
              class="ui-accordion-header"
              aria-expanded={isOpen()}
              onClick={() => toggle(item.key)}
            >
              <span>{item.title}</span>
              {item.badge != null && <span class="ui-accordion-badge">{item.badge}</span>}
              <span class="ui-accordion-caret ui-icon">
                <IconCaret />
              </span>
            </button>
            <div class="ui-accordion-panel">
              <div class="ui-accordion-panel-inner">{resolve(item.content)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
