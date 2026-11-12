import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';

const source = await fs.readFile(new URL('../src/lib/bootstrapRecovery.ts', import.meta.url), 'utf8');
const compiled = ts.transpile(source, { module: ts.ModuleKind.ES2022 });
const { retryBootstrap, clearBootstrapRetry } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const values = new Map();
const storage = {
  getItem: key => values.get(key) ?? null,
  setItem: (key, value) => values.set(key, value),
  removeItem: key => values.delete(key),
};
const error = new TypeError('Failed to fetch dynamically imported module: /src/siteBootstrap.tsx');
let reloads = 0;
const reload = () => reloads++;
assert.equal(retryBootstrap(error, storage, '/', reload), true);
assert.equal(reloads, 1);
assert.equal(retryBootstrap(error, storage, '/', reload), false);
assert.equal(reloads, 1, 'persistent failures must not cause a reload loop');
clearBootstrapRetry(storage);
assert.equal(retryBootstrap(error, storage, '/', reload), true);
assert.equal(reloads, 2, 'successful startup resets recovery for later failures');
assert.equal(retryBootstrap(new Error('Application bug'), storage, '/other', reload), false);
assert.equal(reloads, 2, 'non-fetch failures must not trigger automatic reloads');
assert.equal(retryBootstrap(error, { getItem() { throw new Error('Storage denied'); } }, '/', reload), false);
assert.equal(reloads, 2, 'restricted storage must not cause uncontrolled reloads');
console.log('Bootstrap recovery checks passed');