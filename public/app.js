// DOM 元素
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');

const imageModelSelect = document.getElementById('image-model-select');
const modelInfo = document.getElementById('model-info');
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

    historyGrid.innerHTML = history.map(item => `
        <div class="history-item" data-id="${item.id}">
            <img src="${item.imageData}" alt="${item.prompt}" loading="lazy">
            <div class="history-overlay">
                <div class="history-info">
                    <span class="history-model">${item.modelName}</span>
                    <span class="history-date">${new Date(item.timestamp).toLocaleString('zh-TW')}</span>
                </div>
                <p class="history-prompt">${item.prompt.substring(0, 80)}${item.prompt.length > 80 ? '...' : ''}</p>
                <div class="history-actions">
                    <a href="${item.imageData}" download="flux-${item.modelName}-${item.id}.png" class="btn-icon" title="下載">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </a>
                    <button class="btn-icon btn-delete" data-id="${item.id}" title="刪除">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // 綁定刪除事件
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            if (confirm('確定要刪除這張圖片嗎?')) {
                imageHistory.deleteImage(id);
                renderHistory();
            }
        });
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
    const prompt = imagePrompt.value.trim();
    const selectedModel = imageModelSelect.value;
    
    if (!prompt) {
        imageResult.innerHTML = '<p class="error">⚠️ 請輸入圖像描述</p>';
        return;
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
        
        console.log('生成參數:', { prompt, ...options });
        
        const imageElement = await puter.ai.txt2img(prompt, options);
        
        if (!imageElement || !imageElement.src) {
            throw new Error('圖像生成失敗:無效的回應');
        }
        
        const imageData = imageElement.src;
        
        // 保存到記錄
        imageHistory.addImage(imageData, prompt, selectedModel);
        
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
        imageElement.style.cssText = 'max-width: 100%; border-radius: 12px; margin-top: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);';
        
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

ocrBtn.addEventListener('click', extractText);

// 初始化
addMessage('👋 您好!我是 AI 助手,有什麼可以幫您的嗎?', 'ai');
updateModelInfo();
renderHistory();
