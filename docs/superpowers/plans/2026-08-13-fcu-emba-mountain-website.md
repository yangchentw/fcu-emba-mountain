# 逢甲大學 EMBA 峰鷹登山協會官方網站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立可部署至 Cloudflare Pages、具四個獨立內容頁與 SEO／無障礙規格的峰鷹登山協會靜態官方網站。

**Architecture:** 使用 Astro 產生完全靜態的多頁 HTML；協會文案、歷屆名單、外部連結集中在 TypeScript 資料檔，版型、導覽、CTA 與 SEO 則封裝成可重用元件。首頁以原生 CSS 與少量 client-side Intersection Observer 實現影像敘事；所有資訊在 JavaScript 關閉時仍可讀取與連結。

**Tech Stack:** Astro 5、TypeScript、原生 CSS、Vitest、Playwright、Cloudflare Pages。

## Global Constraints

- 網站語言固定為繁體中文（`lang="zh-Hant"`），不建立後台、帳號、資料庫或站內報名表單。
- 只建立 `/`、`/about/`、`/legacy/`、`/activities/`、`/join/` 五個可索引路由；章程與準則作為頁尾 PDF 下載連結。
- Facebook 社群與 Google 招生表單皆須在新分頁開啟，含 `rel="noopener noreferrer"`。
- 公開歷屆資料僅為職稱、班別、姓名，不加入個人聯絡方式或肖像。
- 主色：`#496F3F`；強調色：`#E5B900`；正文色：`#132017`；頁面底色：`#F3F5F1`。
- 滾動動畫只操作 `opacity`、`transform`；遵守 `prefers-reduced-motion: reduce`，行動版不使用固定視差或捲軸劫持。
- Cloudflare Pages 建置命令為 `npm run build`，輸出目錄為 `dist`；不使用 Cloudflare Workers、KV 或 D1。
- Lighthouse 行動版效能、無障礙、最佳實務、SEO 均至少 90；首頁 LCP 目標低於 2.5 秒。

---

## File Structure

| 路徑 | 責任 |
| --- | --- |
| `package.json`、`astro.config.mjs`、`tsconfig.json` | Astro、測試與靜態輸出設定。 |
| `src/data/site.ts` | 站點名稱、正式網域預設值、外部連結、四頁中繼資料、歷屆名單與頁尾 PDF。 |
| `src/layouts/BaseLayout.astro` | 全頁 HTML 結構、SEO meta、canonical、Open Graph、JSON-LD、跳至內容連結。 |
| `src/components/Header.astro`、`Footer.astro`、`CtaLink.astro` | 共用導覽、頁尾、外部／站內 CTA。 |
| `src/components/Hero.astro`、`StorySection.astro`、`LegacyTimeline.astro` | 首頁影像開場、敘事區段與傳承時間軸。 |
| `src/pages/index.astro`、`about.astro`、`legacy.astro`、`activities.astro`、`join.astro` | 首頁與四個獨立可索引頁面。 |
| `src/styles/global.css` | 色票、排版、響應式版型、鍵盤焦點、減少動態效果。 |
| `src/scripts/reveal.ts` | Intersection Observer，只將 `.js-reveal` 轉為可動畫區塊。 |
| `public/` | favicon、社群分享圖、PDF、經壓縮的 logo 與照片資產、`robots.txt`、`_headers`。 |
| `tests/site-data.test.ts`、`tests/build.test.ts`、`e2e/site.spec.ts` | 資料、靜態輸出與頁面行為驗證。 |

### Task 1: 建立 Astro 靜態站與測試基礎

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `vitest.config.ts`
- Create: `tests/build.test.ts`

**Interfaces:**
- Produces: `npm run dev`, `npm run build`, `npm run test`, `npm run test:e2e` 指令；`dist/` 靜態輸出。

- [ ] **Step 1: 寫出建置輸出測試**

```ts
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';

test('static build writes the home page', () => {
  expect(existsSync(resolve('dist/index.html'))).toBe(true);
});
```

- [ ] **Step 2: 驗證測試在尚未建置時失敗**

Run: `npm run test -- tests/build.test.ts`

Expected: FAIL，因 `dist/index.html` 尚不存在。

