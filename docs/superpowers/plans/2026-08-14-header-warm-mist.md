# Header Warm Mist Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved warm-mist background and Peak Eagle green baseline to the shared website header.

**Architecture:** Change only the existing shared `header` CSS rule in `src/styles/global.css`. Add a built-output regression assertion to ensure the compiled stylesheet retains the approved colors and 2px baseline.

**Tech Stack:** Astro 5, CSS, Vitest.

## Global Constraints

- Header background is `#F4F1E8`.
- Header baseline is 2px solid `#496F3F`.
- Preserve header sticky behavior, layout, typography, and responsive rules.

---

### Task 1: Apply and verify the warm-mist header

**Files:**
- Modify: `src/styles/global.css`
- Modify: `tests/build.test.ts`

**Interfaces:**
- Consumes: the shared `header` CSS selector.
- Produces: compiled CSS with warm-mist background and green baseline on all pages.

- [ ] **Step 1: Write the failing CSS source test**

```ts
test('header uses the approved warm mist and Peak Eagle green baseline', () => {
  const css = readFileSync(resolve('src/styles/global.css'), 'utf8');
  expect(css).toContain('background:#f4f1e8');
  expect(css).toContain('border-bottom:2px solid #496f3f');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test -- tests/build.test.ts`

Expected: FAIL because the header still uses white without a baseline.

- [ ] **Step 3: Update the shared header rule**

```css
header { background: #f4f1e8; border-bottom: 2px solid #496f3f; }
```

- [ ] **Step 4: Build and run all tests**

Run: `npm run build && npm run test`

Expected: all test files pass.

- [ ] **Step 5: Commit and push**

```bash
git add src/styles/global.css tests/build.test.ts docs/superpowers/plans/2026-08-14-header-warm-mist.md
git commit -m "feat: style header with warm mist palette"
git push origin main
```
