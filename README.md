# Puter AI - 免費 FLUX.2 圖像生成 + AI 聊天

🚀 使用 Puter.js 官方 API 的完整 Web 應用,支持 **Black Forest Labs FLUX.2** 最新圖像生成模型

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com)

> ⚠️ **重要提示**: 建議自行建設部署，因官方 API 存在潛在限制  
> 免費用戶享有慷慨額度適合一般使用，但高頻或長請求可能觸發：  
> - 🚫 速率限制 (Rate Limiting)  
> - 🚫 防濾用機制 (如 IP 連線過多)  
> - ✅ 自行部署可完全掌控使用體驗

---

## 📝 開始使用 - Puter.com 註冊登入

### 1. 註冊免費帳號 (推薦)

訪問應用時,會自動彈出 Puter.com 登入視窗:

![Puter 登入介面]()

**步驟**:
1. **點擊「Create Free Account」** (創建免費帳號)
2. **填寫資訊**:
   - Email 或 Username (用戶名)
   - Password (密碼)
3. **完成註冊**: 自動登入,即可使用所有功能

### 2. 已有帳號? 直接登入

- **Email or Username**: 輸入註冊的信箱或用戶名
- **Password**: 輸入密碼
- **點擊「Log In」**: 立即開始使用

### 3. 為什麼需要登入?

- ✅ **免費額度**: 每月慷慨的 AI 生成額度
- ✅ **雲端同步**: 圖片記錄自動保存到雲端
- ✅ **多設備訪問**: 手機、電腦無縫切換
- ✅ **無需付費**: 完全免費,無需信用卡

### 4. 忘記密碼?

點擊「Forgot password?」重置密碼

---

## ✨ 功能特色

### ⚡ FLUX.2 圖像生成
- ✅ **FLUX.2 Pro**: 最高品質,完美文字渲染、複雜排版、資訊圖
- ✅ **FLUX.2 Flex**: 彈性模型,平衡速度與品質
- ✅ **FLUX.2 Dev**: 開發版本,適合實驗與測試
- ✅ **風格選擇器**: 13種專業風格 (寫實/動漫/油畫/賽博朋克等),自動追加優化提示詞
- ✅ **官方 API**: 無需自訂參數 (width/height/steps),簡單可靠

### 🤖 AI 聊天
- GPT-4o • Claude Sonnet 3.5 • GPT-5 Nano
- 實時對話、多模型切換

### 📝 OCR 文字識別
- 圖像轉文字功能
- 支持 URL 輸入

### 🖼️ 圖片記錄管理
- 本地 LocalStorage 自動保存 (最多 50 張)
- 複製提示詞 + 放大查看 + 下載 + 刪除
- 統計信息 (總生成數 + 儲存空間)

### 🆓 完全免費
- 無需 API 金鑰
- 無需後端配置
- 一鍵部署

---

## 🎨 風格選擇指南

應用內建 **13 種專業風格預設**,選擇後會自動追加專業提示詞到您的描述中:

| 風格圖標 | 風格名稱 | 自動追加提示詞示例 | 推薦場景 |
|---------|---------|-------------------|----------|
| 📸 | **寫實攝影** | `photorealistic, ultra realistic, 8k, highly detailed` | 人像、風景、產品攝影 |
| 🌸 | **吉卜力動漫** | `anime style, in the style of Studio Ghibli` | 日本動漫、卡通 |
| 🖼️ | **數位藝術** | `digital art, concept art, trending on artstation` | 遊戲美術、概念圖 |
| 🎨 | **油畫風格** | `oil painting, fine art, masterpiece` | 經典藝術、肖像 |
| 🌊 | **水彩畫** | `watercolor painting, soft colors, dreamy atmosphere` | 夢幻場景、插畫 |
| ✏️ | **素描風格** | `pencil sketch, hand-drawn, detailed line art` | 設計草圖、速寫 |
| 🎬 | **3D 渲染** | `3D render, octane render, unreal engine` | 產品建模、場景 |
| 🤖 | **賽博龐克** | `cyberpunk style, neon lights, futuristic city` | 科幻城市、未來感 |
| ✨ | **奇幻風格** | `fantasy art, magical, ethereal, epic illustration` | 魔法世界、史詩 |
| 📍 | **極簡主義** | `minimalist design, simple, clean, modern` | 簡約設計、現代 |
| 📼 | **復古風格** | `vintage style, retro, old photograph` | 懷舊、老照片 |
| 📖 | **漫畫風格** | `comic book style, pop art, vibrant colors` | 美式漫畫、流行藝術 |
| 🌀 | **超現實主義** | `surrealist art, dreamlike, abstract` | 抽象藝術、夢境 |

