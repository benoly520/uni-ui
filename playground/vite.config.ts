import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// 单包根目录（uni-ui 仓库根）：playground 通过 alias 直接消费「源码」，
// 免去先 build 库即可热更调试；同时演示真实消费路径 uni-ui/react、uni-ui/vue、uni-ui/theme.css。
const root = resolve(__dirname, '..');

export default defineConfig({
  plugins: [vue(), react()],
  resolve: {
    alias: {
      // 真实消费路径 → 指向库源码入口（与发布后的 uni-ui/react 等价）
      'uni-ui/react': resolve(root, 'src/react/index.ts'),
      'uni-ui/vue': resolve(root, 'src/vue/index.ts'),
      'uni-ui/theme.css': resolve(root, 'theme.css'),
      // 强制单实例：避免 playground 自身与库源码各引一份 react / vue（多实例会导致 hook 失效）
      // 依赖实际装在 playground 自身的 node_modules（pnpm workspace 下仓库根没有 node_modules）
      react: resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
      'react/jsx-runtime': resolve(__dirname, 'node_modules/react/jsx-runtime'),
      vue: resolve(__dirname, 'node_modules/vue'),
    },
    dedupe: ['react', 'react-dom', 'vue'],
  },
  // 库源码位于仓库根（playground 的父目录），放开 fs 访问以便 dev server 直接服务
  server: { fs: { allow: [root] }, port: 5180, open: false },
  preview: { port: 5180 },
});
