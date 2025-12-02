# Puter AI - Free FLUX.2 Image Generation + AI Chat

[中文](#-中文版) | [English](#-english-version)

---

## 🇬🇧 English Version

🚀 Complete web application using official Puter.js API, supporting **Black Forest Labs FLUX.2** latest image generation models

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com)

> ⚠️ **Important Notice**: Self-hosting is recommended due to potential API limitations  
> Free users enjoy generous quotas suitable for general use, but high-frequency or long requests may trigger:  
> - 🚫 Rate Limiting  
> - 🚫 Anti-abuse mechanisms (e.g., excessive IP connections)  
> - ✅ Self-hosting gives you complete control over the user experience

---

### ✨ Features

#### ⚡ FLUX.2 Image Generation
- ✅ **FLUX.2 Pro**: Highest quality, perfect text rendering, complex layouts, infographics
- ✅ **FLUX.2 Flex**: Flexible model, balanced speed and quality, supports custom sizes
- ✅ **FLUX.2 Dev**: Development version, suitable for experiments and testing
- ✅ **Style Selector**: 13 professional styles (Realistic/Anime/Oil Painting/Cyberpunk, etc.), auto-append optimized prompts
- ✅ **Batch Generation**: Generate 1-4 images at once with parallel processing
- ✅ **Image Ratios**: 7 preset ratios (1:1, 16:9, 9:16, 3:2, 2:3, 4:3, 3:4)
- ✅ **Official API**: Uses Puter.js officially recommended format, simple and reliable

#### 🤖 AI Chat
- GPT-4o • Claude Sonnet 3.5 • GPT-5 Nano
- Real-time conversation, multi-model switching

#### 📝 OCR Text Recognition
- Image-to-text functionality
- Supports URL input

#### 🖼️ Image History Management
- Local LocalStorage auto-save (up to 50 images)
- Copy prompts + Zoom view + Download + Delete
- Statistics (total generations + storage space)

#### 🆓 Completely Free
- No API key required
- No backend configuration
- One-click deployment

---

### 📋 Changelog

#### v1.3.0 (2025-12-02)
- 🎨 **UI Fix**: Restored complete CSS styles, fixed display issues
- 📝 **Documentation**: Added bilingual README (English + Chinese)
- ✨ **Version History**: Added changelog section

#### v1.2.0 (2025-12-02)
- 🔢 **Batch Generation**: Generate 1-4 images at once with parallel processing
- 📊 **Progress Display**: Real-time generation progress (Completed X/Y)
- 🎨 **Grid Layout**: Display multiple images in responsive grid
- 💾 **Auto Save**: All generated images saved to history

#### v1.1.0 (2025-12-02)
- 🎨 **Style Selector**: 13 professional style presets
- 📐 **Aspect Ratios**: 7 preset image ratios (1:1 to 16:9)
- ⚙️ **Advanced Parameters**: Steps and seed control for Flex/Dev models
- ⚠️ **FLUX.2 Pro Limitation**: Auto-lock to 1024x1024 with notification

#### v1.0.0 (2025-12-01)
- 🚀 **Initial Release**: FLUX.2 Pro/Flex/Dev support
- 🤖 **AI Chat**: GPT-4o, Claude Sonnet 3.5, GPT-5 Nano
- 📝 **OCR**: Image-to-text recognition
- 🖼️ **History Management**: LocalStorage-based image history
- 🆓 **Free Deployment**: Zeabur one-click deploy

---

### 🚀 Quick Deployment

#### Zeabur One-Click Deploy (Recommended)

