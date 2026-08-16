# Homepage Story Spacing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the homepage photo story sections so visitors see more of each background while scrolling.

**Architecture:** Change only the shared `.story-photo` and `.story-photo > div` responsive CSS rules, which apply consistently to all three homepage photo sections. Keep the existing image and content structure intact.

**Tech Stack:** Astro, CSS, Vitest.

## Global Constraints

- Desktop photo stories use `min-height: 78vh` and `padding: clamp(5rem, 11vw, 11rem)`.
- Mobile photo stories use `min-height: 62vh` and `padding-block: 5rem` at widths up to `760px`.
- Text contrast, background images, and CTA controls stay unchanged.

---

### Task 1: Extend photo story scroll distance

**Files:**
- Modify: `tests/image-pipeline.test.ts`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: shared `.story-photo` desktop and mobile CSS rules.
- Produces: longer, readable homepage photo-story sections at all supported viewport widths.

- [ ] **Step 1: Write the failing test**

Add a test that reads the CSS and expects `min-height: 78vh`, desktop `padding: clamp(5rem, 11vw, 11rem)`, and the mobile `min-height: 62vh` plus `padding-block: 5rem` declarations.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/image-pipeline.test.ts`

Expected: FAIL because the current stylesheet uses the shorter `58vh`/`48vh` heights and smaller padding.

- [ ] **Step 3: Write minimal implementation**

Update `.story-photo`, `.story-photo > div`, and their existing max-width `760px` responsive overrides to use the four values defined in Global Constraints.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/image-pipeline.test.ts`

Expected: PASS.

- [ ] **Step 5: Run full verification**

Run: `npm test && npm run build`

Expected: all tests pass and Astro produces `dist/` without errors.

- [ ] **Step 6: Commit**

```bash
git add src/styles/global.css tests/image-pipeline.test.ts docs/superpowers/specs/2026-08-16-home-story-spacing-design.md docs/superpowers/plans/2026-08-16-home-story-spacing.md
git commit -m "Extend homepage story sections"
```
