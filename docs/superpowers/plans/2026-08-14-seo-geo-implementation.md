# SEO and GEO Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `https://fcumountain.eu.org/` consistently indexable and understandable as the official website of 逢甲大學 EMBA 峰鷹登山協會.

**Architecture:** Centralize per-page search metadata in `BaseLayout.astro`, which will turn a page title, description, path, and image into canonical, social, and JSON-LD output. Keep crawlers and sitemap configuration in `public/robots.txt`, then add a concise homepage FAQ as source text for traditional and generative search.

**Tech Stack:** Astro 5 static output, `@astrojs/sitemap`, JSON-LD schema.org, Vitest.

## Global Constraints

- The sole canonical origin is `https://fcumountain.eu.org/`.
- The formal organization name is exactly `逢甲大學 EMBA 峰鷹登山協會`.
- Do not introduce unverified addresses, telephone numbers, legal-registration details, ratings, attendance counts, or event dates.
- Preserve Cloudflare Pages static deployment and support `SITE_BASE` deployments.
- All indexable pages must remain Traditional Chinese (`zh-Hant`).

---

### Task 1: Correct crawler and sitemap discovery

**Files:**
- Modify: `public/robots.txt`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Consumes: Astro sitemap output at `/sitemap-index.xml`.
- Produces: crawler instructions naming `https://fcumountain.eu.org/sitemap-index.xml`.

- [ ] **Step 1: Write the failing robots test**

```ts
test('robots points crawlers to the canonical sitemap', () => {
  const robots = readFileSync('public/robots.txt', 'utf8');
  expect(robots).toContain('Sitemap: https://fcumountain.eu.org/sitemap-index.xml');
  expect(robots).not.toContain('mountain.fcuemba.org');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test -- tests/seo.test.ts`

Expected: FAIL because `robots.txt` names the retired `mountain.fcuemba.org` origin.

- [ ] **Step 3: Replace the sitemap line**

```txt
User-agent: *
Allow: /
Sitemap: https://fcumountain.eu.org/sitemap-index.xml
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npm run test -- tests/seo.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt tests/seo.test.ts
git commit -m "fix: point crawlers to canonical sitemap"
```

### Task 2: Add reusable page metadata and schema

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/data/site.ts`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Consumes: `site.name`, `site.url`, `externalLinks.facebook`, page props `{ title, description, path }`, and the page-image map.
- Produces: canonical and social meta tags; `Organization`, `WebSite`, `WebPage`, and `BreadcrumbList` JSON-LD in every generated page.

- [ ] **Step 1: Write failing built-HTML tests**

```ts
test('built homepage has canonical social metadata and organization schema', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  expect(home).toContain('rel="canonical" href="https://fcumountain.eu.org/"');
  expect(home).toContain('property="og:url" content="https://fcumountain.eu.org/"');
  expect(home).toContain('"@type":"Organization"');
  expect(home).toContain('"sameAs":["https://www.facebook.com/groups/fcuembamountain"]');
});
```

- [ ] **Step 2: Build and run the test to verify it fails**

Run: `npm run build && npm run test -- tests/seo.test.ts`

Expected: FAIL because `og:url`, `sameAs`, and page schema are absent.

- [ ] **Step 3: Implement absolute image, social, and schema helpers in `BaseLayout.astro`**

```ts
const canonical = new URL(path, site.url).href;
const absoluteImage = new URL(pageImage?.src ?? `${base}images/hero-mountain.jpg`, site.url).href;
const breadcrumbs = [{ name: '首頁', item: site.url }, ...];
```

Emit `og:url`, `og:site_name`, `og:locale`, `og:image`, `og:image:alt`, and `twitter:card` head tags. Serialize an `@graph` containing `Organization`, `WebSite`, `WebPage`, and `BreadcrumbList`, with all URLs absolute and `sameAs` pointing only to the supplied Facebook group.

- [ ] **Step 4: Build and run metadata tests**

Run: `npm run build && npm run test -- tests/seo.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro src/data/site.ts tests/seo.test.ts
git commit -m "feat: add canonical social and structured metadata"
```

### Task 3: Add citation-ready association FAQ content

**Files:**
- Modify: `src/pages/index.astro`
- Test: `tests/seo.test.ts`

**Interfaces:**
- Consumes: homepage `BaseLayout` and verified association links from `externalLinks`.
- Produces: a labelled FAQ section with four direct answers: association identity, purpose, activity channel, and joining path.

- [ ] **Step 1: Write the failing content test**

```ts
test('homepage publishes concise association information for search answers', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  expect(home).toContain('協會資訊');
  expect(home).toContain('活動資訊在哪裡發布？');
  expect(home).toContain('如何加入協會？');
});
```

- [ ] **Step 2: Build and run it to verify it fails**

Run: `npm run build && npm run test -- tests/seo.test.ts`

Expected: FAIL because the homepage has no association FAQ section.

- [ ] **Step 3: Add semantic FAQ markup to the homepage**

```astro
<section aria-labelledby="association-info">
  <p>ASSOCIATION INFORMATION</p>
  <h2 id="association-info">協會資訊</h2>
  <dl>
    <dt>逢甲大學 EMBA 峰鷹登山協會是什麼？</dt>
    <dd>...</dd>
  </dl>
