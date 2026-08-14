# 歷屆卡片色彩 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 為組織與傳承頁的四張歷屆卡片提供可辨識的山林色階，同時維持統一、清晰的深墨綠文字。

**Architecture:** `legacy.astro` 依據每筆歷屆資料的 index 指派語意化屆別 class；`global.css` 僅針對這些 class 提供背景色與共用文字色。測試讀取建置輸出與樣式原始碼，確保資料呈現與色彩規則可回歸驗證。

**Tech Stack:** Astro 5、CSS、Vitest 3。

## Global Constraints

- 僅調整組織與傳承頁的四張歷屆卡片；不變更領導資料與其他頁面。
- 背景依序為暖岩砂色、淡松綠、霧藍灰、峰頂金。
- 所有卡片文字統一為深墨綠 `#132017`。
- 使用語意化的屆別 class，不以 DOM 順序選取器決定顏色。

---

### Task 1: 建立歷屆卡片的可驗證配色規則

**Files:**
- Modify: `tests/image-pipeline.test.ts`
- Modify: `src/pages/legacy.astro`
- Modify: `src/styles/global.css`

**Interfaces:**
- Consumes: `leadership` 陣列，依序包含創會、第一屆、第二屆、第三屆。
- Produces: `.term-card--founding`、`.term-card--first`、`.term-card--second`、`.term-card--third` class 與統一深墨綠文字樣式。

- [x] **Step 1: 寫入失敗測試**

```ts
test('legacy cards use four distinct mountain palette classes with consistent ink text', () => {
  const css = readFileSync('src/styles/global.css', 'utf8');
  const legacyPage = readFileSync('src/pages/legacy.astro', 'utf8');

  for (const className of ['founding', 'first', 'second', 'third']) {
    expect(legacyPage).toContain(`term-card--${className}`);
    expect(css).toMatch(new RegExp(`\\.term-card--${className}\\s*\\{[^}]*background:`));
  }

  expect(css).toMatch(/\.term-card\s*\{[^}]*color:\s*#132017/);
});
```

- [x] **Step 2: 執行測試並確認失敗**

Run: `npm run test -- tests/image-pipeline.test.ts`

Expected: FAIL，因為歷屆頁尚未輸出 `term-card--founding`，且尚未定義 `.term-card` 配色。

- [x] **Step 3: 加入最小實作**

```astro
{leadership.map((member, index) => (
  <article class:list={['card', 'term-card', `term-card--${['founding', 'first', 'second', 'third'][index]}`]}>
```

```css
.term-card { color: #132017; }
.term-card--founding { background: #e9dfcc; }
.term-card--first { background: #dce8d9; }
.term-card--second { background: #dbe7e8; }
.term-card--third { background: #f3d76b; }
```

- [x] **Step 4: 執行測試並確認通過**

Run: `npm run test -- tests/image-pipeline.test.ts`

Expected: PASS，卡片具備四個語意化 class 且文字色規則為 `#132017`。

- [x] **Step 5: 建置並檢查產物**

Run: `npm run build && npm run test && git diff --check`

Expected: Astro 產生五個靜態頁面、所有 Vitest 測試通過，且 diff 無空白錯誤。

- [x] **Step 6: 提交與推送**

```bash
git add src/pages/legacy.astro src/styles/global.css tests/image-pipeline.test.ts docs/superpowers/plans/2026-08-14-legacy-term-card-colors.md
git commit -m "feat: color legacy term cards"
git push
```
