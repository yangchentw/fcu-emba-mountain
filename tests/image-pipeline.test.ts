import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('the image command has a committed source-image pipeline', () => {
  expect(existsSync('scripts/optimize-images.mjs')).toBe(true);
  expect(readFileSync('scripts/optimize-images.mjs', 'utf8')).toContain('hero-mountain.jpg');
});

test('the shared layout maps every content page to a dedicated association image', () => {
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  for (const page of ['about-mountain.jpg', 'legacy-trail.jpg', 'activity-landscape.jpg', 'join-ridge.jpg']) {
    expect(layout).toContain(`image('${page}')`);
  }
});
