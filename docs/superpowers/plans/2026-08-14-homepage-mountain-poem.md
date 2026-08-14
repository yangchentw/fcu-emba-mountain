# Homepage Mountain Poem Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the approved mountain poem to the homepage with an elegant, accessible Traditional Chinese serif treatment.

**Architecture:** Keep poem content in `src/pages/index.astro` as semantic HTML. Add a narrowly scoped `.mountain-poem` style in the same page and load one `Noto Serif TC` weight through the page head, leaving the site-wide system sans-serif untouched.

**Tech Stack:** Astro 5, CSS, Google Fonts, Vitest.

## Global Constraints

- Display the three supplied lines exactly as approved.
- Use `Noto Serif TC` only for the poem; retain system sans-serif elsewhere.
- Do not render the poem as an image or depend on JavaScript.
- Support small screens and existing reduced-motion behavior.

---

### Task 1: Add semantic poem content and visual treatment

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `tests/build.test.ts`

**Interfaces:**
- Consumes: the homepage `BaseLayout` and existing hero/story section order.
- Produces: a `blockquote.mountain-poem` between hero and first story section, plus page-scoped CSS.

- [ ] **Step 1: Write the failing build-output test**

```ts
test('homepage presents the mountain poem with semantic text', () => {
  const home = readFileSync(resolve('dist/index.html'), 'utf8');
  expect(home).toContain('<blockquote class="mountain-poem"');
  expect(home).toContain('山的美，雲知道');
  expect(home).toContain('雲的媚，風明瞭');
  expect(home).toContain('風的勁，山頂上的您知曉');
});
```

- [ ] **Step 2: Build and run the test to verify it fails**

Run: `npm run build && npm run test -- tests/build.test.ts`

Expected: FAIL because the homepage has no poem markup.

- [ ] **Step 3: Add the poem and scoped style**

```astro
<section class="poem-section" aria-label="山語">
  <blockquote class="mountain-poem">山的美，雲知道<br />雲的媚，風明瞭<br />風的勁，山頂上的您知曉</blockquote>
</section>
```

Load `Noto Serif TC` in the page head and define `.mountain-poem { font-family: 'Noto Serif TC', serif; }` with responsive size and line height.

- [ ] **Step 4: Build and run all tests**

Run: `npm run build && npm run test`

Expected: all test files pass.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro tests/build.test.ts
git commit -m "feat: add homepage mountain poem"
```
