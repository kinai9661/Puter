// DOM 元素
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');

const imageModelSelect = document.getElementById('image-model-select');
const styleSelect = document.getElementById('style-select');
const modelInfo = document.getElementById('model-info');
const stylePreview = document.getElementById('style-preview');
const imagePrompt = document.getElementById('image-prompt');
const generateImgBtn = document.getElementById('generate-img-btn');
const imageResult = document.getElementById('image-result');

const historyGrid = document.getElementById('history-grid');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const totalCountEl = document.getElementById('total-count');
const storageSizeEl = document.getElementById('storage-size');

const imageUrl = document.getElementById('image-url');
const ocrBtn = document.getElementById('ocr-btn');
const ocrResult = document.getElementById('ocr-result');

// 圖片記錄管理
const HISTORY_KEY = 'puter_ai_image_history';
const MAX_HISTORY = 50; // 最多保存50張圖片

class ImageHistory {
    constructor() {
        this.history = this.loadHistory();
    }

    loadHistory() {
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('載入記錄失敗:', error);
            return [];
        }
    }

    saveHistory() {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
        } catch (error) {
            console.error('保存記錄失敗:', error);
            // 如果存儲空間不足,刪除最舊的記錄
            if (this.history.length > 10) {
                this.history = this.history.slice(-10);
                this.saveHistory();
            }
        }
    }

    addImage(imageData, prompt, model) {
        const record = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            imageData,
            prompt,
            model,
            modelName: model.split('/').pop() || model
        };

        this.history.unshift(record);
        
        // 限制記錄數量
        if (this.history.length > MAX_HISTORY) {
            this.history = this.history.slice(0, MAX_HISTORY);
        }

        this.saveHistory();
        return record;
    }

    deleteImage(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveHistory();
    }

    clearAll() {
        this.history = [];
        this.saveHistory();
    }

    getStorageSize() {
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? (new Blob([data]).size / 1024).toFixed(2) : 0;
        } catch (error) {
            return 0;
        }
    }
}

const imageHistory = new ImageHistory();

// Tab 切換
const tabBtns = document.querySelectorAll('.tab-btn');
const sections = document.querySelectorAll('.section');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetTab = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `${targetTab}-section`) {
                section.classList.add('active');
            }
        });

        // 切換到記錄頁時更新顯示
        if (targetTab === 'history') {
            renderHistory();
        }
    });
});

// 複製提示詞功能
function copyPrompt(prompt) {
    navigator.clipboard.writeText(prompt).then(() => {
        showNotification('✅ 提示詞已複製!');
    }).catch(err => {
        console.error('複製失敗:', err);
        showNotification('❌ 複製失敗', 'error');
    });
}

// 通知提示
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
        color: white;
        border-radius: 12px;
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// 風格說明
const styleDescriptions = {
    '': '無 - 自由風格，不添加額外風格提示詞',
    'photorealistic': '📸 寫實風格 - 超高清收寫實效果，適合人物、風景、產品摩',
    'anime': '🌸 日本動漫風格 - 吉卜力工作室風格，細臻背景',
    'digital-art': '🖼️ 數位藝術 - 現代數位繪畫風格，鮮豔色彩',
    'oil-painting': '🎨 油畫風格 - 經典油畫質感，藝術大師風格',
    'watercolor': '🌊 水彩畫 - 柔和水彩效果，夢境感',
    'sketch': '✏️ 素描風格 - 手繪素描效果，藝術草圖',
    '3d-render': '🎬 3D 渲染 - 高品質 3D 建模效果',
    'cyberpunk': '🤖 賽博龐克 - 未來科技、霸燈風格',
    'fantasy': '✨ 奇幻風格 - 魔幻奇幻世界，史詩感',
    'minimalist': '📍 極簡主義 - 簡潔設計，留白美學',
    'vintage': '📼 复古風格 - 老照片質感，復古色調',
    'comic': '📖 漫畫風格 - 美式漫畫/漫畫風格',
    'surreal': '🌀 超現實主義 - 超現實藝術，夢境感'
};

// 更新風格預覽
function updateStylePreview() {
    if (!styleSelect || !stylePreview) return;
    
    const selectedStyle = styleSelect.value;
    const description = styleDescriptions[selectedStyle] || '選擇風格後，會自動加入到提示詞中';
    
    stylePreview.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>${description}</span>
    `;
}

// 放大圖片功能
function openImageModal(imageData, prompt, modelName) {
    // 創建模態視窗
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    
    // 處理提示詞，避免 HTML 和 JS 注入
    const safePrompt = prompt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const jsPrompt = prompt.replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, '\\n');
    
    modal.innerHTML = `
        <div class="modal-backdrop"></div>
        <div class="modal-content">
            <button class="modal-close" aria-label="關閉">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
            <img src="${imageData}" alt="Generated image" />
            <div class="modal-info">
                <div class="modal-prompt">
                    <strong>📝 提示詞:</strong>
                    <p>${safePrompt}</p>
                </div>
                <div class="modal-meta">
                    <span class="modal-model">🎨 ${modelName}</span>
                    <div class="modal-actions">
                        <button class="btn-modal-action btn-copy-prompt" title="複製提示詞">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            複製提示詞
                        </button>
                        <a href="${imageData}" download="flux-${modelName}-${Date.now()}.png" class="btn-modal-action">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            下載圖片
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // 添加複製事件
    modal.querySelector('.btn-copy-prompt').addEventListener('click', () => {
        copyPrompt(prompt);
    });
    
    // 添加關閉事件
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.remove());
    
    // ESC 鍵關閉
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEsc);
        }
    };
    document.addEventListener('keydown', handleEsc);
}

