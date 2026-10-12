import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
// Plain 框架编译器（本地源码构建的 dist）：将 .tsx 编译为「直接构建 DOM」的代码
import plainPlugin from '../../plain-framework/dist/vite/index.js';

// 单包根目录（uni-ui 仓库根）：playground 通过 alias 直接消费「源码」，
// 免去先 build 库即可热更调试；同时演示真实消费路径 uni-ui/react、uni-ui/vue、uni-ui/plain、uni-ui/theme.css。
const root = resolve(__dirname, '..');
const plainRoot = resolve(__dirname, '../../plain-framework');

export default defineConfig({
  plugins: [
    // plain 必须在最前（enforce: pre）：先把 plain 的 .tsx 编译为直 DOM 代码，
    // 避免被 react 插件再次按 JSX 处理。仅匹配 plain 源码与 plain-demos。
    plainPlugin({
      include: /(\/src\/plain\/|plain-demos\.[jt]sx?$)/,
      rpc: false,
    }),
    vue(),
    // react 插件只处理真正的 React 用例文件，避免误伤 plain 源码（已由 plain 编译为无 JSX 的 JS）
    react({ include: /react-demos\.[jt]sx?$/ }),
  ],
  resolve: {
    alias: {
      // 真实消费路径 → 指向库源码入口（与发布后的 uni-ui/react、uni-ui/plain 等价）
      'uni-ui/react': resolve(root, 'src/react/index.ts'),
      'uni-ui/vue': resolve(root, 'src/vue/index.ts'),
      'uni-ui/plain': resolve(root, 'src/plain/index.ts'),
      'uni-ui/theme.css': resolve(root, 'theme.css'),
      // plain 框架运行时 / 编译器 / vite 插件（指向本地构建产物）
      'plain': resolve(plainRoot, 'dist/runtime/index.js'),
      'plain/vite': resolve(plainRoot, 'dist/vite/index.js'),
      'plain/compiler': resolve(plainRoot, 'dist/compiler/index.js'),
      // 强制单实例：避免 playground 自身与库源码各引一份 react / vue（多实例会导致 hook 失效）
      // 依赖实际装在 playground 自身的 node_modules（pnpm workspace 下仓库根没有 node_modules）
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': resolve(__dirname, 'node_modules/react/jsx-runtime'),
      vue: resolve(__dirname, 'node_modules/vue'),
    },
    dedupe: ['react', 'react-dom', 'vue', 'plain'],
  },
  // 库源码位于仓库根（playground 的父目录），放开 fs 访问以便 dev server 直接服务
  server: { fs: { allow: [root, plainRoot] }, port: 5180, open: false },
  preview: { port: 5180 },
});
