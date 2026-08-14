import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

test('static build writes the home page', () => {
  expect(existsSync(resolve('dist/index.html'))).toBe(true);
});

test('header renders the association logo', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  expect(home).toContain('src="/images/logo.png"');
  expect(home).toContain('逢甲大學 EMBA 峰鷹登山協會標誌');
});
