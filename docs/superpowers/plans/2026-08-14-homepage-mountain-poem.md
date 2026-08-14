# Homepage Mountain Poem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the approved mountain poem the homepage hero title and add an accessible Facebook icon to the footer link.

**Architecture:** Keep the poem in the existing homepage hero as its semantic `h1`, with a narrowly scoped `.hero-poem` style and one `Noto Serif TC` weight. Keep the footer icon as an inline SVG inside its existing Facebook link, avoiding additional assets and dependencies.

**Tech Stack:** Astro 5, CSS, Google Fonts, Vitest.

## Global Constraints

- Display the three supplied lines exactly as the homepage hero `h1`.
- Use `Noto Serif TC` only for the hero poem; retain system sans-serif elsewhere.
- Do not render the poem as an image or depend on JavaScript.
- Support small screens and existing reduced-motion behavior.

---

### Task 1: Make the poem the semantic hero title

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `tests/build.test.ts`

**Interfaces:**
- Consumes: the homepage `BaseLayout` and existing hero/story section order.
- Produces: a three-line `h1.hero-poem` inside the hero and page-scoped CSS.

- [ ] **Step 1: Write the failing build-output test**

```ts
test('homepage presents the mountain poem as the hero heading', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  expect(home).toContain('<h1 class="hero-poem"');
  expect(home).toContain('山的美，雲知道');
  expect(home).toContain('雲的媚，風明瞭');
  expect(home).toContain('風的勁，山頂上的您知曉');
});
```

- [ ] **Step 2: Build and run the test to verify it fails**

Run: `npm run build && npm run test -- tests/build.test.ts`

Expected: FAIL because the existing poem is outside the hero and the hero title is not the approved text.

- [ ] **Step 3: Add the poem and scoped style**

```astro
<section class="hero"><div>
  <h1 class="hero-poem">山的美，雲知道<br />雲的媚，風明瞭<br />風的勁，山頂上的您知曉</h1>
</div></section>
```

Remove the separate poem section. Load `Noto Serif TC` in the page head and define `.hero-poem { font-family: 'Noto Serif TC', serif; }` with responsive size and line height.

- [ ] **Step 4: Build and run all tests**

Run: `npm run build && npm run test`

Expected: all test files pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro tests/build.test.ts
git commit -m "feat: use mountain poem as hero title"
```

### Task 2: Add the Facebook icon to the footer link

**Files:**
- Modify: `src/components/Footer.astro`
- Modify: `tests/build.test.ts`

**Interfaces:**
- Consumes: the existing `externalLinks.facebook` URL.
- Produces: an inline, decorative SVG preceding the `Facebook 社群` link text.

- [ ] **Step 1: Write the failing build-output test**

```ts
test('footer Facebook link includes a decorative icon', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  expect(home).toContain('aria-hidden="true"');
  expect(home).toContain('Facebook 社群');
});
```

- [ ] **Step 2: Build and run the test to verify it fails**

Run: `npm run build && npm run test -- tests/build.test.ts`

Expected: FAIL because the Facebook link contains text only.

- [ ] **Step 3: Add the inline SVG and scoped layout style**

```astro
<a class="facebook-link" href={externalLinks.facebook} ...>
  <svg aria-hidden="true" viewBox="0 0 24 24">...</svg>
  Facebook 社群
</a>
```

Use `fill="currentColor"`, a 1em square icon, and inline-flex alignment.

- [ ] **Step 4: Build and run all tests**

Run: `npm run build && npm run test`

Expected: all test files pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.astro tests/build.test.ts
git commit -m "feat: add Facebook footer icon"
```
