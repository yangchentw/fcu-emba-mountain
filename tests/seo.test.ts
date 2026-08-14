import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('robots points crawlers to the canonical sitemap', () => {
  const robots = readFileSync('public/robots.txt', 'utf8');

  expect(robots).toContain('Sitemap: https://fcumountain.eu.org/sitemap-index.xml');
  expect(robots).not.toContain('mountain.fcuemba.org');
});

test('built homepage has canonical social metadata and organization schema', () => {
  const home = readFileSync('dist/index.html', 'utf8');

  expect(home).toContain('rel="canonical" href="https://fcumountain.eu.org/"');
  expect(home).toContain('property="og:url" content="https://fcumountain.eu.org/"');
  expect(home).toContain('property="og:site_name" content="逢甲大學 EMBA 峰鷹登山協會"');
  expect(home).toContain('property="og:image" content="https://fcumountain.eu.org/images/hero-mountain.jpg"');
  expect(home).toContain('name="twitter:card" content="summary_large_image"');
  expect(home).toContain('"@type":"Organization"');
  expect(home).toContain('"sameAs":["https://www.facebook.com/groups/fcuembamountain"]');
  expect(home).toContain('"@type":"WebSite"');
  expect(home).toContain('"@type":"BreadcrumbList"');
});

test('homepage publishes concise association information for search answers', () => {
  const home = readFileSync('dist/index.html', 'utf8');

  expect(home).toContain('協會資訊');
  expect(home).toContain('活動資訊在哪裡發布？');
  expect(home).toContain('如何加入協會？');
});
