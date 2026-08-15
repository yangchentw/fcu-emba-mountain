import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('the image command has a committed source-image pipeline', () => {
  expect(existsSync('scripts/optimize-images.mjs')).toBe(true);
  const pipeline = readFileSync('scripts/optimize-images.mjs', 'utf8');

  expect(pipeline).toContain('hero-mountain.jpg');
  expect(pipeline).toContain("['參考資料/照片/IMG20260314124148.JPG', 'public/images/activity-landscape.jpg']");
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

test('legacy cards use four distinct mountain palette classes with consistent ink text', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const legacyPage = readFileSync('src/pages/legacy.astro', 'utf8');

  for (const className of ['founding', 'first', 'second', 'third']) {
    expect(legacyPage).toContain(`term-card--${className}`);
    expect(css).toMatch(new RegExp(`\\.term-card--${className}\\s*\\{[^}]*background:`));
  }

  expect(css).toMatch(/\.term-card\s*\{[^}]*color:\s*#132017/);
});

test('the activity photo keeps its branded cup and snowman in the banner crop', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');

  expect(css).toMatch(/\.story-activity\s*\{[^}]*background-position:\s*center 75%/);
  expect(layout).toContain("'/activities/': { src: image('activity-landscape.jpg'), alt: '峰鷹登山協會杯子與雪人佇立高山岩石上', className: 'page-image--activity' }");
  expect(css).toMatch(/\.page-image--activity\s*\{[^}]*object-position:\s*center 75%/);
});
