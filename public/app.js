// DOM 元素
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');

const imageModelSelect = document.getElementById('image-model-select');
const styleSelect = document.getElementById('style-select');
const aspectRatioSelect = document.getElementById('aspect-ratio-select');
const batchCountSelect = document.getElementById('batch-count-select');
const adultContentToggle = document.getElementById('adult-content-toggle');
const adultContentWarning = document.getElementById('adult-content-warning');
const modelInfo = document.getElementById('model-info');
const stylePreview = document.getElementById('style-preview');
const aspectRatioPreview = document.getElementById('aspect-ratio-preview');
const batchCountPreview = document.getElementById('batch-count-preview');
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
const MAX_HISTORY = 50;

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

        if (targetTab === 'history') {
            renderHistory();
        }
    });
});

// 成人內容開關監聽
if (adultContentToggle && adultContentWarning) {
    adultContentToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            adultContentWarning.style.display = 'flex';
        } else {
            adultContentWarning.style.display = 'none';
        }
    });
}

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

// 風格映射表
const stylePrompts = {
    '': '',
    'photorealistic': 'photorealistic, ultra realistic, 8k, highly detailed, professional photography',
    'anime': 'anime style, in the style of Studio Ghibli, detailed anime art, vibrant colors',
    'digital-art': 'digital art, concept art, trending on artstation, highly detailed',
    'oil-painting': 'oil painting, fine art, masterpiece, classical painting style',
    'watercolor': 'watercolor painting, soft colors, artistic, dreamy atmosphere',
    'sketch': 'pencil sketch, hand-drawn, artistic sketch, detailed line art',
    '3d-render': '3D render, octane render, unreal engine, photorealistic 3D',
    'cyberpunk': 'cyberpunk style, neon lights, futuristic city, sci-fi, blade runner aesthetic',
    'fantasy': 'fantasy art, magical, ethereal, epic fantasy illustration',
    'minimalist': 'minimalist design, simple, clean, modern aesthetic',
    'vintage': 'vintage style, retro, old photograph, nostalgic',
    'comic': 'comic book style, pop art, vibrant colors, graphic novel',
    'surreal': 'surrealist art, dreamlike, abstract, Salvador Dali inspired'
};

// 風格說明
const styleDescriptions = {
    '': '無 - 自由風格,不添加額外風格提示詞',
    'photorealistic': '📸 寫實風格 - 超高清寫實效果,適合人物、風景、產品攝影',
    'anime': '🌸 日本動漫風格 - 吉卜力工作室風格,細膩動漫藝術',
    'digital-art': '🖼️ 數位藝術 - 現代數位繪畫風格,鮮豔色彩',
    'oil-painting': '🎨 油畫風格 - 經典油畫質感,藝術大師風格',
    'watercolor': '🌊 水彩畫 - 柔和水彩效果,夢境感',
    'sketch': '✏️ 素描風格 - 手繪素描效果,藝術草圖',
    '3d-render': '🎬 3D 渲染 - 高品質 3D 建模效果',
    'cyberpunk': '🤖 賽博龐克 - 未來科技、霓燈風格',
    'fantasy': '✨ 奇幻風格 - 魔幻奇幻世界,史詩感',
    'minimalist': '📍 極簡主義 - 簡潔設計,留白美學',
    'vintage': '📼 復古風格 - 老照片質感,復古色調',
    'comic': '📖 漫畫風格 - 美式漫畫/漫畫風格',
    'surreal': '🌀 超現實主義 - 超現實藝術,夢境感'
};

