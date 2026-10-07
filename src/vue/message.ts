import { createApp, h, reactive, type App } from 'vue';
import Message from './Message.vue';

export type MessageType = 'success' | 'warning' | 'info' | 'danger';

const state = reactive({ show: false, content: '' as string, type: 'info' as MessageType });
let mountEl: HTMLElement | null = null;
let timer: ReturnType<typeof setTimeout> | null = null;

function ensureMount(): void {
  if (mountEl) return;
  mountEl = document.createElement('div');
  document.body.appendChild(mountEl);
  const app: App = createApp({
    render: () => h(Message, { show: state.show, type: state.type, content: state.content }),
  });
  app.mount(mountEl);
}

/**
 * showMessage · 命令式顶部通知（Vue）
 * - 单例容器挂 body，响应式切换 show 触发入场/退场动画
 * - duration 默认 2600ms，0 不自动关闭；重复调用重置计时器
 * - 与 React 版 showMessage() 行为一致
 */
export function showMessage(
  content: string,
  type: MessageType = 'info',
  duration = 2600,
): void {
  state.content = content;
  state.type = type;
  ensureMount();
  state.show = true;
  if (timer) clearTimeout(timer);
  if (duration > 0) {
    timer = setTimeout(() => {
      state.show = false;
    }, duration);
  }
}