1. **Click deploy button**:
   [![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates)

2. **Select this repository**: `kinai9661/Puter`

3. **Auto deployment**: Completes in ~1-2 minutes

4. **Get domain**: `your-app.zeabur.app`

5. **Access app**: Puter.com login popup will appear automatically, register/login to use

#### Local Development

```bash
# Clone repository
git clone https://github.com/kinai9661/Puter.git
cd Puter

# Install dependencies
npm install

# Start application
npm start
```

Visit `http://localhost:3000` (login to Puter.com required)

---

### 📸 Image Ratio Selection

Application supports **7 preset ratios** for different purposes:

| Ratio | Size | Use Case | FLUX.2 Pro | FLUX.2 Flex/Dev |
|-------|------|----------|-----------|----------------|
| 🔳 **1:1 Square** | 1024x1024 | Social media, avatars, product images | ✅ Supported | ✅ Supported |
| 📺 **3:2 Landscape** | 1536x1024 | Landscape photography, horizontal posters | ❌ Not supported | ✅ Supported |
| 📱 **2:3 Portrait** | 1024x1536 | Portrait photography, vertical posters | ❌ Not supported | ✅ Supported |
| 🎞️ **16:9 Widescreen** | 1920x1024 | Banners, headers, YouTube | ❌ Not supported | ✅ Supported |
| 📱 **9:16 Mobile Portrait** | 1024x1920 | Phone wallpapers, Stories | ❌ Not supported | ✅ Supported |
| 📋 **3:4 Portrait** | 768x1024 | Traditional vertical layout | ❌ Not supported | ✅ Supported |
| 🖼️ **4:3 Traditional** | 1024x768 | Traditional horizontal layout | ❌ Not supported | ✅ Supported |

#### ⚠️ FLUX.2 Pro Limitation

According to [Puter.js Official Example](https://developer.puter.com/blog/flux-2-in-puter-js/), **FLUX.2 Pro only supports 1024x1024**:

- ✅ **Official default**: Fixed at 1024x1024, no need to specify width/height
- ❌ **No customization**: Other size options not supported
- 🏆 **Highest quality**: Professional-grade generation quality

**Usage Recommendation**:
- Need other ratios? Use **FLUX.2 Flex** or **FLUX.2 Dev**
- Need highest quality? Use **FLUX.2 Pro** (1:1 only)

---

### 🎨 Style Selection Guide

Built-in **13 professional style presets**, auto-appends professional prompts to your description:

| Style | Auto-Appended Prompt Example | Recommended For |
|-------|----------------------------|----------------|
| 📸 **Photorealistic** | `photorealistic, ultra realistic, 8k, highly detailed` | Portraits, landscapes, products |
| 🌸 **Studio Ghibli Anime** | `anime style, in the style of Studio Ghibli` | Japanese anime, cartoons |
| 🖼️ **Digital Art** | `digital art, concept art, trending on artstation` | Game art, concept design |
| 🎨 **Oil Painting** | `oil painting, fine art, masterpiece` | Classic art, portraits |
| 🌊 **Watercolor** | `watercolor painting, soft colors, dreamy atmosphere` | Dreamy scenes, illustrations |
| ✏️ **Sketch** | `pencil sketch, hand-drawn, detailed line art` | Design drafts, sketches |
| 🎬 **3D Render** | `3D render, octane render, unreal engine` | Product modeling, scenes |
| 🤖 **Cyberpunk** | `cyberpunk style, neon lights, futuristic city` | Sci-fi cities, futuristic |
| ✨ **Fantasy** | `fantasy art, magical, ethereal, epic illustration` | Magical worlds, epic scenes |
| 📍 **Minimalist** | `minimalist design, simple, clean, modern` | Simple design, modern |
| 📼 **Vintage** | `vintage style, retro, old photograph` | Nostalgic, old photos |
| 📖 **Comic** | `comic book style, pop art, vibrant colors` | American comics, pop art |
| 🌀 **Surrealism** | `surrealist art, dreamlike, abstract` | Abstract art, dreams |

---

### 🔗 Links

- **Puter.js Official**: [https://puter.com](https://puter.com)
- **Register Puter.com**: [https://puter.com/app](https://puter.com/app)
- **FLUX.2 Blog**: [https://developer.puter.com/blog/flux-2-in-puter-js/](https://developer.puter.com/blog/flux-2-in-puter-js/)
- **API Documentation**: [https://docs.puter.com](https://docs.puter.com)
- **Black Forest Labs**: [https://blackforestlabs.ai](https://blackforestlabs.ai)
- **Zeabur Docs**: [https://zeabur.com/docs](https://zeabur.com/docs)

---

### 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🇨🇳 中文版

🚀 使用 Puter.js 官方 API 的完整 Web 應用,支持 **Black Forest Labs FLUX.2** 最新圖像生成模型

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com)

> ⚠️ **重要提示**: 建議自行建設部署，因官方 API 存在潛在限制  
> 免費用戶享有慷慨額度適合一般使用，但高頻或長請求可能觸發：  
> - 🚫 速率限制 (Rate Limiting)  
> - 🚫 防濫用機制 (如 IP 連線過多)  
> - ✅ 自行部署可完全掌控使用體驗

---

### 📝 開始使用 - Puter.com 註冊登入

#### 1. 註冊免費帳號 (推薦)

訪問生成圖片時,會自動彈出 Puter.com 登入,自行拉大視窗就會出現:

![Puter 登入介面](https://github.com/kinai9661/Puter/blob/main/%E8%9E%A2%E5%B9%95%E6%93%B7%E5%8F%96%E7%95%AB%E9%9D%A2%202025-12-01%20210358.png?raw=true)

**步驟**:
1. **點擊「Create Free Account」** (創建免費帳號)
2. **填寫資訊**:
   - Email 或 Username (用戶名)
   - Password (密碼)
3. **完成註冊**: 自動登入,即可使用所有功能

#### 2. 已有帳號? 直接登入

- **Email or Username**: 輸入註冊的信箱或用戶名
- **Password**: 輸入密碼
- **點擊「Log In」**: 立即開始使用

#### 3. 為什麼需要登入?

- ✅ **免費額度**: 每月慷慨的 AI 生成額度
- ✅ **雲端同步**: 圖片記錄自動保存到雲端
- ✅ **多設備訪問**: 手機、電腦無縫切換
- ✅ **無需付費**: 完全免費,無需信用卡

#### 4. 忘記密碼?

點擊「Forgot password?」重置密碼

---

### ✨ 功能特色

#### ⚡ FLUX.2 圖像生成
- ✅ **FLUX.2 Pro**: 最高品質,完美文字渲染、複雜排版、資訊圖
- ✅ **FLUX.2 Flex**: 彈性模型,平衡速度與品質,支持自定義尺寸
- ✅ **FLUX.2 Dev**: 開發版本,適合實驗與測試
- ✅ **風格選擇器**: 13種專業風格 (寫實/動漫/油畫/賽博龐克等),自動追加優化提示詞
- ✅ **批量生成**: 一次生成 1-4 張圖片,並行處理
- ✅ **圖像比例**: 7種預設比例 (1:1, 16:9, 9:16, 3:2, 2:3, 4:3, 3:4)
- ✅ **官方 API**: 使用 Puter.js 官方推薦格式,簡單可靠

#### 🤖 AI 聊天
- GPT-4o • Claude Sonnet 3.5 • GPT-5 Nano
- 實時對話、多模型切換

#### 📝 OCR 文字識別
- 圖像轉文字功能
- 支持 URL 輸入

#### 🖼️ 圖片記錄管理
- 本地 LocalStorage 自動保存 (最多 50 張)
- 複製提示詞 + 放大查看 + 下載 + 刪除
- 統計信息 (總生成數 + 儲存空間)

#### 🆓 完全免費
- 無需 API 金鑰
- 無需後端配置
- 一鍵部署

---

### 📋 版本更新記錄

#### v1.3.0 (2025-12-02)
- 🎨 **UI 修復**: 恢復完整 CSS 樣式,修復顯示問題
- 📝 **文檔更新**: 添加雙語 README (中英文)
- ✨ **版本歷史**: 新增版本更新記錄章節

#### v1.2.0 (2025-12-02)
- 🔢 **批量生成**: 支持一次生成 1-4 張圖片,並行處理
- 📊 **進度顯示**: 實時顯示生成進度 (已完成 X/Y)
- 🎨 **網格佈局**: 響應式網格展示多張圖片
- 💾 **自動保存**: 所有生成圖片自動保存到歷史記錄

#### v1.1.0 (2025-12-02)
- 🎨 **風格選擇**: 13 種專業風格預設
- 📐 **圖像比例**: 7 種預設圖像比例 (1:1 到 16:9)
- ⚙️ **進階參數**: Flex/Dev 模型支持步數和種子控制
- ⚠️ **FLUX.2 Pro 限制**: 自動鎖定 1024x1024 並提示

#### v1.0.0 (2025-12-01)
- 🚀 **初始版本**: FLUX.2 Pro/Flex/Dev 支持
- 🤖 **AI 聊天**: GPT-4o、Claude Sonnet 3.5、GPT-5 Nano
- 📝 **OCR 識別**: 圖像轉文字功能
- 🖼️ **歷史管理**: 基於 LocalStorage 的圖片記錄
- 🆓 **免費部署**: Zeabur 一鍵部署

---

### 🚀 快速部署

#### Zeabur 一鍵部署 (推薦)

1. **點擊部署按鈕**:
   [![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates)

2. **選擇此倉庫**: `kinai9661/Puter`

3. **自動部署**: 約 1-2 分鐘完成

4. **獲得域名**: `your-app.zeabur.app`

5. **訪問應用**: 會自動彈出 Puter.com 登入視窗,註冊/登入後即可使用

#### 本地運行

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

### 📸 圖像比例選擇

應用支持 **7 種預設比例**,適合不同用途:

| 比例 | 尺寸 | 適用場景 | FLUX.2 Pro | FLUX.2 Flex/Dev |
|------|------|----------|-----------|----------------|
| 🔳 **1:1 正方形** | 1024x1024 | 社交媒體、頭像、產品圖 | ✅ 支持 | ✅ 支持 |
| 📺 **3:2 橫向** | 1536x1024 | 風景攝影、橫向海報 | ❌ 不支持 | ✅ 支持 |
| 📱 **2:3 縱向** | 1024x1536 | 人像攝影、直向海報 | ❌ 不支持 | ✅ 支持 |
| 🎞️ **16:9 寬螢幕** | 1920x1024 | 橫幅、頭圖、YouTube | ❌ 不支持 | ✅ 支持 |
| 📱 **9:16 手機直向** | 1024x1920 | 手機壁紙、Stories | ❌ 不支持 | ✅ 支持 |
| 📋 **3:4 縱向** | 768x1024 | 傳統縱向排版 | ❌ 不支持 | ✅ 支持 |
| 🖼️ **4:3 傳統比例** | 1024x768 | 傳統橫向排版 | ❌ 不支持 | ✅ 支持 |

#### ⚠️ FLUX.2 Pro 限制

根據 [Puter.js 官方範例](https://developer.puter.com/blog/flux-2-in-puter-js/), **FLUX.2 Pro 只支持 1024x1024** 尺寸：

- ✅ **官方預設**: 固定 1024x1024,無需指定 width/height
- ❌ **無法自定義**: 不支持其他尺寸選項
- 🏆 **最高品質**: 專業級生成品質

**使用建議**:
- 需要其他比例？使用 **FLUX.2 Flex** 或 **FLUX.2 Dev**
- 需要最高品質？使用 **FLUX.2 Pro** (僅 1:1)

---

### 🎨 風格選擇指南

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

---

### 📁 專案結構

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

### 🛠️ 技術棧

- **後端**: Node.js 18+ + Express 4.x
- **前端**: Vanilla JavaScript + Puter.js v2 SDK
- **AI 模型**: FLUX.2 (Black Forest Labs) + GPT/Claude
- **認證**: Puter.com OAuth (自動彈窗)
- **部署**: Zeabur / Vercel / Cloudflare Workers
- **儲存**: LocalStorage (前端) + Puter Cloud (可選)

---

### 📖 API 使用示例

#### FLUX.2 Pro 圖像生成 (官方簡化格式)

```javascript
// ✅ FLUX.2 Pro: 只需 2 個參數
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

#### FLUX.2 Flex/Dev 圖像生成 (完整參數格式)

```javascript
// ✅ FLUX.2 Flex/Dev: 支持自定義尺寸
puter.ai.txt2img(
    "A majestic dragon on a mountain peak",
    {
        model: "black-forest-labs/FLUX.2-flex",
        width: 1920,        // ✅ 自定義寬度
        height: 1080,       // ✅ 自定義高度
        steps: 30,          // ✅ 生成步數
        seed: 42,           // ✅ 隨機種子
        disable_safety_checker: true
    }
).then(imageElement => {
    document.body.appendChild(imageElement);
});
```

---

### 🐛 常見問題

#### 1. 無法登入 Puter.com?

**解決方案**:
- 確保網路連接正常
- 清除瀏覽器快取後重試
- 嘗試使用無痕模式
- 檢查是否被防火牆阻擋

#### 2. 圖像生成失敗?

**解決方案**:
- 切換到 `FLUX.2-flex` (更快速)
- 簡化提示詞內容
- 嘗試不同風格
- 嘗試 `gpt-image-1` 或 `dall-e-3`
- 檢查登入狀態

#### 3. 為什麼 FLUX.2 Pro 無法設置圖像尺寸?

FLUX.2 Pro 固定為 1024x1024,由模型自動決定最佳解析度。若需要其他尺寸,請使用 FLUX.2 Flex 或 Dev。

#### 4. 生成時間多久?

- FLUX.2 Pro: 20-40 秒
- FLUX.2 Flex: 15-30 秒
- FLUX.2 Dev: 15-30 秒
- GPT Image-1: 5-15 秒

#### 5. 風格選擇不生效?

確保:
- 已選擇風格 (非「無」)
- 瀏覽器控制台無錯誤
- 更新到最新版本代碼

#### 6. 是否支持商業用途?

是的,生成的圖像可用於商業專案,但請查閱 [Puter.js 服務條款](https://puter.com/terms)。

---

### 🔗 相關連結

- **Puter.js 官網**: [https://puter.com](https://puter.com)
- **Puter.com 註冊**: [https://puter.com/app](https://puter.com/app)
- **FLUX.2 部落格**: [https://developer.puter.com/blog/flux-2-in-puter-js/](https://developer.puter.com/blog/flux-2-in-puter-js/)
- **API 文檔**: [https://docs.puter.com](https://docs.puter.com)
- **Black Forest Labs**: [https://blackforestlabs.ai](https://blackforestlabs.ai)
- **Zeabur 文檔**: [https://zeabur.com/docs](https://zeabur.com/docs)

---

### 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

---

### ⭐ Star History

如果這個專案對您有幫助,請給個星星! 🚀

[![Star History Chart](https://api.star-history.com/svg?repos=kinai9661/Puter&type=Date)](https://star-history.com/#kinai9661/Puter&Date)

---

<div align="center">
  <p>由 <a href="https://github.com/kinai9661" target="_blank">kinai9661</a> 開發 | 基於 <a href="https://puter.com" target="_blank">Puter.js</a> 官方 API</p>
  <p>Made by <a href="https://github.com/kinai9661" target="_blank">kinai9661</a> | Powered by <a href="https://puter.com" target="_blank">Puter.js</a> Official API</p>
</div>