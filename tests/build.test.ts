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

test('homepage presents the mountain poem as the hero heading', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');

  expect(home).toContain('<h1 class="hero-poem"');
  expect(home).toContain('山的美，雲知道');
  expect(home).toContain('雲的媚，風明瞭');
  expect(home).toContain('風的勁，山頂上的您知曉');
});

test('footer Facebook link includes a decorative icon', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');

  expect(home).toContain('aria-hidden="true"');
  expect(home).toContain('Facebook 社群');
});