- [ ] **Step 3: 建立最小 Astro 專案與測試指令**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:e2e": "playwright test"
  },
  "devDependencies": {
    "@astrojs/sitemap": "^3.6.0",
    "@playwright/test": "^1.55.0",
    "astro": "^5.0.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
```

Set `output: 'static'` and `site: 'https://mountain.fcuemba.org/'` in `astro.config.mjs`; use this placeholder only until the official domain is known.

- [ ] **Step 4: 安裝依賴、建置並確認測試通過**

Run: `npm install && npm run build && npm run test -- tests/build.test.ts`

Expected: PASS，且 `dist/index.html` 存在。

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json vitest.config.ts tests/build.test.ts
git commit -m "chore: scaffold Astro static site"
```

### Task 2: 集中協會資料與可驗證的公開內容

**Files:**
- Create: `src/data/site.ts`
- Create: `tests/site-data.test.ts`

**Interfaces:**
- Produces: `site`, `externalLinks`, `leadership`, `pages`，供所有頁面與元件匯入。

- [ ] **Step 1: 寫出資料完整性測試**

```ts
import { expect, test } from 'vitest';
import { externalLinks, leadership, pages } from '../src/data/site';

test('the recruitment and Facebook links use HTTPS', () => {
  expect(externalLinks.recruitment).toMatch(/^https:\/\//);
  expect(externalLinks.facebook).toMatch(/^https:\/\//);
});

test('leadership records include all four terms and both roles', () => {
  expect(leadership).toHaveLength(4);
  expect(leadership.every(({ president, secretaryGeneral }) => president && secretaryGeneral)).toBe(true);
});

test('the navigation exposes exactly four content pages', () => {
  expect(pages.map(({ href }) => href)).toEqual(['/about/', '/legacy/', '/activities/', '/join/']);
});
```

- [ ] **Step 2: 驗證測試失敗**

Run: `npm run test -- tests/site-data.test.ts`

Expected: FAIL，因 `src/data/site.ts` 不存在。

- [ ] **Step 3: 實作具型別資料檔**

```ts
export const externalLinks = {
  facebook: 'https://www.facebook.com/groups/fcuembamountain',
  recruitment: 'https://forms.gle/x8v66LxiV8ZvPxAi7',
} as const;

export const leadership = [
  { term: '創會', president: '109 文創 張忠益', secretaryGeneral: '107 經甲 楊子承' },
  { term: '第一屆', president: '107 經甲 楊子承', secretaryGeneral: '101 經甲 陳恩佳' },
  { term: '第二屆', president: '112 高階 白暐輝', secretaryGeneral: '111 經甲 余建擇' },
  { term: '第三屆', president: '101 經甲 陳恩佳', secretaryGeneral: '114 經甲 陳宇慶' },
] as const;
```

Add exact four navigation records and the approved mission, schedule, membership and PDF metadata.

- [ ] **Step 4: 執行資料測試**

Run: `npm run test -- tests/site-data.test.ts`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/data/site.ts tests/site-data.test.ts
git commit -m "feat: add association content data"
```

### Task 3: 實作共用版型、SEO 與無障礙導覽

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/components/CtaLink.astro`
- Create: `src/styles/global.css`
- Create: `public/robots.txt`
- Create: `public/_headers`
- Modify: `tests/build.test.ts`

**Interfaces:**
- Consumes: `site`, `pages`, `externalLinks` from `src/data/site.ts`.
- Produces: `BaseLayout` props `{ title: string; description: string; path: string }` and `CtaLink` props `{ href: string; external?: boolean; label: string }`.

- [ ] **Step 1: 擴充失敗測試，驗證首頁 SEO 與外部連結安全屬性**

```ts
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('home page includes language, canonical, metadata and safe outbound links', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  expect(home).toContain('<html lang="zh-Hant">');
  expect(home).toContain('rel="canonical"');
  expect(home).toContain('application/ld+json');
  expect(home).toContain('rel="noopener noreferrer"');
});
```

- [ ] **Step 2: 重新建置並確認測試失敗**

Run: `npm run build && npm run test -- tests/build.test.ts`

Expected: FAIL，因首頁尚未輸出 metadata。

- [ ] **Step 3: 實作版型與元件**

`BaseLayout.astro` 必須輸出 `title`、description、canonical、Open Graph、`Organization` JSON-LD、跳至主要內容連結及 `<slot />`。`CtaLink.astro` 對 `external` 自動輸出：

```astro
<a href={href} class="cta" target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>
  {label}<span class="sr-only">{external ? '（在新分頁開啟）' : ''}</span>
</a>
```

`_headers` 至少設定 `X-Content-Type-Options: nosniff`、`Referrer-Policy: strict-origin-when-cross-origin` 與 `X-Frame-Options: DENY`。

- [ ] **Step 4: 建置與測試**

Run: `npm run build && npm run test -- tests/build.test.ts`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/layouts src/components src/styles public/robots.txt public/_headers tests/build.test.ts
git commit -m "feat: add accessible layout and SEO defaults"
```

### Task 4: 建立首頁與四個公開內容頁

**Files:**
- Create: `src/pages/index.astro`
- Create: `src/pages/about.astro`
- Create: `src/pages/legacy.astro`
- Create: `src/pages/activities.astro`
- Create: `src/pages/join.astro`
- Create: `src/components/Hero.astro`
- Create: `src/components/StorySection.astro`
- Create: `src/components/LegacyTimeline.astro`
- Modify: `tests/build.test.ts`

**Interfaces:**
- Consumes: `BaseLayout`, `CtaLink`, `externalLinks`, `leadership`, `pages`.
- Produces: 五個輸出 HTML 文件：`dist/index.html`、`dist/about/index.html`、`dist/legacy/index.html`、`dist/activities/index.html`、`dist/join/index.html`。

- [ ] **Step 1: 寫出所有路由與核心文案的失敗測試**

```ts
import { existsSync, readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

for (const route of ['about', 'legacy', 'activities', 'join']) {
  test(`${route} is a static page`, () => {
    expect(existsSync(`dist/${route}/index.html`)).toBe(true);
  });
}

test('legacy page lists the third-term president and secretary general', () => {
  const legacy = readFileSync('dist/legacy/index.html', 'utf8');
  expect(legacy).toContain('101 經甲 陳恩佳');
  expect(legacy).toContain('114 經甲 陳宇慶');
});
```

- [ ] **Step 2: 建置並確認測試失敗**

Run: `npm run build && npm run test -- tests/build.test.ts`

Expected: FAIL，四個路由不存在。

- [ ] **Step 3: 實作頁面內容**

- 首頁依序輸出開場、緣起與使命、活動與社群、傳承四段，以及 Google 招生 CTA。
- `about.astro` 輸出 2014 緣起、2023 創立、使命、願景及安全／保育承諾。
- `legacy.astro` 以 `LegacyTimeline` 顯示四屆，另摘要會長、總幹事、財務、活動、公關、資訊、藝文、總務職掌。
- `activities.astro` 顯示每月第二、四週四 19:00–21:00 社團日和每月一次假日活動，並提供 Facebook CTA。
- `join.astro` 輸出入會資格、個人／榮譽／贊助會員與年費 4,000 元摘要，並提供 Google 表單 CTA。

- [ ] **Step 4: 建置與測試**

Run: `npm run build && npm run test -- tests/build.test.ts`

Expected: PASS，且五個 HTML 都有單一 `<h1>`。

- [ ] **Step 5: Commit**

```bash
git add src/pages src/components/Hero.astro src/components/StorySection.astro src/components/LegacyTimeline.astro tests/build.test.ts
git commit -m "feat: publish association content pages"
```

### Task 5: 加入照片資產策略與安全的滾動敘事

**Files:**
- Create: `src/scripts/reveal.ts`
- Modify: `src/components/Hero.astro`
- Modify: `src/components/StorySection.astro`
- Modify: `src/styles/global.css`
- Create: `scripts/optimize-images.mjs`
- Create: `e2e/site.spec.ts`

**Interfaces:**
- Consumes: 經同意的風景照片與 `StorySection` props `{ eyebrow, title, body, href, image, imageAlt }`。
- Produces: AVIF／WebP responsive assets、可在無 JavaScript 下閱讀的首頁區段、減少動態效果樣式。

- [ ] **Step 1: 寫出首頁可讀性與減少動態效果 E2E 測試**

```ts
import { expect, test } from '@playwright/test';

test('home keeps its content readable when reduced motion is preferred', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '登上山，走向更遠。' })).toBeVisible();
  await expect(page.getByRole('link', { name: /立即加入第三屆/ })).toHaveAttribute('href', /forms\.gle/);
});
```

- [ ] **Step 2: 執行測試並確認失敗**

Run: `npx playwright test e2e/site.spec.ts`

Expected: FAIL，因測試伺服器與動畫規格尚未完成。

- [ ] **Step 3: 實作影像與動畫**

影像處理腳本以 Sharp 將選定圖片輸出 640、960、1440、1920 寬的 WebP／AVIF。`reveal.ts` 僅在 `matchMedia('(prefers-reduced-motion: no-preference)')` 為真時，對 `.js-reveal` 加入 `.is-visible`：

```ts
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'));
}, { threshold: 0.2 });
document.querySelectorAll<HTMLElement>('.js-reveal').forEach((element) => observer.observe(element));
```

首屏圖片加 `fetchpriority="high"`；非首屏圖片加 `loading="lazy"`；所有資訊文字置於圖片以外的語意元素。CSS 在 `@media (prefers-reduced-motion: reduce)` 關閉 transition、animation、background-attachment: fixed。

- [ ] **Step 4: 執行 E2E 與完整測試**

Run: `npm run build && npm run test && npm run test:e2e`

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/scripts src/components src/styles scripts/optimize-images.mjs e2e/site.spec.ts public/images
git commit -m "feat: add accessible mountain photo storytelling"
```

