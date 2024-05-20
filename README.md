# 畫面
![專案封面圖](https://i.meee.com.tw/hhyp8EK.png)

# 介紹
- 蒐集 2016 、2020 、 2024 總統大選資料，製作各種圖表，以及顯示台灣地圖投票數
- 實際網站連結：https://f2e-vote.zeabur.app/vote
- 可點選左側地圖，地圖會呈現該縣市詳細得票率
    - 同時右側也會切換圖表資料也會切換 
- 點擊上方 Header 下拉選單，可選擇年份、縣市
    - 左側地圖會根據資料切換，右側也會切換圖表資料也會切換 

# 運行
- 需 Node 18 版本以上

### **Setup**
```
npm i
npm run dev
```

### **Build**
```
npm i
npm run build
```

# 資料夾說明
- src/assets：靜態可壓縮資料
- src/components：共用元件
- src/composables：支持 Vue 語法的共用方法
- src/router：路由相關設置
- src/stores：資料共用
- src/style：CSS 資料
- src/utils：一般 JS 共用方法
- src/views：實際頁面
- public：不編譯資料

```jsx
src
│   ├── assets
│   ├── components
│   ├── composables
│   ├── router
│   ├── stores
│   ├── style
│   ├── utils
│   └── views
└──  public
```

# 專案技術
- 使用 Vue3/Vite
- D3.js
- Pinia

# 相關資料
- 中選會：https://db.cec.gov.tw/ElecTable/Election?type=President
- D3.js Example：https://observablehq.com/@d3/gallery?utm_source=d3js-org&utm_medium=hero&utm_campaign=try-observable
- The F2E 設計稿 ： https://2023.thef2e.com/users/12061579704041679194?week=2
- GeoJSON 繪製台灣地圖 https://www.oxxostudio.tw/articles/201803/google-maps-15-geojson-taiwan.html