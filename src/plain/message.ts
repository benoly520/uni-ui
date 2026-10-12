import { signal, mount } from 'plain';
import { Message, type MessageType } from './Message';

let container: HTMLElement | null = null;
const showS = signal(false);
const contentS = signal<any>('');
const typeS = signal<MessageType>('info');
let timer: ReturnType<typeof setTimeout> | null = null;

function ensureMount(): void {
  if (container) return;
  container = document.createElement('div');
  document.body.appendChild(container);
  mount(container, () =>
    Message({ show: () => showS(), type: () => typeS(), content: () => contentS() }),
  );
}

/**
 * showMessage · 命令式顶部通知（Plain）
 * - 单例容器挂 body，切换 .show 触发入场/退场动画
 * - duration 默认 2600ms，0 不自动关闭；重复调用重置计时器
 * - 与 React / Vue 版 showMessage() 行为一致
 */
export function showMessage(
  text: any,
  type: MessageType = 'info',
  duration = 2600,
): void {
  contentS.set(text);
  typeS.set(type);
  ensureMount();
  showS.set(true);
  if (timer) clearTimeout(timer);
  if (duration > 0) timer = setTimeout(() => showS.set(false), duration);
}