// 渲染圖片記錄
function renderHistory() {
    const history = imageHistory.history;
    
    // 更新統計信息
    totalCountEl.textContent = history.length;
    storageSizeEl.textContent = `${imageHistory.getStorageSize()} KB`;

    if (history.length === 0) {
        historyGrid.innerHTML = `
            <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
                <p>尚無生成記錄</p>
                <small>開始生成圖片後,記錄會自動保存在這裡</small>
            </div>
        `;
        return;
    }

    historyGrid.innerHTML = '';
    
    history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.dataset.id = item.id;
        
        const truncatedPrompt = item.prompt.substring(0, 80) + (item.prompt.length > 80 ? '...' : '');
        
        historyItem.innerHTML = `
            <img src="${item.imageData}" alt="${truncatedPrompt}" loading="lazy">
            <div class="history-overlay">
                <div class="history-info">
                    <span class="history-model">${item.modelName}</span>
                    <span class="history-date">${new Date(item.timestamp).toLocaleString('zh-TW')}</span>
                </div>
                <p class="history-prompt">${truncatedPrompt}</p>
                <div class="history-actions">
                    <button class="btn-icon btn-copy" title="複製提示詞">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>
                    <button class="btn-icon btn-zoom" title="放大查看">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                        </svg>
                    </button>
                    <a href="${item.imageData}" download="flux-${item.modelName}-${item.id}.png" class="btn-icon" title="下載">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </a>
                    <button class="btn-icon btn-delete" title="刪除">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        // 綁定事件
        const img = historyItem.querySelector('img');
        const btnCopy = historyItem.querySelector('.btn-copy');
        const btnZoom = historyItem.querySelector('.btn-zoom');
        const btnDelete = historyItem.querySelector('.btn-delete');
        
        img.addEventListener('click', () => openImageModal(item.imageData, item.prompt, item.modelName));
        btnCopy.addEventListener('click', (e) => {
            e.stopPropagation();
            copyPrompt(item.prompt);
        });
        btnZoom.addEventListener('click', (e) => {
            e.stopPropagation();
            openImageModal(item.imageData, item.prompt, item.modelName);
        });
        btnDelete.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('確定要刪除這張圖片嗎?')) {
                imageHistory.deleteImage(item.id);
                renderHistory();
            }
        });
        
        historyGrid.appendChild(historyItem);
    });
}

// 清空記錄
clearHistoryBtn.addEventListener('click', () => {
    if (confirm('確定要清空所有圖片記錄嗎?此操作無法撤銷!')) {
        imageHistory.clearAll();
        renderHistory();
    }
});

// 模型資訊
const modelDescriptions = {
    'black-forest-labs/FLUX.2-pro': '🏆 FLUX.2 Pro: 最新一代專業級模型,完美文字渲染與提示詞遵循',
    'black-forest-labs/FLUX.2-flex': '🔄 FLUX.2 Flex: 彈性模型,適應多種生成需求',
    'black-forest-labs/FLUX.2-dev': '🔧 FLUX.2 Dev: 開發版本,適合實驗與測試',
    'gpt-image-1': '🤖 GPT Image-1: Puter 預設高品質模型',
    'dall-e-3': '✨ DALL-E 3: OpenAI 經典圖像生成模型'
};

// 聊天功能
async function sendMessage() {
    const message = chatInput.value.trim();
    const model = modelSelect.value;
    
    if (!message) return;
    
    addMessage(message, 'user');
    chatInput.value = '';
    sendBtn.disabled = true;
    
    const loadingDiv = addMessage('思考中...', 'ai', true);
    
    try {
        const response = await puter.ai.chat(message, { model });
        loadingDiv.remove();
        addMessage(response, 'ai');
    } catch (error) {
        loadingDiv.remove();
        addMessage(`錯誤: ${error.message}`, 'ai');
    } finally {
        sendBtn.disabled = false;
        chatInput.focus();
    }
}

function addMessage(text, sender, isLoading = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message ${isLoading ? 'loading' : ''}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return messageDiv;
}

// FLUX.2 圖像生成功能 (官方 API 格式)
async function generateImage() {
    const basePrompt = imagePrompt.value.trim();
    const selectedModel = imageModelSelect.value;
    
    if (!basePrompt) {
        imageResult.innerHTML = '<p class="error">⚠️ 請輸入圖像描述</p>';
        return;
    }
    
    // 獲取風格選擇 (如果存在)
    let fullPrompt = basePrompt;
    if (styleSelect) {
        const styleValue = styleSelect.value.trim();
        if (styleValue) {
            fullPrompt = `${basePrompt}, ${styleValue}`;
            console.log('✅ 已添加風格:', styleValue);
        }
    }
    
    generateImgBtn.disabled = true;
    const modelName = selectedModel.split('/').pop() || selectedModel;
    imageResult.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading">⚡ 正在使用 ${modelName} 生成圖像...</p>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">
                FLUX.2 官方 API • 約 15-30 秒
            </p>
        </div>
    `;
    
    try {
        // ✅ Puter.js 官方 FLUX.2 API 格式
        const options = {
            model: selectedModel,
            disable_safety_checker: true  // 關鍵:支持創意內容
        };
        
        console.log('生成參數:', { prompt: fullPrompt, ...options });
        
        const imageElement = await puter.ai.txt2img(fullPrompt, options);
        
        if (!imageElement || !imageElement.src) {
            throw new Error('圖像生成失敗:無效的回應');
        }
        
        const imageData = imageElement.src;
        
        // 保存到記錄 (保存完整提示詞包括風格)
        imageHistory.addImage(imageData, fullPrompt, selectedModel);
        
        // 顯示成功結果
        imageResult.innerHTML = `
            <div class="success-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                    <p class="success">✅ 圖像生成成功! (已保存到記錄)</p>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">
                        模型: ${selectedModel} • FLUX.2 官方 API
                    </p>
                </div>
            </div>
        `;
        
        imageResult.appendChild(imageElement);
        imageElement.style.cssText = 'max-width: 100%; border-radius: 12px; margin-top: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); cursor: pointer;';
        imageElement.addEventListener('click', () => openImageModal(imageData, fullPrompt, modelName));
        
        // 下載按鈕
        const downloadDiv = document.createElement('div');
        downloadDiv.style.marginTop = '1rem';
        downloadDiv.innerHTML = `
            <a href="${imageData}" download="flux2-${modelName}-${Date.now()}.png" class="download-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                下載圖像
            </a>
        `;
        imageResult.appendChild(downloadDiv);
        
    } catch (error) {
        console.error('圖像生成錯誤:', error);
        imageResult.innerHTML = `
            <div class="error-container">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p class="error">❌ 生成失敗: ${error.message || '未知錯誤'}</p>
                <div class="error-suggestions">
                    <p><strong>💡 建議:</strong></p>
                    <ul>
                        <li>嘗試使用 <strong>FLUX.2-flex</strong> (更快速)</li>
                        <li>簡化提示詞內容</li>
                        <li>切換到 <strong>gpt-image-1</strong> 或 <strong>dall-e-3</strong></li>
                        <li>檢查網路連接</li>
                    </ul>
                </div>
            </div>
        `;
    } finally {
        generateImgBtn.disabled = false;
    }
}

