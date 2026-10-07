import { createElement, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { Toast } from './Toast';

export interface ToastOptions {
  /** 前置图标插槽（24×24 + currentColor） */
  icon?: ReactNode;
  /** 自动关闭时长 ms；0 = 不自动关闭 */
  duration?: number;
}

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

function render(show: boolean, content: ReactNode, icon?: ReactNode) {
  ensureMount().render(
    createElement(Toast, { show, content, icon }),
  );
}

/**
 * toast · 命令式轻提示（React）
 * - 单例容器挂 body，切换 .show 触发入场/退场动画
 * - duration 默认 2400ms，0 不自动关闭；重复调用重置计时器
 * - 与 Vue 版 toast() 行为一致
 */
export function toast(content: ReactNode, options?: ToastOptions): void {
  const duration = options?.duration ?? 2400;
  render(true, content, options?.icon);
  if (timer) clearTimeout(timer);
  if (duration > 0) {
    timer = setTimeout(() => render(false, content, options?.icon), duration);
  }
}
