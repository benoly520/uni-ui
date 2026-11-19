import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import pxtorem from 'postcss-pxtorem';
import { pxtoremOptions } from '../postcss.config.mjs';

// 将根目录 theme.css（px）编译为 dist/theme.css（rem）。
// 组件库不把样式打进 JS，消费方通过 import 'uni-ui-h5/theme.css' 一次性引入。
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = resolve(root, 'theme.css');
const output = resolve(root, 'dist/theme.css');

try {
  const css = await readFile(input, 'utf8');
  const result = await postcss([pxtorem(pxtoremOptions)]).process(css, {
    from: input,
    to: output,
  });
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, result.css, 'utf8');
  console.log('[h5] theme.css -> dist/theme.css（px 已转换为 rem）');
} catch (error) {
  console.error('[h5] 构建 theme.css 失败', error);
  process.exitCode = 1;
}
