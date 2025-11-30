# Puter AI - 免費 FLUX.2 圖像生成 + AI 聊天

🚀 使用 Puter.js 官方 API 的完整 Web 應用,支持 **Black Forest Labs FLUX.2** 最新圖像生成模型

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com)

## ✨ 功能特色

### ⚡ FLUX.2 圖像生成
- ✅ **FLUX.2 Pro**: 最高品質,完美文字渲染、複雜排版、資訊圖
- ✅ **FLUX.2 Flex**: 彈性模型,平衡速度與品質
- ✅ **FLUX.2 Dev**: 開發版本,適合實驗與測試
- ✅ **官方 API**: 無需自訂參數 (width/height/steps),簡單可靠

### 🤖 AI 聊天
- GPT-4o • Claude Sonnet 3.5 • GPT-5 Nano
- 實時對話、多模型切換

### 📝 OCR 文字識別
- 圖像轉文字功能
- 支持 URL 輸入

### 🆓 完全免費
- 無需 API 金鑰
- 無需後端配置
- 一鍵部署

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

訪問 `http://localhost:3000`

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
    ├── index.html      # 主頁面 (FLUX.2 UI)
    ├── style.css       # 樣式表
    └── app.js          # 前端邏輯 (FLUX.2 API)
```

---

## 🛠️ 技術棧

- **後端**: Node.js 18+ + Express 4.x
- **前端**: Vanilla JavaScript + Puter.js v2 SDK
- **AI 模型**: FLUX.2 (Black Forest Labs) + GPT/Claude
- **部署**: Zeabur / Vercel / Cloudflare Workers
- **認證**: 無需 (Puter.js 內建)

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

**電影海報**:
```
A vintage movie poster for 'The Last Voyage', 
featuring bold art deco typography with the tagline 
'An Adventure Beyond Time' and 'Coming Soon 2024' at the bottom
```

**資訊圖**:
```
Create an infographic that shows how to make coffee step by step,
with clear icons and text labels
```

**奇幻藝術**:
```
A majestic dragon perched on a mountain peak, 
fantasy art style, detailed scales, dramatic lighting, 8K quality
```

### 模型選擇

| 模型 | 用途 | 速度 | 品質 |
|------|------|------|------|
| FLUX.2 Pro | 生產環境、商業用途 | 中 | ⭐⭐⭐⭐⭐ |
| FLUX.2 Flex | 快速預覽、實驗 | 快 | ⭐⭐⭐⭐ |
| FLUX.2 Dev | 開發測試 | 中 | ⭐⭐⭐⭐ |
| GPT Image-1 | 備用選項 | 快 | ⭐⭐⭐ |
| DALL-E 3 | 經典模型 | 中 | ⭐⭐⭐⭐ |

---

## 🐛 常見問題

### 1. 圖像生成失敗?

**解決方案**:
- 切換到 `FLUX.2-flex` (更快速)
- 簡化提示詞內容
- 嘗試 `gpt-image-1` 或 `dall-e-3`
- 檢查網路連接

### 2. 為什麼無法設置圖像尺寸?

Puter.js FLUX.2 API 不支持自訂尺寸,由模型自動決定最佳解析度。

### 3. 生成時間多久?

- FLUX.2 Pro: 15-30 秒
- FLUX.2 Flex: 10-20 秒
- GPT Image-1: 5-15 秒

### 4. 是否支持商業用途?

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
- **FLUX.2 部落格**: [https://developer.puter.com/blog/flux-2-in-puter-js/](https://developer.puter.com/blog/flux-2-in-puter-js/)
- **API 文檔**: [https://docs.puter.com](https://docs.puter.com)
- **Black Forest Labs**: [https://blackforestlabs.ai](https://blackforestlabs.ai)
- **Zeabur 文檔**: [https://zeabur.com/docs](https://zeabur.com/docs)

---

## ⭐ Star History

如果這個專案對您有幫助,請給個星星! 🚀

[![Star History Chart](https://api.star-history.com/svg?repos=kinai9661/Puter&type=Date)](https://star-history.com/#kinai9661/Puter&Date)

---

**開發者**: kinai9661  
**最後更新**: 2025-12-01  
**版本**: 2.0.0 (FLUX.2 官方支持)
