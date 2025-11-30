# Puter.js AI 應用 - Zeabur 部署方案

🚀 使用 Puter.js 免費 AI API 的完整 Web 應用程式,支援多種 FLUX 圖像生成模型

## ✨ 功能特色

- 🤖 **AI 聊天**: 支援 GPT-4o、Claude Sonnet 3.5、GPT-5 Nano
- 🎨 **圖像生成**: 14 種 FLUX 模型 + DALL-E 3
- 📝 **OCR**: 圖像轉文字功能
- ⚙️ **高級選項**: 自訂圖像尺寸、步數、引導強度
- 🆓 **完全免費**: 無需 API 金鑰

## 🎯 支援的 FLUX 模型

### FLUX 2 系列 (最新)
- FLUX.2 Pro (最高品質)
- FLUX.2 Dev
- FLUX.2 Flex (彈性)

### FLUX 1.1 系列
- FLUX.1.1 Pro

### FLUX 1 Pro 系列
- FLUX.1 Pro
- FLUX.1 Canny Pro (邊緣檢測)

### FLUX 1 Dev 系列
- FLUX.1 Dev
- FLUX.1 Dev LoRA

### FLUX 1 Kontext 系列
- FLUX.1 Kontext Max
- FLUX.1 Kontext Pro
- FLUX.1 Kontext Dev

### FLUX 1 Schnell 系列 (快速)
- FLUX.1 Schnell
- FLUX.1 Schnell Free

### FLUX 1 Krea 系列
- FLUX.1 Krea Dev

## 🚀 快速部署

### Zeabur 一鍵部署

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates)

1. 點擊上方按鈕
2. 選擇此倉庫
3. 自動部署完成

### 手動部署

```bash
# 克隆倉庫
git clone https://github.com/kinai9661/Puter.git
cd Puter

# 安裝依賴
npm install

# 本地運行
npm start
```

訪問 `http://localhost:3000`

## 📁 專案結構

```
Puter/
├── package.json          # 專案配置
├── server.js            # Express 伺服器
├── zbpack.json          # Zeabur 部署配置
└── public/
    ├── index.html       # 主頁面
    ├── style.css        # 樣式表
    └── app.js           # 前端邏輯
```

## 🛠️ 技術棧

- **後端**: Node.js + Express
- **前端**: 原生 JavaScript + Puter.js SDK
- **部署**: Zeabur
- **AI 服務**: Puter.js (免費)

## 📖 使用說明

### AI 聊天
1. 選擇 AI 模型 (GPT-4o/Claude/GPT-5 Nano)
2. 輸入訊息
3. 點擊發送或按 Enter

### 圖像生成
1. 選擇 FLUX 模型
2. 輸入圖像描述
3. (可選) 調整高級選項
4. 點擊生成圖像
5. 下載生成的圖像

### OCR 文字提取
1. 輸入圖像 URL
2. 點擊提取文字
3. 查看提取結果

## 🌐 線上示範

部署後您將獲得類似以下的 URL:
- `https://your-app.zeabur.app`

## 📝 環境需求

- Node.js >= 18.0.0
- npm 或 yarn

## 🔧 自訂配置

### 修改端口

編輯 `server.js`:
```javascript
const PORT = process.env.PORT || 3000;
```

### 調整預設參數

編輯 `public/index.html` 中的預設值:
```html
<input type="number" id="img-width" value="1024" min="256" max="2048" step="64">
```

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request!

## 📄 授權

MIT License

## 🔗 相關連結

- [Puter.js 文檔](https://docs.puter.com)
- [Zeabur 文檔](https://zeabur.com/docs)
- [FLUX 模型介紹](https://blackforestlabs.ai)

---

⭐ 如果這個專案對您有幫助,請給個星星!
