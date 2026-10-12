/**
 * Plain 组件共享层（编译版）。
 * 仅保留类型别名与 cx 透传；视图一律用 plain 的 JSX 编写，由 plain 编译器编译为直接 DOM。
 */
import { cx as cxFn } from '../utils/cx';
import type { Renderable } from 'plain';

export const cx = cxFn;

/**
 * 可传「值」或「取值函数」的响应式入参。
 * plain 目前仅在全局 JSX 命名空间内声明了同名类型、未从模块导出，故在此对齐其语义自行声明。
 */
export type MaybeGetter<T> = T | (() => T);

export type { Renderable };

/** 布尔属性 -> '' | undefined（避免三元表达式在属性位置被编译成 when） */
export function numAttr(b: any): string | undefined {
  return b ? '' : undefined;
}
