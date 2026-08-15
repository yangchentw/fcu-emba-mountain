# Activity Photo Overlay Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the activity page as an uncropped portrait-photo hero with readable activity copy over a deep-green gradient.

**Architecture:** Move the activity photo from the shared layout's standalone page image into `activities.astro`, where the existing page content becomes the hero overlay. Add a narrowly scoped activity-hero style that uses the image as a contained background within a dark-green canvas; this preserves the full portrait while reserving high-contrast space for the text.

**Tech Stack:** Astro 5, CSS, Vitest.

## Global Constraints

- The snowman and association cup must remain fully visible at every viewport size.
- Activity copy and Facebook call to action must be legible without relying on the image contrast.
- Keep all non-activity page image behavior unchanged.
- Preserve the existing Chinese copy and external Facebook link.

---

### Task 1: Build the uncropped activity-photo hero

**Files:**
- Modify: `src/layouts/BaseLayout.astro:15`
- Modify: `src/pages/activities.astro:4`
- Modify: `src/styles/global.css:37-39`
- Modify: `tests/image-pipeline.test.ts:49-56`

**Interfaces:**
- Consumes: `externalLinks.facebook` from `src/data/site.ts` and `/images/activity-landscape.jpg` from `public/images`.
- Produces: an `.activity-hero` section containing the activity heading, existing description, and Facebook call to action.

- [ ] **Step 1: Write the failing test**

Replace the current crop-position assertion with checks that the activity route has no shared-layout image, that the activity page renders the dedicated hero, and that its CSS preserves the portrait image.

```ts
expect(layout).not.toContain("'/activities/':");
expect(activityPage).toContain('class="activity-hero"');
expect(activityPage).toContain('<CtaLink href={externalLinks.facebook} label="前往 Facebook 社群" external />');
expect(css).toContain("center / contain no-repeat");
expect(css).toContain('var(--ink);');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/image-pipeline.test.ts`

Expected: FAIL because `/activities/` is still configured with a `page-image--activity` standalone image and `.activity-hero` does not exist.

- [ ] **Step 3: Write minimal implementation**

Remove the `/activities/` entry from `pageImages`. Wrap all current activity-page content in this section and retain the existing `CtaLink`:

```astro
<section class="activity-hero">
  <div class="activity-hero__content">
    <p>ACTIVITIES</p>
    <h1>活動與社群</h1>
    <h2>在日常相聚，也在山裡前行。</h2>
    <p>社團日原則上於每月第二、四週星期四晚上 7 時至 9 時舉辦；另有每月一次假日活動。實際地點、報名與行程依每次公告為準。</p>
    <p>最新活動訊息、花絮與夥伴交流，請加入 Facebook 社群。</p>
    <CtaLink href={externalLinks.facebook} label="前往 Facebook 社群" external />
  </div>
</section>
```

Replace `.page-image--activity` with an `.activity-hero` rule that contains the image and draws a deep-green left-to-right gradient. Add a responsive rule that moves the text overlay to the lower part of the hero on narrow screens:

```css
.activity-hero {
  min-height: min(900px, 82vh);
  display: grid;
  align-items: end;
  color: white;
  background:
    linear-gradient(90deg, #102117f2 0%, #102117bf 38%, #10211712 68%),
    var(--activity-image, url('/images/activity-landscape.jpg')) center / contain no-repeat,
    var(--ink);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/image-pipeline.test.ts`

Expected: PASS with all activity-photo assertions green.

- [ ] **Step 5: Verify the site**

Run: `npm test && npm run build && git diff --check`

Expected: all tests pass, Astro build completes, and no whitespace errors are reported.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/activities.astro src/styles/global.css tests/image-pipeline.test.ts
git commit -m "Fix activity photo cropping"
```
