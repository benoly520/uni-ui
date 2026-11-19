import { h, type VNode } from 'vue';
import { Button } from 'uni-ui-h5/vue';

/** 演示用加号图标：函数式组件，供 Button 的 icon prop 使用。 */
function PlusIcon() {
  return h('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, [
    h('path', {
      d: 'M12 5v14M5 12h14',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': 2,
      'stroke-linecap': 'round',
    }),
  ]);
}

/** Vue 端用例，顺序与 cases.ts 的 buttonCases 一一对应。 */
export const vueCases: Array<() => VNode> = [
  () =>
    h('div', { class: 'pg-row' }, [
      h(Button, null, { default: () => '确定' }),
      h(Button, { variant: 'secondary' }, { default: () => '次要' }),
      h(Button, { variant: 'outline' }, { default: () => '描边' }),
      h(Button, { variant: 'ghost' }, { default: () => '文字' }),
      h(Button, { variant: 'danger' }, { default: () => '删除' }),
    ]),
  () =>
    h('div', { class: 'pg-row' }, [
      h(Button, { size: 'large' }, { default: () => '大号' }),
      h(Button, null, { default: () => '默认' }),
      h(Button, { size: 'small' }, { default: () => '小号' }),
    ]),
  () =>
    h('div', { class: 'pg-stack' }, [
      h(Button, { block: true }, { default: () => '通栏按钮' }),
      h('div', { class: 'pg-row' }, [
        h(Button, { round: true }, { default: () => '胶囊' }),
        h(Button, { round: true, variant: 'outline' }, { default: () => '胶囊描边' }),
      ]),
    ]),
  () =>
    h('div', { class: 'pg-row' }, [
      h(Button, { loading: true }, { default: () => '提交中' }),
      h(Button, { disabled: true }, { default: () => '禁用' }),
      h(Button, { variant: 'secondary', icon: PlusIcon }, { default: () => '带图标' }),
    ]),
];
