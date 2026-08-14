import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('reveal content remains visible until JavaScript has initialized animation', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  expect(css).not.toContain('.reveal{opacity:0');
  expect(css).toContain('.reveal.is-pending{opacity:0');
});

test('a single observer manages every reveal element', () => {
  const script = readFileSync('public/reveal.js', 'utf8');
  expect(script).toContain('const observer = new IntersectionObserver');
  expect(script).toContain('elements.forEach((element) => observer.observe(element))');
});
