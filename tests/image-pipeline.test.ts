import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('the image command has a committed source-image pipeline', () => {
  expect(existsSync('scripts/optimize-images.mjs')).toBe(true);
  const pipeline = readFileSync('scripts/optimize-images.mjs', 'utf8');

  expect(pipeline).toContain('hero-mountain.jpg');
  expect(pipeline).toContain('IMG_1418.jpg');
  expect(pipeline).toContain("['參考資料/照片/IMG_1418.jpg', 'public/images/legacy-trail.jpg']");
  expect(pipeline).toContain('legacy-trail.jpg');
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
    expect(html).toContain(`<img`);
    expect(html).toContain(`src="/images/${image}"`);
  }
});

test('the legacy image keeps the hiker and summit sign without cover cropping', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');

  expect(css).toMatch(/\.page-image--legacy\s*\{[^}]*max-height:\s*none/);
  expect(css).toMatch(/\.page-image--legacy\s*\{[^}]*object-fit:\s*contain/);
});
