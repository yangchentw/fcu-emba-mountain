import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('the image command has a committed source-image pipeline', () => {
  expect(existsSync('scripts/optimize-images.mjs')).toBe(true);
  const pipeline = readFileSync('scripts/optimize-images.mjs', 'utf8');

  expect(pipeline).toContain('hero-mountain.jpg');
  expect(pipeline).toContain("['參考資料/照片/IMG_0830.JPG', 'public/images/legacy-group.jpg']");
  expect(pipeline).toContain("['參考資料/照片/IMG20260314124148.JPG', 'public/images/activity-landscape.jpg']");
  expect(pipeline).toContain('IMG_1418.jpg');
  expect(pipeline).toContain("['參考資料/照片/IMG_1418.jpg', 'public/images/legacy-trail.jpg']");
  expect(pipeline).toContain('legacy-trail.jpg');
});

test('the shared layout maps non-activity content pages to a dedicated association image', () => {
  const expectedImages = {
    about: 'about-mountain.jpg',
    legacy: 'legacy-trail.jpg',
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

test('the activity page presents the complete branded photo in a dedicated hero', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
  const activityPage = readFileSync('src/pages/activities.astro', 'utf8');

  expect(layout).not.toContain("'/activities/':");
  expect(activityPage).toContain('class="activity-hero"');
  expect(activityPage).toContain('<CtaLink href={externalLinks.facebook} label="前往 Facebook 社群" external />');
  expect(css).toContain("center / contain no-repeat");
  expect(css).toContain('var(--ink);');
  expect(css).toMatch(/@media \(max-width: 760px\)[\s\S]*\.activity-hero__content\s*\{[^}]*width:\s*auto/);
});

test('the homepage legacy section uses the group photo and gold navigation buttons', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const homePage = readFileSync('src/pages/index.astro', 'utf8');

  expect(homePage).toContain('class="story story-photo story-legacy reveal"');
  expect(homePage).toContain('<CtaLink href={`${base}about/`} label="認識峰鷹 →" />');
  expect(homePage).toContain('<CtaLink href={`${base}activities/`} label="探索活動與社群 →" />');
  expect(homePage).toContain('<CtaLink href={`${base}legacy/`} label="查看組織與傳承 →" />');
  expect(css).toContain(".story-legacy { background-image: var(--legacy-image, url('/images/legacy-group.jpg')); }");
});
