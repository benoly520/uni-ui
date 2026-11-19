import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
// Plain 框架编译器（本地通过 link: 依赖解析）。
import plain from 'plain/vite';

// H5 包根目录：playground 通过 alias 直接消费「源码」，免去先 build 库即可热更调试；
// 同时演示真实消费路径 uni-ui-h5/react、uni-ui-h5/vue、uni-ui-h5/plain、uni-ui-h5/theme.css。
const root = resolve(__dirname, '..');
const plainRoot = resolve(__dirname, '../../../plain-framework');

export default defineConfig({
  plugins: [
    // plain 必须在最前：先把 plain 的 .tsx 编译为直 DOM 代码，避免被 react 插件再次按 JSX 处理。
    plain({
      include: /(\/src\/plain\/|plain-demos\.[jt]sx?$)/,
      rpc: false,
    }),
    vue(),
    // react 插件只处理真正的 React 用例文件，避免误伤 plain 源码。
    react({ include: /react-demos\.[jt]sx?$/ }),
  ],
  resolve: {
    alias: {
      // 真实消费路径 → 库源码入口（与发布后的 uni-ui-h5/react 等价）
      'uni-ui-h5/react': resolve(root, 'src/react/index.ts'),
      'uni-ui-h5/vue': resolve(root, 'src/vue/index.ts'),
      'uni-ui-h5/plain': resolve(root, 'src/plain/index.ts'),
      'uni-ui-h5/flexible': resolve(root, 'src/flexible.ts'),
      'uni-ui-h5/theme.css': resolve(root, 'theme.css'),
      // 强制单实例：避免 playground 与库源码各引一份 react / vue（多实例会导致 hook 失效）
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': resolve(__dirname, 'node_modules/react/jsx-runtime'),
      vue: resolve(__dirname, 'node_modules/vue'),
    },
    dedupe: ['react', 'react-dom', 'vue', 'plain'],
  },
  // 复用 H5 包的 PostCSS 配置（px → rem）；playground 自身样式在 exclude 中保持 px。
  css: { postcss: root },
  server: { fs: { allow: [root, plainRoot] }, port: 5181, open: false },
  preview: { port: 5181 },
});
