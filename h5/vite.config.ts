import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

// H5 独立组件库：react / vue 两个入口共享同一份移动端设计令牌，组件本身零样式。
// 样式由应用侧一次性 import 'uni-ui-h5/theme.css'；源码写 px，PostCSS 在构建时统一转 rem。
//
// 打包形态（二选一）：
//   默认  pnpm build          → 单文件：dist/react.js、dist/vue.js、dist/flexible.js
//   可选  pnpm build:modules  → 按组件拆分：dist/react/Button.js、dist/vue/Button.vue.js …
const modules = process.env.H5_MODULES === '1';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: {
        react: resolve(__dirname, 'src/react/index.ts'),
        vue: resolve(__dirname, 'src/vue/index.ts'),
        flexible: resolve(__dirname, 'src/flexible.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // react / vue 均为 peer，不进 bundle；jsx-runtime 也外置。
      external: (id) =>
        ['react', 'react-dom', 'react/jsx-runtime', 'vue'].includes(id) ||
        id.startsWith('react/'),
      output: modules
        ? {
            // 源码 src/react/Button.tsx → dist/react/Button.js
            // 源码 src/vue/Button.vue    → dist/vue/Button.vue.js（与 .vue.d.ts 对齐）
            preserveModules: true,
            preserveModulesRoot: resolve(__dirname, 'src'),
            entryFileNames: '[name].js',
          }
        : {},
    },
    minify: false,
    sourcemap: true,
  },
});
