import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('robots points crawlers to the canonical sitemap', () => {
  const robots = readFileSync('public/robots.txt', 'utf8');

  expect(robots).toContain('Sitemap: https://fcumountain.eu.org/sitemap-index.xml');
  expect(robots).not.toContain('mountain.fcuemba.org');
});
