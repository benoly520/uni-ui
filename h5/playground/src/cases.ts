/** Button 演示用例的唯一元数据来源：三端按相同顺序渲染同一组标题与说明。 */
export interface ButtonCaseMeta {
  title: string;
  desc: string;
}

export const buttonCases: ButtonCaseMeta[] = [
  {
    title: '语义变体',
    desc: 'primary 主操作、secondary 次操作、outline 描边、ghost 轻量、danger 危险操作。',
  },
  {
    title: '尺寸',
    desc: 'large / medium / small 三档；medium 为默认 44px 触控高度。',
  },
  {
    title: '形态',
    desc: 'block 占满父容器宽度；round 为胶囊形状，可与任意变体叠加。',
  },
  {
    title: '状态与图标',
    desc: 'loading 展示 spinner 并禁用点击；disabled 原生禁用；icon 置于文本前。',
  },
];
