import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('the image command has a committed source-image pipeline', () => {
  expect(existsSync('scripts/optimize-images.mjs')).toBe(true);
  expect(readFileSync('scripts/optimize-images.mjs', 'utf8')).toContain('hero-mountain.jpg');
});

test('the shared layout maps every content page to a dedicated association image', () => {
  const expectedImages = {
    about: 'about-mountain.jpg',
    legacy: 'legacy-trail.jpg',
    activities: 'activity-landscape.jpg',
    join: 'join-ridge.jpg',
  };

  for (const [route, image] of Object.entries(expectedImages)) {
    const html = readFileSync(`dist/${route}/index.html`, 'utf8');
    expect(html).toContain(`<img class="page-image" src="/images/${image}"`);
  }
});
