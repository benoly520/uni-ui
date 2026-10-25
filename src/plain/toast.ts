import { signal, mount } from 'plain';
import { Toast } from './Toast';

export interface ToastOptions {
  /** 前置图标插槽（24×24 + currentColor） */
  icon?: any;
  /** 自动关闭时长 ms；0 = 不自动关闭 */
  duration?: number;
  /** 玻璃材质开关：false 时回退为不透明实心面（默认 true） */
  glass?: boolean;
}

let container: HTMLElement | null = null;
const showS = signal(false);
const contentS = signal<any>('');
const iconS = signal<any>(undefined);
const glassS = signal(true);
let timer: ReturnType<typeof setTimeout> | null = null;

function ensureMount(): void {
  if (container) return;
  container = document.createElement('div');
  document.body.appendChild(container);
  mount(container, () =>
    Toast({
      show: () => showS(),
      content: () => contentS(),
      icon: () => iconS(),
      glass: () => glassS(),
    }),
  );
}

/**
 * toast · 命令式轻提示（Plain）
 * - 单例容器挂 body，切换 .show 触发入场/退场动画
 * - duration 默认 2400ms，0 不自动关闭；重复调用重置计时器
 * - 与 React / Vue 版 toast() 行为一致
 */
export function toast(content: any, options?: ToastOptions): void {
  const duration = options?.duration ?? 2400;
  contentS.set(content);
  iconS.set(options?.icon);
  glassS.set(options?.glass ?? true);
  ensureMount();
  showS.set(true);
  if (timer) clearTimeout(timer);
  if (duration > 0) timer = setTimeout(() => showS.set(false), duration);
}
