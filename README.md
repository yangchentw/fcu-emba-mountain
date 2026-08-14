# 逢甲大學 EMBA 峰鷹登山協會網站

Astro 靜態網站，適合部署至 Cloudflare Pages。

## 本機開發

需使用 Node.js LTS。第一次執行 `npm install`，開發伺服器使用 `npm run dev`，靜態建置使用 `npm run build`，輸出資料夾為 `dist`。驗證指令為 `npm run test` 與 `npm run test:e2e`。

## Cloudflare Pages

將儲存庫連接 Cloudflare Pages，設定建置命令為 `npm run build`、輸出資料夾為 `dist`。正式網站使用 `https://fcumountain.eu.org/`；請在 Cloudflare 將其他主機名稱與 HTTP 請求以 301 轉址至此 HTTPS 網址。

每次合併前先使用 Pages Preview Deployment 驗證。網站無後台：招生表單與即時社群公告由 Google Forms 與 Facebook 社群維護。

## 搜尋收錄與分享預覽

部署完成後，由網域或 Google 帳號擁有者執行下列工作：

1. 在 Google Search Console 以 DNS 驗證 `fcumountain.eu.org`，提交 sitemap：`https://fcumountain.eu.org/sitemap-index.xml`。
2. 在 Bing Webmaster Tools 驗證同一個網域並提交相同 sitemap；可選擇匯入 Google Search Console 的驗證資料。
3. 以 Google Rich Results Test 或 Schema Markup Validator 檢查首頁與任一子頁的結構化資料。
4. 網頁分享圖或標題更新後，使用 Facebook Sharing Debugger 重新擷取首頁預覽。
