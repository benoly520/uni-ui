import assert from 'node:assert/strict';
import { test } from 'node:test';
import { JSDOM } from 'jsdom';
import { createRequire } from 'node:module';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
for (const key of ['window', 'document', 'Node', 'Element', 'HTMLElement', 'Event']) {
  globalThis[key] = dom.window[key];
}
const { signal, createScope } = await import('plain');
const { Input, NumberInput } = await import('../../dist/plain.js');
const require = createRequire(import.meta.url);
const runtimeURL = pathToFileURL(require.resolve('plain')).href;
const compilerURL = pathToFileURL(resolve(dirname(require.resolve('plain')), '../compiler/index.js')).href;
const { compile } = await import(compilerURL);
const temp = mkdtempSync(join(tmpdir(), 'uni-ui-input-'));
let build;
try {
  const result = compile(`
    import { insert } from 'plain';
    export function build(host, Component, props) {
      function Field() {
        return <Component
          value={props.value}
          defaultValue={props.defaultValue}
          onChange={(value) => props.onChange(value)}
        />;
      }
      insert(host, Field);
    }
  `, 'input-fixture.jsx');
  const file = join(temp, 'fixture.mjs');
  writeFileSync(file, result.code.replace(/from\s+["']plain["']/g, `from "${runtimeURL}"`));
  ({ build } = await import(pathToFileURL(file).href));
} finally {
  rmSync(temp, { recursive: true, force: true });
}

function mount(Component, props) {
  const host = document.createElement('div');
  document.body.append(host);
  const scope = createScope(() => build(host, Component, props));
  return {
    host,
    input: host.querySelector('input'),
    dispose() {
      scope.dispose();
      host.remove();
    },
  };
}

function type(input, value) {
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

for (const [name, Component, initial, changed] of [
  ['Input', Input, 'initial', 'external'],
  ['NumberInput', NumberInput, 12, 34],
]) {
  test(`${name}: controlled updates preserve node identity, focus and selection`, () => {
    const value = signal(initial);
    const view = mount(Component, {
      get value() { return value(); },
      onChange: (next) => value.set(next),
    });
    try {
      view.input.focus();
      for (const text of ['1', '12', '123']) {
        type(view.input, text);
        if (Component === NumberInput) {
          view.input.dispatchEvent(new Event('blur'));
        }
        assert.equal(view.host.querySelector('input'), view.input);
        assert.equal(document.activeElement, view.input);
        assert.equal(String(value()), text);
      }
      value.set(changed);
      assert.equal(view.input.value, String(changed));
      assert.equal(view.host.querySelector('input'), view.input);
      if (Component === Input) {
        view.input.setSelectionRange(1, 3);
        type(view.input, view.input.value);
        assert.equal(view.input.selectionStart, 1);
        assert.equal(view.input.selectionEnd, 3);
      }
    } finally {
      view.dispose();
    }
  });

  test(`${name}: defaultValue is an initial snapshot, not a live binding`, () => {
    const initialValue = signal(initial);
    const changes = [];
    const view = mount(Component, {
      get defaultValue() { return initialValue(); },
      onChange: (value) => changes.push(value),
    });
    try {
      assert.equal(view.input.value, String(initial));
      view.input.focus();
      type(view.input, '56');
      if (Component === NumberInput) view.input.dispatchEvent(new Event('blur'));
      initialValue.set(changed);
      assert.equal(view.host.querySelector('input'), view.input);
      assert.equal(document.activeElement, view.input);
      assert.equal(view.input.value, '56');
      assert.equal(String(changes.at(-1)), '56');
    } finally {
      view.dispose();
    }
  });
}
