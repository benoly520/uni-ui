import pxtorem from 'postcss-pxtorem';

// 移动端适配基准：设计稿宽度 375px，1rem = 37.5px（即 10rem = 屏宽）。
// 运行时由 src/flexible.ts 根据视口宽度设置 html font-size，源码中的 px 在构建时全部转为 rem。
// 说明：
//   - minPixelValue: 2 → 1px 发丝线保留为 px，避免在低 dpr 设备上被缩放到不可见；
//   - mediaQuery: false → 媒体查询内的 px 不做转换（断点仍按物理像素书写）。
export const pxtoremOptions = {
  rootValue: 37.5,
  unitPrecision: 5,
  propList: ['*'],
  selectorBlackList: ['h5-no-rem'],
  minPixelValue: 2,
  mediaQuery: false,
  // playground 自身布局样式保持 px，只转换库的 theme.css 与 node_modules 外的组件样式。
  exclude: /(node_modules|\/playground\/)/i,
};

export default {
  plugins: [pxtorem(pxtoremOptions)],
};
