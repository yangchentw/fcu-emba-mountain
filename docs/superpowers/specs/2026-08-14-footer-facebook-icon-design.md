# Footer Facebook 圖示設計

## 目標

在 footer 的「Facebook 社群」連結前加入一個清楚、可存取且不增加第三方依賴的 Facebook 圖示。

## 設計

- 使用內嵌 SVG 呈現 Facebook 的 `f` 標誌，與文字同屬同一個連結。
- SVG 設為 `aria-hidden="true"`；連結的可讀名稱維持「Facebook 社群」。
- 圖示使用 `currentColor`，隨既有 footer 文字顏色呈現；尺寸約 1em 並與文字垂直置中。
- 不新增圖示函式庫、外部圖片或 JavaScript。

## 驗證

- 建置後首頁 footer 包含 SVG 與「Facebook 社群」連結。
- `npm run build` 與 `npm run test` 通過。
