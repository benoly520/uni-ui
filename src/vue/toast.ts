import { createApp, h, reactive, type App, type VNode } from 'vue';
import Toast from './Toast.vue';

export interface ToastOptions {
  /** 前置图标插槽（24×24 + currentColor） */
  icon?: VNode | (() => VNode);
  /** 自动关闭时长 ms；0 = 不自动关闭 */
  duration?: number;
}

const state = reactive({ show: false, content: '' as string, icon: undefined as ToastOptions['icon'] });
let mountEl: HTMLElement | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function ensureMount(): void {
  if (mountEl) return;
  mountEl = document.createElement('div');
  document.body.appendChild(mountEl);
  const app: App = createApp({
    render: () => h(Toast, { show: state.show, content: state.content, icon: state.icon }),
  });
  app.mount(mountEl);
}

/**
 * toast · 命令式轻提示（Vue）
 * - 单例容器挂 body，响应式切换 show 触发入场/退场动画
 * - duration 默认 2400ms，0 不自动关闭；重复调用重置计时器
 * - 与 React 版 toast() 行为一致
 */
export function toast(content: string, options?: ToastOptions): void {
  const duration = options?.duration ?? 2400;
  state.content = content;
  state.icon = options?.icon;
  ensureMount();
  state.show = true;
  if (timer) clearTimeout(timer);
  if (duration > 0) {
    timer = setTimeout(() => {
      state.show = false;
    }, duration);
  }
}
