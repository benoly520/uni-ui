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

function render(show: boolean, text: ReactNode, type: MessageType) {
  ensureMount().render(createElement(Message, { show, type, content: text }));
}

/**
 * showMessage · 命令式顶部通知（React）
 * - 单例容器挂 body，切换 .show 触发入场/退场动画
 * - duration 默认 2600ms，0 不自动关闭；重复调用重置计时器
 * - 与 Vue 版 showMessage() 行为一致
 */
export function showMessage(
  text: ReactNode,
  type: MessageType = 'info',
  duration = 2600,
): void {
  render(true, text, type);
  if (timer) clearTimeout(timer);
  if (duration > 0) {
    timer = setTimeout(() => render(false, text, type), duration);
  }
}
