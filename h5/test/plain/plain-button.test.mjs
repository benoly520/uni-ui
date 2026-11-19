import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'Event', 'MouseEvent']) {
  globalThis[key] = dom.window[key];
}

const { createScope } = await import('plain');
const { Button } = await import('../../dist/plain.js');

const require = createRequire(import.meta.url);
const runtimeURL = pathToFileURL(require.resolve('plain')).href;
const compilerURL = pathToFileURL(
  resolve(dirname(require.resolve('plain')), '../compiler/index.js'),
).href;
const { compile } = await import(compilerURL);

const temp = mkdtempSync(join(tmpdir(), 'uni-ui-h5-button-'));
let build;
try {
  const result = compile(
    `
    import { insert } from 'plain';
    export function build(host, Component, props) {
      function Btn() {
        return <Component
          variant={props.variant}
          size={props.size}
          block={props.block}
          round={props.round}
          loading={props.loading}
          disabled={props.disabled}
          icon={props.icon}
          type={props.type}
          onClick={(event) => props.onClick?.(event)}
        >{props.label}</Component>;
      }
      insert(host, Btn);
    }
  `,
    'button-fixture.jsx',
  );
  const file = join(temp, 'fixture.mjs');
  writeFileSync(file, result.code.replace(/from\s+["']plain["']/g, `from "${runtimeURL}"`));
  ({ build } = await import(pathToFileURL(file).href));
} finally {
  rmSync(temp, { recursive: true, force: true });
}

/** 在独立 host 中挂载 Plain Button，返回根节点与销毁函数。 */
function mount(props) {
  const host = document.createElement('div');
  document.body.append(host);
  const scope = createScope(() => build(host, Button, props));
  return {
    host,
    button: host.querySelector('button'),
    dispose() {
      scope.dispose();
      host.remove();
    },
  };
}

test('Button: 默认 primary / medium，type=button，class 顺序固定', () => {
  const view = mount({ label: '确定' });
  try {
    assert.equal(
      view.button.className,
      'h5-btn h5-btn--primary',
    );
    assert.equal(view.button.type, 'button');
    assert.equal(view.button.disabled, false);
    assert.equal(view.button.getAttribute('aria-busy'), null);
    assert.equal(view.button.textContent, '确定');
  } finally {
    view.dispose();
  }
});

test('Button: variant / size / block / round 输出对应 class', () => {
  const view = mount({
    label: '删除',
    variant: 'danger',
    size: 'large',
    block: true,
    round: true,
  });
  try {
    assert.equal(
      view.button.className,
      'h5-btn h5-btn--danger h5-btn--large h5-btn--block h5-btn--round',
    );
  } finally {
    view.dispose();
  }
});

test('Button: 点击触发 onClick', () => {
  let clicks = 0;
  const view = mount({ label: '提交', onClick: () => (clicks += 1) });
  try {
    view.button.click();
    assert.equal(clicks, 1);
  } finally {
    view.dispose();
  }
});

test('Button: disabled 使用原生 disabled 且不派发点击', () => {
  let clicks = 0;
  const view = mount({
    label: '禁用',
    disabled: true,
    onClick: () => (clicks += 1),
  });
  try {
    assert.equal(view.button.disabled, true);
    view.button.click();
    assert.equal(clicks, 0);
  } finally {
    view.dispose();
  }
});

test('Button: loading 输出 spinner / disabled / aria-busy，不渲染 icon', () => {
  let clicks = 0;
  const view = mount({
    label: '提交中',
    loading: true,
    icon: '＋',
    onClick: () => (clicks += 1),
  });
  try {
    assert.equal(view.button.disabled, true);
    assert.equal(view.button.getAttribute('aria-busy'), 'true');
    assert.equal(view.button.className, 'h5-btn h5-btn--primary h5-btn--loading');
    assert.ok(view.button.querySelector('.h5-btn__spinner'));
    assert.equal(view.button.querySelector('.h5-btn__icon'), null);
    view.button.click();
    assert.equal(clicks, 0);
  } finally {
    view.dispose();
  }
});

test('Button: icon 渲染在 .h5-btn__icon 中并位于文本前', () => {
  const view = mount({ label: '新建', icon: '＋' });
  try {
    const icon = view.button.querySelector('.h5-btn__icon');
    assert.ok(icon);
    assert.equal(icon.textContent, '＋');
    assert.equal(view.button.firstElementChild, icon);
  } finally {
    view.dispose();
  }
});
