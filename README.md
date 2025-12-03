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

### ✅ **FLUX.2 Series Now Working!**

**Update** (2025-12-04):

🎉 **FLUX.2 series are now working properly!** After thorough investigation and fixes:
- ✅ **FLUX.2-pro** - Working
- ✅ **FLUX.2-flex** - Working
- ✅ **FLUX.2-dev** - Working

**What was fixed**:
- Enhanced error handling with detailed logging
- Fixed LocalStorage permissions in iframe environments
- Standardized API calls following official documentation
- Complete error object capture for better debugging

**Technical Documentation**:
- 📊 [Complete Fix Report](docs/FLUX2_FIX_REPORT.md) - Detailed diagnosis process
- ✅ [Issue Resolved](docs/FLUX2_ISSUE_RESOLVED.md) - Final resolution confirmation
- 📝 [Changelog](CHANGELOG.md) - All version updates

---

### ✨ Features

#### ⚡ FLUX Image Generation

**Available Models**:

| Model | Type | Quality | Speed | Text Rendering | Custom Size | Cost |
|-------|------|---------|-------|---------------|-------------|------|
| **FLUX.2-pro** | Professional | ⭐⭐⭐⭐⭐ | Slow | Perfect | ❌ 1024x1024 only | ✅ Free |  
| **FLUX.2-flex** | Flexible | ⭐⭐⭐⭐ | Medium | Excellent | ✅ Yes | ✅ Free |
| **FLUX.2-dev** | Development | ⭐⭐⭐⭐ | Medium | Excellent | ✅ Yes | ✅ Free |
| **FLUX.1-schnell** | Fast | ⭐⭐⭐ | Very Fast | Good | ✅ Yes | ✅ Free |
| **FLUX.1-dev** | Development | ⭐⭐⭐⭐ | Medium | Very Good | ✅ Yes | ✅ Free |
| **FLUX.1-pro** | Professional | ⭐⭐⭐⭐⭐ | Slow | Perfect | ✅ Yes | ✅ Free |
| **FLUX.1.1-pro** | Latest | ⭐⭐⭐⭐⭐ | Medium | Perfect | ✅ Yes | ✅ Free |

**All models are completely free through Puter.js!** 🎉

**Features**:
- ✅ **Style Selector**: 13 professional styles (Realistic/Anime/Oil Painting/Cyberpunk, etc.)
- ✅ **Batch Generation**: Generate 1-4 images at once with parallel processing
- ✅ **Image Ratios**: 7 preset ratios (1:1, 16:9, 9:16, 3:2, 2:3, 4:3, 3:4)
- ✅ **Official API**: Uses Puter.js officially recommended format

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

#### v1.4.0 (2025-12-04) - Fixed Release 🎉

**✅ FLUX.2 Issue Resolved**:
- Thorough investigation of error causes
- Enhanced error handling system
- Fixed LocalStorage iframe permissions
- Standardized API calls
- Complete documentation of fix process

**📊 Enhanced Debugging**:
- Deep error object analysis
- Capture `error.error`, `error.status`, `error.response`
- Complete error JSON serialization
- Beautiful error log formatting

#### v1.3.0 (2025-12-02)
- 🎨 **UI Fix**: Restored complete CSS styles
- 📝 **Documentation**: Added bilingual README
- ✨ **Version History**: Added changelog

#### v1.2.0 (2025-12-02)
- 🔢 **Batch Generation**: 1-4 images parallel processing
- 📊 **Progress Display**: Real-time progress (X/Y)
- 🎨 **Grid Layout**: Responsive image grid
- 💾 **Auto Save**: Automatic history saving

#### v1.1.0 (2025-12-02)
- 🎨 **Style Selector**: 13 professional styles
- 📐 **Aspect Ratios**: 7 preset ratios
- ⚙️ **Advanced Parameters**: Steps and seed control

#### v1.0.0 (2025-12-01)
- 🚀 **Initial Release**: FLUX.2 support
- 🤖 **AI Chat**: Multiple models
- 📝 **OCR**: Image-to-text

For complete changelog, see [CHANGELOG.md](CHANGELOG.md)

---

### 🚀 Quick Deployment

#### Zeabur One-Click Deploy (Recommended)

