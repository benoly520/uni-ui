import { createElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Message, type MessageType } from './Message';

let container: HTMLDivElement | null = null;
let root: Root | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function ensureMount(): Root {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  }
  return root!;
}

function render(show: boolean, text: ReactNode, type: MessageType, glass?: boolean) {
  ensureMount().render(createElement(Message, { show, type, content: text, glass }));
}

/**
 * showMessage · 命令式顶部通知（React）
 * - 单例容器挂 body，切换 .show 触发入场/退场动画
 * - duration 默认 2600ms，0 不自动关闭；重复调用重置计时器
 * - glass 传 false 可回退为不透明实心面（默认 true）
 * - 与 Vue 版 showMessage() 行为一致
 */
export function showMessage(
  text: ReactNode,
  type: MessageType = 'info',
  duration = 2600,
  glass?: boolean,
): void {
  render(true, text, type, glass);
  if (timer) clearTimeout(timer);
  if (duration > 0) {
    timer = setTimeout(() => render(false, text, type, glass), duration);
  }
}