### 使用邏輯示例

**您的輸入**:
- 圖像描述: `A dragon on a mountain peak`
- 選擇風格: `📸 寫實攝影`

**實際生成提示詞**:
```
A dragon on a mountain peak, photorealistic, ultra realistic, 8k, highly detailed, professional photography
```

**效果**: 自動提升圖像質量,無需手動輸入複雜提示詞!

---

## 🎯 FLUX.2 模型說明

根據 [Puter.js 官方部落格](https://developer.puter.com/blog/flux-2-in-puter-js/) (2025-11-25),FLUX.2 是 Black Forest Labs 最新一代圖像生成模型:

### 核心優勢
1. **卓越的文字渲染**: 複雜排版、資訊圖、Meme、UI 模型都能完美呈現
2. **更好的提示詞遵循**: 支持多部分提示、複雜組合約束
3. **真實世界知識**: 更準確的燈光、空間邏輯、場景連貫性

### 支持模型
- `black-forest-labs/FLUX.2-pro` - 最高品質,推薦生產環境
- `black-forest-labs/FLUX.2-flex` - 彈性版本,速度較快
- `black-forest-labs/FLUX.2-dev` - 開發版本,適合測試

---

## 🚀 快速部署

### Zeabur 一鍵部署 (推薦)

1. **點擊部署按鈕**:
   [![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates)

2. **選擇此倉庫**: `kinai9661/Puter`

3. **自動部署**: 約 1-2 分鐘完成

4. **獲得域名**: `your-app.zeabur.app`

5. **訪問應用**: 會自動彈出 Puter.com 登入視窗,註冊/登入後即可使用

### 本地運行

```bash
# 克隆倉庫
git clone https://github.com/kinai9661/Puter.git
cd Puter

# 安裝依賴
npm install

# 啟動應用
npm start
```

訪問 `http://localhost:3000` (同樣需要登入 Puter.com)

---

## 📁 專案結構

```
Puter/
├── README.md           # 專案說明
├── package.json        # 依賴配置
├── server.js           # Express 伺服器
├── zbpack.json         # Zeabur 部署配置
├── .gitignore
└── public/
    ├── index.html      # 主頁面 (FLUX.2 UI + 風格選擇)
    ├── style.css       # 現代化樣式表
    └── app.js          # 前端邏輯 (FLUX.2 API + 風格映射)
```

---

## 🛠️ 技術棧

- **後端**: Node.js 18+ + Express 4.x
- **前端**: Vanilla JavaScript + Puter.js v2 SDK
- **AI 模型**: FLUX.2 (Black Forest Labs) + GPT/Claude
- **認證**: Puter.com OAuth (自動彈窗)
- **部署**: Zeabur / Vercel / Cloudflare Workers
- **儲存**: LocalStorage (前端) + Puter Cloud (可選)

---

## 📖 API 使用示例

### FLUX.2 圖像生成 (官方格式)

```javascript
// ✅ 正確的 Puter.js FLUX.2 API
puter.ai.txt2img(
    "A vintage movie poster for 'The Last Voyage', featuring bold art deco typography",
    {
        model: "black-forest-labs/FLUX.2-pro",
        disable_safety_checker: true  // 支持創意內容
    }
).then(imageElement => {
    document.body.appendChild(imageElement);
});
```

### 風格自動追加邏輯

```javascript
// 風格映射表
const stylePrompts = {
    'photorealistic': 'photorealistic, ultra realistic, 8k, highly detailed',
    'anime': 'anime style, in the style of Studio Ghibli, detailed anime art',
    // ...更多風格
};

// 組合完整提示詞
const basePrompt = "A dragon on a mountain peak";
const styleKey = "photorealistic";
const fullPrompt = `${basePrompt}, ${stylePrompts[styleKey]}`;

// 生成圖像
puter.ai.txt2img(fullPrompt, { model: "black-forest-labs/FLUX.2-pro" });
```

### AI 聊天

```javascript
puter.ai.chat(
    "Explain quantum computing in simple terms",
    { model: "gpt-4o" }
).then(response => {
    console.log(response);
});
```

### OCR 文字識別

```javascript
puter.ai.img2txt("https://example.com/image.jpg")
    .then(text => console.log(text));
```

---

## ⚠️ 重要說明

### 支持的參數
根據 [Puter.js 官方文檔](https://developer.puter.com/blog/flux-2-in-puter-js/),`txt2img` API **只支持**:
- `model`: 模型名稱 (e.g., `black-forest-labs/FLUX.2-pro`)
- `disable_safety_checker`: 繞過安全檢查 (boolean)

### 不支持的參數
以下參數會被 **忽略或導致錯誤**:
- ❌ `width` / `height` (尺寸由模型自動決定)
- ❌ `steps` (步數固定)
- ❌ `guidance_scale` (引導強度預設)
- ❌ `seed` (種子隨機)

**原因**: Puter.js 封裝了 FLUX.2 API,簡化了參數以確保穩定性。

---

## 💡 使用建議

### 提示詞建議

**電影海報** (配合寫實風格):
```
A vintage movie poster for 'The Last Voyage', 
featuring bold art deco typography with the tagline 
'An Adventure Beyond Time' and 'Coming Soon 2024' at the bottom
```

**資訊圖** (配合數位藝術):
```
Create an infographic that shows how to make coffee step by step,
with clear icons and text labels
```

**奇幻藝術** (配合油畫風格):
```
A majestic dragon perched on a mountain peak, 
fantasy art style, detailed scales, dramatic lighting
```

### 模型選擇

| 模型 | 用途 | 速度 | 品質 | 搭配風格 |
|------|------|------|------|----------|
| FLUX.2 Pro | 生產環境、商業用途 | 中 | ⭐⭐⭐⭐⭐ | 所有風格 |
| FLUX.2 Flex | 快速預覽、實驗 | 快 | ⭐⭐⭐⭐ | 寫實/動漫 |
| FLUX.2 Dev | 開發測試 | 中 | ⭐⭐⭐⭐ | 測試用 |
| GPT Image-1 | 備用選項 | 快 | ⭐⭐⭐ | 簡單風格 |
| DALL-E 3 | 經典模型 | 中 | ⭐⭐⭐⭐ | 寫實/卡通 |

---

## 🐛 常見問題

### 1. 無法登入 Puter.com?

**解決方案**:
- 確保網路連接正常
- 清除瀏覽器快取後重試
- 嘗試使用無痕模式
- 檢查是否被防火牆攔截

### 2. 圖像生成失敗?

**解決方案**:
- 切換到 `FLUX.2-flex` (更快速)
- 簡化提示詞內容
- 嘗試不同風格
- 嘗試 `gpt-image-1` 或 `dall-e-3`
- 檢查登入狀態

### 3. 為什麼無法設置圖像尺寸?

Puter.js FLUX.2 API 不支持自訂尺寸,由模型自動決定最佳解析度 (通常為 1024x1024 或類似)。

### 4. 生成時間多久?

- FLUX.2 Pro: 15-30 秒
- FLUX.2 Flex: 10-20 秒
- GPT Image-1: 5-15 秒

### 5. 風格選擇不生效?

確保:
- 已選擇風格 (非「無」)
- 瀏覽器控制台無錯誤
- 更新到最新版本代碼

### 6. 圖片記錄會丟失嗎?

- 本地部署: 記錄保存在瀏覽器 LocalStorage,清除快取會丟失
- 建議定期下載重要圖片

### 7. 是否支持商業用途?

是的,生成的圖像可用於商業專案,但請查閱 [Puter.js 服務條款](https://puter.com/terms)。

---

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request!

1. Fork 此倉庫
2. 創建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

---

## 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

---

## 🔗 相關連結

- **Puter.js 官網**: [https://puter.com](https://puter.com)
- **Puter.com 註冊**: [https://puter.com/app](https://puter.com/app)
- **FLUX.2 部落格**: [https://developer.puter.com/blog/flux-2-in-puter-js/](https://developer.puter.com/blog/flux-2-in-puter-js/)
- **API 文檔**: [https://docs.puter.com](https://docs.puter.com)
- **Black Forest Labs**: [https://blackforestlabs.ai](https://blackforestlabs.ai)
- **Zeabur 文檔**: [https://zeabur.com/docs](https://zeabur.com/docs)

---

## 🎓 學習資源

- [Puter.js 快速入門](https://docs.puter.com/getting-started)
- [FLUX.2 提示詞最佳實踐](https://developer.puter.com/blog/flux-2-tips)
- [AI 圖像生成教學](https://www.example.com/ai-image-guide)

---

## ⭐ Star History

如果這個專案對您有幫助,請給個星星! 🚀

[![Star History Chart](https://api.star-history.com/svg?repos=kinai9661/Puter&type=Date)](https://star-history.com/#kinai9661/Puter&Date)

---

<footer>
  <p>由 <a href="https://github.com/kinai9661" target="_blank">kinai9661</a> 開發 | 基於 <a href="https://puter.com" target="_blank">Puter.js</a> 官方 API</p>
</footer>