1. **Click deploy button**:
   [![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates)

2. **Select this repository**: `kinai9661/Puter`

3. **Auto deployment**: Completes in ~1-2 minutes

4. **Get domain**: `your-app.zeabur.app`

5. **Access app**: Puter.com login popup will appear automatically

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

Visit `http://localhost:3000`

---

### 🐛 FAQ

#### 1. How is FLUX.2 now free?

**Answer**: Through Puter.js free API! All FLUX models (both FLUX.2 and FLUX.1 series) are available at no cost.

#### 2. Which model should I choose?

**For Best Quality**:
- 🏆 FLUX.2-pro - Highest quality, perfect text
- 🏆 FLUX.1-pro / FLUX.1.1-pro - Excellent quality

**For Speed**:
- ⚡ FLUX.1-schnell - Fastest generation
- 🔄 FLUX.2-flex - Balanced speed/quality

**For Flexibility**:
- 🔧 FLUX.2-flex - Custom sizes
- 🔧 FLUX.2-dev - Development testing

#### 3. Cannot login to Puter.com?

**Solutions**:
- Ensure network connection is normal
- Clear browser cache and retry
- Try incognito mode
- Check firewall settings

#### 4. Generation time?

- FLUX.2-pro: 20-40 seconds
- FLUX.2-flex: 15-30 seconds
- FLUX.1-pro: 15-30 seconds
- FLUX.1-schnell: 5-15 seconds

---

### 🔗 Links

**Project Documentation**:
- 📝 [CHANGELOG.md](CHANGELOG.md) - Version history
- 📊 [FLUX2_FIX_REPORT.md](docs/FLUX2_FIX_REPORT.md) - Complete fix report
- ✅ [FLUX2_ISSUE_RESOLVED.md](docs/FLUX2_ISSUE_RESOLVED.md) - Issue resolution

**External Resources**:
- **Puter.js Official**: [https://puter.com](https://puter.com)
- **FLUX.2 Blog**: [https://developer.puter.com/blog/flux-2-in-puter-js/](https://developer.puter.com/blog/flux-2-in-puter-js/)
- **API Documentation**: [https://docs.puter.com](https://docs.puter.com)
- **Black Forest Labs**: [https://blackforestlabs.ai](https://blackforestlabs.ai)

---

### 📄 License

MIT License - See [LICENSE](LICENSE) file for details

---

## 🇨🇳 中文版

🚀 使用 Puter.js 官方 API 的完整 Web 應用,支持 **Black Forest Labs FLUX.2** 最新圖像生成模型

[![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com)

> ⚠️ **重要提示**: 建議自行建設部署，因官方 API 存在潛在限制  
> 免費用戶享有慷慨額度適合一般使用，但高頻或長請求可能觸發速率限制或防濫用機制  
> ✅ 自行部署可完全掌控使用體驗

---

### ✅ **FLUX.2 系列現已正常工作！**

**更新** (2025-12-04):

🎉 **FLUX.2 系列現在可以正常使用！** 經過徹底調查和修復:
- ✅ **FLUX.2-pro** - 正常工作
- ✅ **FLUX.2-flex** - 正常工作
- ✅ **FLUX.2-dev** - 正常工作

**修復內容**:
- 增強錯誤處理，詳細日誌記錄
- 修復 iframe 環境中的 LocalStorage 權限
- 遵循官方文檔標準化 API 調用
- 完整捕獲錯誤對象以便更好調試

**技術文檔**:
- 📊 [完整修復報告](docs/FLUX2_FIX_REPORT.md) - 詳細診斷過程
- ✅ [問題已解決](docs/FLUX2_ISSUE_RESOLVED.md) - 最終解決確認
- 📝 [更新記錄](CHANGELOG.md) - 所有版本更新

---

### ✨ 功能特色

#### ⚡ FLUX 圖像生成

**可用模型**:

| 模型 | 類型 | 品質 | 速度 | 文字渲染 | 自定義尺寸 | 費用 |
|------|------|------|------|----------|-----------|------|
| **FLUX.2-pro** | 專業版 | ⭐⭐⭐⭐⭐ | 慢 | 完美 | ❌ 僅1024x1024 | ✅ 免費 |
| **FLUX.2-flex** | 彈性版 | ⭐⭐⭐⭐ | 中 | 優秀 | ✅ 支持 | ✅ 免費 |
| **FLUX.2-dev** | 開發版 | ⭐⭐⭐⭐ | 中 | 優秀 | ✅ 支持 | ✅ 免費 |
| **FLUX.1-schnell** | 快速版 | ⭐⭐⭐ | 很快 | 良好 | ✅ 支持 | ✅ 免費 |
| **FLUX.1-dev** | 開發版 | ⭐⭐⭐⭐ | 中 | 很好 | ✅ 支持 | ✅ 免費 |
| **FLUX.1-pro** | 專業版 | ⭐⭐⭐⭐⭐ | 慢 | 完美 | ✅ 支持 | ✅ 免費 |
| **FLUX.1.1-pro** | 最新版 | ⭐⭐⭐⭐⭐ | 中 | 完美 | ✅ 支持 | ✅ 免費 |

**所有模型通過 Puter.js 完全免費！** 🎉

**功能特色**:
- ✅ **風格選擇器**: 13種專業風格 (寫實/動漫/油畫/賽博龐克等)
- ✅ **批量生成**: 一次生成 1-4 張圖片，並行處理
- ✅ **圖像比例**: 7種預設比例 (1:1, 16:9, 9:16, 3:2, 2:3, 4:3, 3:4)
- ✅ **官方 API**: 使用 Puter.js 官方推薦格式

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

#### v1.4.0 (2025-12-04) - 修復版本 🎉

**✅ FLUX.2 問題已解決**:
- 徹底調查錯誤原因
- 增強錯誤處理系統
- 修復 LocalStorage iframe 權限
- 標準化 API 調用
- 完整記錄修復過程

**📊 調試增強**:
- 深度錯誤對象分析
- 捕獲 `error.error`、`error.status`、`error.response`
- 完整錯誤 JSON 序列化
- 美化錯誤日誌格式

#### v1.3.0 (2025-12-02)
- 🎨 **UI 修復**: 恢復完整 CSS 樣式
- 📝 **文檔更新**: 添加雙語 README
- ✨ **版本歷史**: 新增更新記錄

#### v1.2.0 (2025-12-02)
- 🔢 **批量生成**: 1-4 張並行處理
- 📊 **進度顯示**: 實時進度 (X/Y)
- 🎨 **網格佈局**: 響應式圖片網格
- 💾 **自動保存**: 自動歷史記錄

#### v1.1.0 (2025-12-02)
- 🎨 **風格選擇**: 13 種專業風格
- 📐 **圖像比例**: 7 種預設比例
- ⚙️ **進階參數**: 步數和種子控制

#### v1.0.0 (2025-12-01)
- 🚀 **初始版本**: FLUX.2 支持
- 🤖 **AI 聊天**: 多個模型
- 📝 **OCR 識別**: 圖像轉文字

完整更新記錄請見 [CHANGELOG.md](CHANGELOG.md)

---

### 🚀 快速部署

#### Zeabur 一鍵部署 (推薦)

1. **點擊部署按鈕**:
   [![Deploy on Zeabur](https://zeabur.com/button.svg)](https://zeabur.com/templates)

2. **選擇此倉庫**: `kinai9661/Puter`

3. **自動部署**: 約 1-2 分鐘完成

4. **獲得域名**: `your-app.zeabur.app`

5. **訪問應用**: 會自動彈出 Puter.com 登入視窗

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

訪問 `http://localhost:3000`

---

### 🐛 常見問題

#### 1. FLUX.2 為什麼現在免費了?

**答案**: 通過 Puter.js 免費 API！所有 FLUX 模型（FLUX.2 和 FLUX.1 系列）都可以免費使用。

#### 2. 應該選擇哪個模型?

**追求最高品質**:
- 🏆 FLUX.2-pro - 最高品質，完美文字
- 🏆 FLUX.1-pro / FLUX.1.1-pro - 優秀品質

**追求速度**:
- ⚡ FLUX.1-schnell - 最快生成
- 🔄 FLUX.2-flex - 速度品質平衡

**追求靈活性**:
- 🔧 FLUX.2-flex - 自定義尺寸
- 🔧 FLUX.2-dev - 開發測試

#### 3. 無法登入 Puter.com?

**解決方案**:
- 確保網路連接正常
- 清除瀏覽器快取後重試
- 嘗試使用無痕模式
- 檢查防火牆設置

#### 4. 生成時間多久?

- FLUX.2-pro: 20-40 秒
- FLUX.2-flex: 15-30 秒
- FLUX.1-pro: 15-30 秒
- FLUX.1-schnell: 5-15 秒

---

### 🔗 相關連結

**項目文檔**:
- 📝 [CHANGELOG.md](CHANGELOG.md) - 版本更新記錄
- 📊 [FLUX2_FIX_REPORT.md](docs/FLUX2_FIX_REPORT.md) - 完整修復報告
- ✅ [FLUX2_ISSUE_RESOLVED.md](docs/FLUX2_ISSUE_RESOLVED.md) - 問題解決確認

**外部資源**:
- **Puter.js 官網**: [https://puter.com](https://puter.com)
- **FLUX.2 部落格**: [https://developer.puter.com/blog/flux-2-in-puter-js/](https://developer.puter.com/blog/flux-2-in-puter-js/)
- **API 文檔**: [https://docs.puter.com](https://docs.puter.com)
- **Black Forest Labs**: [https://blackforestlabs.ai](https://blackforestlabs.ai)

---

### 📄 授權

MIT License - 詳見 [LICENSE](LICENSE) 檔案

---

<div align="center">
  <p>由 <a href="https://github.com/kinai9661" target="_blank">kinai9661</a> 開發 | 基於 <a href="https://puter.com" target="_blank">Puter.js</a> 官方 API</p>
  <p>Made by <a href="https://github.com/kinai9661" target="_blank">kinai9661</a> | Powered by <a href="https://puter.com" target="_blank">Puter.js</a> Official API</p>
  
  <p><strong>⭐ 如果這個專案對您有幫助，請給個星星！</strong></p>
  <p><strong>⭐ Star this project if you find it helpful!</strong></p>
</div>
