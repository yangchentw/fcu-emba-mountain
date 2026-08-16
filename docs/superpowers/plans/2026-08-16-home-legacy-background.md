# Home Legacy Background Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Hehuan North Peak group photo to the homepage legacy section and turn its internal navigation links into consistent gold CTA buttons.

**Architecture:** The image processing script creates a new `legacy-group.jpg` public asset from `IMG_0830.JPG`. The homepage legacy section adopts the existing `story-photo` pattern with a `story-legacy` background selector, while its three section links use the existing `CtaLink` component and `.cta` styling.

**Tech Stack:** Astro 5, CSS, Node image processing, Vitest.

## Global Constraints

- Use `IMG_0830.JPG` as the homepage legacy background image.
- Keep the group, summit marker, and association flag centered to right-weighted.
- Preserve the existing text, arrows, internal destinations, hero recruitment CTA, and Association Information section.
- All three homepage content-section internal navigation links use the existing gold `CtaLink` button style.

---

### Task 1: Add the legacy group-photo section and navigation buttons

**Files:**
- Modify: `scripts/optimize-images.mjs:3-10`
- Modify: `src/pages/index.astro:8-11`
- Modify: `src/styles/global.css:88-92`
- Modify: `tests/image-pipeline.test.ts:4-13, 49-59`

**Interfaces:**
- Consumes: `CtaLink` from `src/components/CtaLink.astro`, image source `參考資料/照片/IMG_0830.JPG`, and existing `base` path in `index.astro`.
- Produces: `public/images/legacy-group.jpg` and a homepage section with classes `story story-photo story-legacy reveal`.

- [ ] **Step 1: Write the failing test**

Add the image source/output expectation and a homepage structure test:

```ts
const homePage = readFileSync('src/pages/index.astro', 'utf8');

expect(pipeline).toContain("['參考資料/照片/IMG_0830.JPG', 'public/images/legacy-group.jpg']");
expect(homePage).toContain('class="story story-photo story-legacy reveal"');
expect(homePage).toContain('<CtaLink href={`${base}about/`} label="認識峰鷹 →" />');
expect(homePage).toContain('<CtaLink href={`${base}activities/`} label="探索活動與社群 →" />');
expect(homePage).toContain('<CtaLink href={`${base}legacy/`} label="查看組織與傳承 →" />');
expect(css).toContain(".story-legacy { background-image: var(--legacy-image, url('/images/legacy-group.jpg')); }");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/image-pipeline.test.ts`

Expected: FAIL because no `legacy-group.jpg` pipeline entry, `story-legacy` selector, or `CtaLink` usage exists for the three homepage content-section links.

- [ ] **Step 3: Write minimal implementation**

Add this asset entry to the existing `assets` array:

```js
['參考資料/照片/IMG_0830.JPG', 'public/images/legacy-group.jpg'],
```

Replace each raw homepage navigation anchor with its existing `CtaLink` equivalent. Update the legacy section opening tag as follows:

```astro
<section class="story story-photo story-legacy reveal">
```

Add the dedicated image selector and right-weight the photograph:

```css
.story-legacy {
  background-image: var(--legacy-image, url('/images/legacy-group.jpg'));
  background-position: center 52%;
}
```

- [ ] **Step 4: Generate the new public image and run the focused test**

Run: `npm run images && npm test -- tests/image-pipeline.test.ts`

Expected: `public/images/legacy-group.jpg` is generated and all focused tests pass.

- [ ] **Step 5: Verify the site**

Run: `npm run build && npm test && git diff --check`

Expected: Astro build completes, all tests pass, and no whitespace errors are reported.

- [ ] **Step 6: Commit**

```bash
git add public/images/legacy-group.jpg scripts/optimize-images.mjs src/pages/index.astro src/styles/global.css tests/image-pipeline.test.ts
git commit -m "Add homepage legacy background"
```
