# 逢甲大學 EMBA 峰鷹登山協會網站

Astro 靜態網站，適合部署至 Cloudflare Pages。

## 本機開發

需使用 Node.js LTS。第一次執行 `npm install`，開發伺服器使用 `npm run dev`，靜態建置使用 `npm run build`，輸出資料夾為 `dist`。驗證指令為 `npm run test` 與 `npm run test:e2e`。

## Cloudflare Pages

將儲存庫連接 Cloudflare Pages，設定建置命令為 `npm run build`、輸出資料夾為 `dist`。正式網域確定後，同步替換 `astro.config.mjs`、`public/robots.txt` 與 `src/data/site.ts` 的預設網址；再將 `https://正式網域/sitemap-index.xml` 提交至 Google Search Console。

每次合併前先使用 Pages Preview Deployment 驗證。網站無後台：招生表單與即時社群公告由 Google Forms 與 Facebook 社群維護。
