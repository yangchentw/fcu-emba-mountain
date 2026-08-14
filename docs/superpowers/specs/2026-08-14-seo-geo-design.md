# SEO 與 GEO 設計

## 目標

以 `https://fcumountain.eu.org/` 作為唯一正式網址，讓搜尋引擎與生成式搜尋能清楚辨識「逢甲大學 EMBA 峰鷹登山協會」的官方身分、網站架構與可回答的協會資訊。

## 範圍與原則

- 正式名稱固定為「逢甲大學 EMBA 峰鷹登山協會」；不以「台中登山社團」等非正式名稱作為主要關鍵字。
- 網站維持靜態 Astro 架構與 Cloudflare Pages 部署，不導入 CMS、追蹤碼或會員資料。
- 僅揭露已確認的協會資料、Facebook 社群與第三屆報名表單；不虛構地址、電話、成立日期或法人註冊資訊。
- 所有可索引頁面使用繁體中文 `zh-Hant`，每頁具備唯一 title、description 與 canonical URL。

## 網址、索引與 Sitemap

1. Astro `site` 固定為 `https://fcumountain.eu.org/`，所有 canonical、sitemap 與 JSON-LD 網址均由此產生。
2. `public/robots.txt` 允許一般爬蟲索引，並只宣告 `https://fcumountain.eu.org/sitemap-index.xml`。
3. `@astrojs/sitemap` 輸出的 `sitemap-index.xml` 為唯一提交入口；Cloudflare Pages 每次建置都更新它。
4. 網域端應將 `http` 與其他非正式主機名稱以 301 轉址到 HTTPS 正式網域，避免重複內容。此設定由 Cloudflare 網域管理者操作。

## 頁面 Metadata 與分享預覽

Base layout 接收每頁 title、description、path 與代表圖片。輸出：

- `title`、meta description、canonical、robots 與語言資訊。
- Open Graph：`og:title`、`og:description`、`og:type`、`og:url`、`og:site_name`、`og:locale`、`og:image`、圖片替代文字。
- Twitter Card：`summary_large_image`、title、description、image。

首頁使用山景主視覺，四個子頁使用對應活動風景照；分享圖片皆使用絕對 HTTPS 網址。

## 結構化資料

每頁以 JSON-LD 輸出下列可驗證 schema.org 類型：

- `Organization`：正式名稱、官方網址、logo、Facebook sameAs，以及可公開連結的社群／報名頁。
- `WebSite`：首頁 URL、網站名稱、語言與 publisher。
- `WebPage`：本頁名稱、description、canonical、primaryImageOfPage 與 isPartOf。
- `BreadcrumbList`：首頁與目前的四個導覽頁。

不加入不存在或未提供的 postalAddress、telephone、geo、aggregateRating、event 日期、會員人數等欄位。

## GEO 內容策略

生成式搜尋最需要可直接引用、可驗證且結構清楚的來源文字。網站新增一個靜態「協會資訊」區塊，並在既有內容中清楚回答：

- 逢甲大學 EMBA 峰鷹登山協會是什麼。
- 協會推廣的宗旨與山野安全、自然保育原則。
- 如何掌握活動資訊（Facebook 社群）。
- 如何加入第三屆（Google 報名表）。
- 歷屆傳承資訊位於「組織與傳承」頁。

內容以精確短段落與語義正確的 heading 編寫，避免為爭取排名而重複關鍵字或宣稱未證實的成果。

## 使用者與平台後續操作

部署後由網域／Google 帳號擁有者：

1. 在 Google Search Console 以 DNS 驗證 `fcumountain.eu.org`，提交 `https://fcumountain.eu.org/sitemap-index.xml`。
2. 在 Bing Webmaster Tools 驗證相同網域並提交相同 sitemap；可選擇匯入 Search Console 驗證。
3. 使用 Google Rich Results Test 與 Schema Markup Validator 檢查首頁和一個子頁的 JSON-LD。
4. 在 Facebook Sharing Debugger 檢查首頁分享預覽，必要時重新抓取。

## 驗證

- 自動測試讀取建置後的 HTML，確認 canonical、robots sitemap、Open Graph、JSON-LD 與 breadcrumb 的正式網域均正確。
- `npm run build` 後確認 sitemap 中列出首頁與四個子頁。
- 使用 `SITE_BASE=/preview/ npm run build` 確認圖片和內部連結不依賴根目錄絕對路徑。