// 更新風格預覽
function updateStylePreview() {
    if (!styleSelect || !stylePreview) return;
    
    const selectedStyle = styleSelect.value;
    const description = styleDescriptions[selectedStyle] || '選擇風格後,會自動加入到提示詞中';
    
    stylePreview.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>${description}</span>
    `;
}

// 更新尺寸預覽和限制
function updateAspectRatioPreview() {
    if (!aspectRatioSelect || !aspectRatioPreview || !imageModelSelect) return;
    
    const selectedModel = imageModelSelect.value;
    const selectedSize = aspectRatioSelect.value;
    const isPro = selectedModel === 'black-forest-labs/FLUX.2-pro';
    
    // FLUX.2 Pro 限制
    if (isPro) {
        // 禁用所有非 1024x1024 的選項
        Array.from(aspectRatioSelect.options).forEach(option => {
            if (option.value !== '1024x1024') {
                option.disabled = true;
            }
        });
        // 強制選擇 1024x1024
        aspectRatioSelect.value = '1024x1024';
        
        aspectRatioPreview.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
            <span style="font-size: 0.85rem; color: #f59e0b;">⚠️ FLUX.2 Pro 僅支援 1024x1024(官方限制)</span>
        `;
    } else {
        // 其他模型:解除限制
        Array.from(aspectRatioSelect.options).forEach(option => {
            option.disabled = false;
        });
        
        aspectRatioPreview.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
            <span style="font-size: 0.85rem; color: #667eea;">✅ 選擇的尺寸: ${selectedSize} px</span>
        `;
    }
}

// 更新批量數量預覽
function updateBatchCountPreview() {
    if (!batchCountSelect || !batchCountPreview) return;
    
    const count = parseInt(batchCountSelect.value, 10);
    
    batchCountPreview.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span style="font-size: 0.85rem; color: #10b981;">✅ 將生成 ${count} 張圖片${count > 1 ? ' (並行生成)' : ''}</span>
    `;
}

// 放大圖片功能
function openImageModal(imageData, prompt, modelName) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    
    const safePrompt = prompt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
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
    
    modal.querySelector('.btn-copy-prompt').addEventListener('click', () => {
        copyPrompt(prompt);
    });
    
    modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.remove());
    
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

clearHistoryBtn.addEventListener('click', () => {
    if (confirm('確定要清空所有圖片記錄嗎?此操作無法撤銷!')) {
        imageHistory.clearAll();
        renderHistory();
    }
});