// OCR 功能
async function extractText() {
    const url = imageUrl.value.trim();
    
    if (!url) {
        ocrResult.innerHTML = '<p class="error">⚠️ 請輸入圖像 URL</p>';
        return;
    }
    
    ocrBtn.disabled = true;
    ocrResult.innerHTML = '<p class="loading">📝 正在提取文字...</p>';
    
    try {
        const text = await puter.ai.img2txt(url);
        ocrResult.innerHTML = `
            <p class="success">✅ 文字提取成功!</p>
            <div style="margin-top: 1rem; padding: 1.5rem; background: white; border-radius: 12px; border: 1px solid var(--border);">
                <strong>提取的文字:</strong><br><br>
                ${text.replace(/\n/g, '<br>')}
            </div>
        `;
    } catch (error) {
        ocrResult.innerHTML = `<p class="error">❌ 提取失敗: ${error.message}</p>`;
    } finally {
        ocrBtn.disabled = false;
    }
}

// 更新模型資訊
function updateModelInfo() {
    const selectedModel = imageModelSelect.value;
    const description = modelDescriptions[selectedModel] || '選擇一個模型開始生成';
    
    modelInfo.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>${description}</span>
    `;
}

// 事件監聽器
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

imageModelSelect.addEventListener('change', updateModelInfo);
generateImgBtn.addEventListener('click', generateImage);
imagePrompt.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
    }
});

// 風格選擇監聽器
if (styleSelect) {
    styleSelect.addEventListener('change', updateStylePreview);
}

ocrBtn.addEventListener('click', extractText);

// 初始化
addMessage('👋 您好!我是 AI 助手,有什麼可以幫您的嗎?', 'ai');
updateModelInfo();
if (styleSelect) updateStylePreview();
renderHistory();
