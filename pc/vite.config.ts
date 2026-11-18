import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
// plain 框架编译器 / vite 插件（本地通过 link: 依赖解析，免去先发版）。
import plain from 'plain/vite';

// 单包 uni-ui：react / vue / plain 三个入口合并到「同一个 vite 配置」产出（ESM，tree-shakeable）。
// 设计系统样式全部集中在 theme.css（由应用侧一次性 import 'uni-ui/theme.css'），
// 组件本身不携带任何 scoped / 组件级样式，保证 React / Vue / Plain 三侧 DOM 与类名完全一致。
//
// 打包形态（二选一，交给使用者 / 发布方决定）：
//   默认  pnpm build           → 单文件打包：dist/react.js、dist/vue.js、dist/plain.js
//   可选  pnpm build:modules   → 按组件拆分：dist/react/Button.js、dist/vue/Button.vue.js …
//                               （与已有的拆分 .d.ts 对齐，支持 uni-ui/react/Button、uni-ui/vue/Button.vue 子路径直引）
// 两种形态通过 UNI_UI_MODULES 环境变量切换，源码与产物 API 完全一致。
const modules = process.env.UNI_UI_MODULES === '1';

export default defineConfig({
  plugins: [
    // plain 必须在最前：先把 plain 的 .tsx 编译为「直接构建 DOM」的代码，
    // 避免被 vue 插件再次按 JSX 处理。仅匹配 plain 源码。
    plain({
      include: /src\/plain\/.*\.(tsx|ts)$/,
      rpc: false,
    }),
    vue(),
  ],
  build: {
    lib: {
      entry: {
        react: resolve(__dirname, 'src/react/index.ts'),
        vue: resolve(__dirname, 'src/vue/index.ts'),
        plain: resolve(__dirname, 'src/plain/index.ts'),
      },
      formats: ['es'],
    },
    rollupOptions: {
      // react / vue / plain 均为 peer，不进 bundle；jsx-runtime 也外置。
      // Rollup 在 ESM 产物里对外部一律用 import（不会像 rolldown 那样生成 __require），
      // 故 React 桶（含 react-dom）在纯 ESM / SSR / Vitest 下都可直接加载。
      external: (id) =>
        ['react', 'react-dom', 'react/jsx-runtime', 'vue', 'plain'].includes(id) ||
        id.startsWith('react/') ||
        id.startsWith('plain/'),
      output: modules
        ? {
            // 按组件保留独立模块：源码 src/react/Button.tsx → dist/react/Button.js
            //                    src/vue/Button.vue       → dist/vue/Button.vue.js（与 .vue.d.ts 对齐）
            preserveModules: true,
            preserveModulesRoot: resolve(__dirname, 'src'),
            // 入口桶文件仍保留为 react.js / vue.js / plain.js，与单文件形态同名共存
            entryFileNames: '[name].js',
          }
        : {},
    },
    minify: false,
    sourcemap: true,
  },
});
