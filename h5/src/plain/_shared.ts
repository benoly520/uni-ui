/**
 * Plain 组件共享层。
 * 仅保留类型别名与 cx 透传；视图一律用 plain 的 JSX 编写，由 plain 编译器编译为直接 DOM。
 *
 * 规则（对照 plain 契约 lint）：
 * - 不解构 props（PLAIN_E1105）；动态 props 是真 getter，直接读 props.x，
 *   带默认值时包成 thunk：`const variant = () => props.variant ?? 'primary'`。
 * - 不快照 props（PLAIN_E1107 / E1112）；children 是 lazy thunk，需显式调用 props.children()。
 * - on* 事件 prop 与函数型 prop 读出来就是函数，直接调用 props.onXxx(...)。
 * - 不用 JSX 属性展开（PLAIN_E1008 编译期硬错）；透传属性显式列出。
 */
import { cx as cxFn } from '../utils/cx';
import type { Renderable } from 'plain';

export const cx = cxFn;

export type { Renderable };