// 模型資訊
const modelDescriptions = {
    'black-forest-labs/FLUX.2-pro': '🏆 FLUX.2 Pro: 最新一代專業級模型,完美文字渲染(僅支援1024x1024)',
    'black-forest-labs/FLUX.2-flex': '🔄 FLUX.2 Flex: 彈性模型,適應多種生成需求,支持自定義參數',
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

// ✅ FLUX.2 圖像生成 - 支持批量生成和成人內容
async function generateImage() {
    const basePrompt = imagePrompt.value.trim();
    const selectedModel = imageModelSelect.value;
    const batchCount = parseInt(batchCountSelect.value, 10);
    const allowAdultContent = adultContentToggle.checked;
    
    if (!basePrompt) {
        imageResult.innerHTML = '<p class="error">⚠️ 請輸入圖像描述</p>';
        return;
    }
    
    // 獲取風格並組合提示詞
    let fullPrompt = basePrompt;
    if (styleSelect) {
        const styleKey = styleSelect.value.trim();
        const stylePromptText = stylePrompts[styleKey] || '';
        
        if (stylePromptText) {
            fullPrompt = `${basePrompt}, ${stylePromptText}`;
            console.log('✅ 已添加風格:', styleKey);
        }
    }
    
    const isPro = selectedModel === 'black-forest-labs/FLUX.2-pro';
    
    generateImgBtn.disabled = true;
    const modelName = selectedModel.split('/').pop() || selectedModel;
    
    // 生成提示信息
    if (isPro) {
        imageResult.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading">⚡ 正在使用 FLUX.2 Pro 生成 ${batchCount} 張圖像...</p>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">
                    專業級品質 • 1024x1024 • 已完成 0/${batchCount}
                </p>
            </div>
        `;
    } else {
        let width = 1024;
        let height = 1024;
        if (aspectRatioSelect) {
            const sizeValue = aspectRatioSelect.value;
            const [w, h] = sizeValue.split('x').map(Number);
            if (w && h) {
                width = w;
                height = h;
            }
        }
        
        imageResult.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading">⚡ 正在使用 ${modelName} 生成 ${batchCount} 張圖像...</p>
                <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">
                    FLUX.2 官方 API • 尺寸: ${width}x${height} • 已完成 0/${batchCount}
                </p>
            </div>
        `;
    }
    
    try {
        const generatedImages = [];
        let completedCount = 0;
        
        // 並行生成多張圖片
        const promises = Array.from({ length: batchCount }, async (_, index) => {
            let imageElement;
            
            if (isPro) {
                imageElement = await puter.ai.txt2img(fullPrompt, {
                    model: selectedModel,
                    disable_safety_checker: allowAdultContent // 🔑 使用開關狀態
                });
            } else {
                let width = 1024;
                let height = 1024;
                if (aspectRatioSelect) {
                    const sizeValue = aspectRatioSelect.value;
                    const [w, h] = sizeValue.split('x').map(Number);
                    if (w && h) {
                        width = w;
                        height = h;
                    }
                }
                
                imageElement = await puter.ai.txt2img(fullPrompt, {
                    model: selectedModel,
                    width: width,
                    height: height,
                    steps: 30,
                    seed: 42 + index,
                    disable_safety_checker: allowAdultContent // 🔑 使用開關狀態
                });
            }
            
            if (!imageElement || !imageElement.src) {
                throw new Error('圖像生成失敗:無效的回應');
            }
            
            completedCount++;
            
            // 更新進度
            const loadingText = imageResult.querySelector('.loading');
            if (loadingText) {
                loadingText.textContent = `⚡ 正在生成... (已完成 ${completedCount}/${batchCount})`;
            }
            
            return imageElement;
        });
        
        const results = await Promise.all(promises);
        
        // 保存到歷史
        results.forEach(imageElement => {
            imageHistory.addImage(imageElement.src, fullPrompt, selectedModel);
            generatedImages.push(imageElement);
        });
        
        // 顯示成功結果
        const sizeInfo = isPro ? '1024x1024 (官方預設)' : aspectRatioSelect.value;
        imageResult.innerHTML = `
            <div class="success-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                    <p class="success">✅ ${batchCount} 張圖像生成成功! (已保存到記錄)</p>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">
                        模型: ${selectedModel} • 尺寸: ${sizeInfo}
                    </p>
                </div>
            </div>
        `;
        
        // 網格佈局展示多張圖片
        const gridContainer = document.createElement('div');
        gridContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 1rem;
        `;
        
        generatedImages.forEach((imageElement, index) => {
            const imageWrapper = document.createElement('div');
            imageWrapper.style.cssText = 'position: relative;';
            
            imageElement.style.cssText = 'max-width: 100%; border-radius: 12px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); cursor: pointer;';
            imageElement.addEventListener('click', () => openImageModal(imageElement.src, fullPrompt, modelName));
            
            imageWrapper.appendChild(imageElement);
            
            // 每張圖片的下載按鈕
            const downloadBtn = document.createElement('a');
            downloadBtn.href = imageElement.src;
            downloadBtn.download = `flux2-${modelName}-${index + 1}-${Date.now()}.png`;
            downloadBtn.className = 'download-btn';
            downloadBtn.style.marginTop = '0.5rem';
            downloadBtn.style.display = 'block';
            downloadBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                下載圖片 ${index + 1}
            `;
            imageWrapper.appendChild(downloadBtn);
            
            gridContainer.appendChild(imageWrapper);
        });
        
        imageResult.appendChild(gridContainer);
        
    } catch (error) {
        console.error('❌ 圖像生成錯誤:', error);
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
                        <li>減少生成數量</li>
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
    
    // 更新尺寸限制
    updateAspectRatioPreview();
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

if (styleSelect) {
    styleSelect.addEventListener('change', updateStylePreview);
}

if (aspectRatioSelect) {
    aspectRatioSelect.addEventListener('change', updateAspectRatioPreview);
}

if (batchCountSelect) {
    batchCountSelect.addEventListener('change', updateBatchCountPreview);
}

ocrBtn.addEventListener('click', extractText);

// 初始化
addMessage('👋 您好!我是 AI 助手,有什麼可以幫您的嗎?', 'ai');
updateModelInfo();
if (styleSelect) updateStylePreview();
if (aspectRatioSelect) updateAspectRatioPreview();
if (batchCountSelect) updateBatchCountPreview();
renderHistory();