</section>
```

Use only supplied facts: hiking, safety awareness, nature conservation, EMBA fellowship, Facebook activity updates, and the third-term recruitment form.

- [ ] **Step 4: Build and run content tests**

Run: `npm run build && npm run test -- tests/seo.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro tests/seo.test.ts
git commit -m "feat: add association information for search"
```

### Task 4: Validate generated outputs and deployment-base behavior

**Files:**
- Modify: `tests/seo.test.ts`

**Interfaces:**
- Consumes: built `dist/sitemap-index.xml`, `dist/sitemap-0.xml`, `dist/index.html`, and `dist/about/index.html`.
- Produces: regression coverage for the formal origin, all five route URLs, child-page breadcrumb schema, and base-safe logo/image paths.

- [ ] **Step 1: Add failing sitemap and child-page tests**

```ts
test('the generated sitemap lists all public routes on the canonical origin', () => {
  const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
  for (const path of ['/', '/about/', '/legacy/', '/activities/', '/join/']) {
    expect(sitemap).toContain(`https://fcumountain.eu.org${path}`);
  }
});
```

- [ ] **Step 2: Build and run tests**

Run: `npm run build && npm run test -- tests/seo.test.ts`

Expected: PASS after Tasks 1–3; investigate any route mismatch before modifying source.

- [ ] **Step 3: Run full verification**

Run: `npm run build && npm run test && SITE_BASE=/preview/ npm run build`

Expected: all tests pass, sitemap lists five canonical URLs, and preview-base build completes.

- [ ] **Step 4: Commit**

```bash
git add tests/seo.test.ts
git commit -m "test: cover generated SEO outputs"
```

### Task 5: Document post-deployment ownership steps

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: public `robots.txt` and `sitemap-index.xml` paths.
- Produces: concise operational instructions for Search Console, Bing Webmaster Tools, rich-result validation, and Facebook share-preview refresh.

- [ ] **Step 1: Add a failing documentation assertion**

```ts
test('README identifies the canonical sitemap submission URL', () => {
  expect(readFileSync('README.md', 'utf8')).toContain('https://fcumountain.eu.org/sitemap-index.xml');
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm run test -- tests/seo.test.ts`

Expected: FAIL until the operations section is added.

- [ ] **Step 3: Add concise SEO operations guidance to `README.md`**

Include the canonical sitemap URL and the exact website-owner steps: DNS property verification in Google Search Console, sitemap submission in Google and Bing, Rich Results Test / Schema Markup Validator, and Facebook Sharing Debugger.

- [ ] **Step 4: Run final verification**

Run: `npm run build && npm run test`

Expected: all test files pass.

- [ ] **Step 5: Commit**

```bash
git add README.md tests/seo.test.ts
git commit -m "docs: add search indexing operations"
```
