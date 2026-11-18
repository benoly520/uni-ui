export interface TreeData {
  /** 唯一键，受控/非受控状态都以它为标识 */
  key: string;
  /** 显示文案 */
  label: string;
  /** 右侧计数徽标（如板块成分股数） */
  count?: number;
  /** 子节点；无则为叶子 */
  children?: TreeData[];
}