### Task 6: Cloudflare Pages 發布前驗證

**Files:**
- Create: `README.md`
- Modify: `tests/build.test.ts`
- Modify: `public/robots.txt`

**Interfaces:**
- Consumes: `npm run build` 的 `dist/`。
- Produces: 部署說明、sitemap／robots 交叉連結與發佈檢核項。

- [ ] **Step 1: 寫出 sitemap 和 robots 失敗測試**

```ts
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

test('robots points crawlers to the generated sitemap', () => {
  expect(readFileSync('dist/robots.txt', 'utf8')).toContain('Sitemap: https://mountain.fcuemba.org/sitemap-index.xml');
});
```

- [ ] **Step 2: 建置並確認測試失敗**

Run: `npm run build && npm run test -- tests/build.test.ts`

Expected: FAIL，直到 `robots.txt` 使用正確 sitemap URL。

- [ ] **Step 3: 補足部署文件與設定**

`README.md` 必須精確列出：Node LTS 安裝、`npm install`、`npm run dev`、`npm run build`、Cloudflare Pages 的 Git 連接、建置命令 `npm run build`、輸出 `dist`、環境變數／正式網域變更位置、預覽部署與 Google Search Console sitemap 提交。`robots.txt` 必須包含：

```text
User-agent: *
Allow: /
Sitemap: https://mountain.fcuemba.org/sitemap-index.xml
```

在正式網域確定時，同步更新 `astro.config.mjs`、robots 與 README。

- [ ] **Step 4: 執行建置、測試、預覽與 Lighthouse**

Run: `npm run build && npm run test && npm run test:e2e && npm run preview`

Expected: PASS；以 Chrome Lighthouse 檢查首頁與四個內容頁，四項分數都至少 90。

- [ ] **Step 5: Commit**

```bash
git add README.md public/robots.txt tests/build.test.ts astro.config.mjs
git commit -m "docs: document Cloudflare Pages deployment"
```

## Plan Self-Review

- **Spec coverage:** Task 2 實作已核對的資料；Tasks 3、6 覆蓋 Cloudflare、SEO、分享、安全標頭與部署；Task 4 對應五條路由與四項內容頁；Task 5 實作影像策略、滾動效果與無障礙。
- **Placeholder scan:** 未使用 TBD、TODO、未定義的後續工作或模糊測試描述；唯一的預設網域已明確標示必須在正式網域確定時替換。
- **Type consistency:** `CtaLink`、`BaseLayout`、`StorySection` 的 props 與資料匯出名稱在後續任務一致；輸出路由與測試路徑一致。
