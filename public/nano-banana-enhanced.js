// Nano Banana AI - Enhanced Version

// DOM 元素
const navBtns = document.querySelectorAll('.nb-nav-btn');
const sections = document.querySelectorAll('.nb-section');

// 圖像生成
const modelSelect = document.getElementById('nb-model-select');
const styleSelect = document.getElementById('nb-style-select');
const stylePreview = document.getElementById('nb-style-preview');
const promptInput = document.getElementById('nb-prompt-input');
const generateBtn = document.getElementById('nb-generate-btn');
const enhanceBtn = document.getElementById('nb-enhance-btn');
const batchBtn = document.getElementById('nb-batch-btn');
const resultContainer = document.getElementById('nb-result-container');

// 高級參數
const resolutionSelect = document.getElementById('nb-resolution');
const aspectRatioSelect = document.getElementById('nb-aspect-ratio');
const creativitySlider = document.getElementById('nb-creativity');
const creativityValue = document.getElementById('nb-creativity-value');

// 畫廊
const galleryGrid = document.getElementById('nb-gallery-grid');
const totalCount = document.getElementById('nb-total-count');
const clearBtn = document.getElementById('nb-clear-btn');
const searchInput = document.getElementById('nb-search-input');
const filterBtns = document.querySelectorAll('.nb-filter-btn');

// 聊天
const chatMessages = document.getElementById('nb-chat-messages');
const chatInput = document.getElementById('nb-chat-input');
const sendBtn = document.getElementById('nb-send-btn');
const chatModelSelect = document.getElementById('nb-chat-model-select');

// 常量
const STORAGE_KEY = 'nano_banana_gallery';
const HISTORY_KEY = 'nano_banana_prompt_history';
const MAX_IMAGES = 50;
const MAX_HISTORY = 100;

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
    '': '🍌 無 - 自由風格，不添加額外提示詞',
    'photorealistic': '📸 寫實攝影 - 超高清寫實效果',
    'anime': '🌸 吉卜力動漫 - 日本動漫風格',
    'digital-art': '🖼️ 數位藝術 - 現代數位繪畫',
    'oil-painting': '🎨 油畫風格 - 經典油畫質感',
    'watercolor': '🌊 水彩畫 - 柔和水彩效果',
    'sketch': '✏️ 素描風格 - 手繪素描',
    '3d-render': '🎬 3D 渲染 - 高品質 3D 效果',
    'cyberpunk': '🤖 賽博龐克 - 未來科技風',
    'fantasy': '✨ 奇幻風格 - 魔幻奇幻世界',
    'minimalist': '📍 極簡主義 - 簡潔設計',
    'vintage': '📼 復古風格 - 老照片質感',
    'comic': '📖 漫畫風格 - 漫畫風格',
    'surreal': '🌀 超現實 - 超現實藝術'
};

// 模型名稱映射
const modelNames = {
    'google/gemini-3-pro-image': 'Gemini 3 Pro Image',
    'gemini-2.5-flash-image-preview': 'Gemini 2.5 Flash Image'
};

// 圖片管理類
class BananaGallery {
    constructor() {
        this.images = this.load();
        this.promptHistory = this.loadHistory();
    }

    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('載入失敗:', error);
            return [];
        }
    }

    loadHistory() {
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            return [];
        }
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.images));
        } catch (error) {
            console.error('保存失敗:', error);
            if (this.images.length > 10) {
                this.images = this.images.slice(-10);
                this.save();
            }
        }
    }

    saveHistory() {
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(this.promptHistory));
        } catch (error) {
            console.error('歷史保存失敗:', error);
        }
    }

    addPromptHistory(prompt) {
        if (!this.promptHistory.includes(prompt)) {
            this.promptHistory.unshift(prompt);
            if (this.promptHistory.length > MAX_HISTORY) {
                this.promptHistory = this.promptHistory.slice(0, MAX_HISTORY);
            }
            this.saveHistory();
        }
    }

    add(imageData, prompt, model, style, params = {}) {
        const image = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            imageData,
            prompt,
            model,
            style,
            params,
            modelName: modelNames[model] || model,
            tags: this.generateTags(prompt, style)
        };

        this.images.unshift(image);
        
        if (this.images.length > MAX_IMAGES) {
            this.images = this.images.slice(0, MAX_IMAGES);
        }

        this.save();
        this.addPromptHistory(prompt);
        return image;
    }

    generateTags(prompt, style) {
        const tags = [];
        if (style) tags.push(style);
        
        // 自動提取關鍵詞
        const keywords = ['portrait', 'landscape', 'abstract', 'character', 'animal', 'nature', 'city', 'fantasy'];
        keywords.forEach(keyword => {
            if (prompt.toLowerCase().includes(keyword)) {
                tags.push(keyword);
            }
        });
        
        return tags;
    }

    delete(id) {
        this.images = this.images.filter(img => img.id !== id);
        this.save();
    }

    clear() {
        this.images = [];
        this.save();
    }

    search(query) {
        if (!query) return this.images;
        const lowerQuery = query.toLowerCase();
        return this.images.filter(img => 
            img.prompt.toLowerCase().includes(lowerQuery) ||
            img.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    filterByTag(tag) {
        if (!tag || tag === 'all') return this.images;
        return this.images.filter(img => img.tags.includes(tag));
    }
}

const gallery = new BananaGallery();

// 工具函數
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : type === 'info' ? '#3b82f6' : '#ef4444'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideInRight 0.3s ease;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateStylePreview() {
    const selectedStyle = styleSelect.value;
    const description = styleDescriptions[selectedStyle] || '選擇風格後會自動優化提示詞';
    
    stylePreview.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>${description}</span>
    `;
}

// 1. 智能提示詞優化器
async function enhancePrompt() {
    const userPrompt = promptInput.value.trim();
    
    if (!userPrompt) {
        showNotification('⚠️ 請先輸入提示詞', 'error');
        return;
    }
    
    enhanceBtn.disabled = true;
    enhanceBtn.innerHTML = '<svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke-width="4" stroke-dasharray="32" /></svg> 優化中...';
    
    try {
        showNotification('🧠 AI 正在優化你的提示詞...', 'info');
        
        const enhanced = await puter.ai.chat(
            `You are an expert AI image generation prompt engineer. Enhance the following prompt to create stunning, detailed images.

Original prompt: "${userPrompt}"

Enhance it by:
1. Adding vivid visual details (colors, textures, lighting)
2. Specifying composition and perspective
3. Including quality markers (4K, highly detailed, masterpiece)
4. Keeping it concise (under 100 words)

Return ONLY the enhanced English prompt, no explanations.`,
            { model: 'gpt-4o' }
        );
        
        promptInput.value = enhanced.trim();
        showNotification('✅ 提示詞已優化!', 'success');
        
    } catch (error) {
        console.error('優化失敗:', error);
        showNotification('❌ 優化失敗: ' + error.message, 'error');
    } finally {
        enhanceBtn.disabled = false;
        enhanceBtn.innerHTML = '✨ AI 優化';
    }
}

// 2. 批量變體生成
async function generateBatch() {
    const basePrompt = promptInput.value.trim();
    const selectedModel = modelSelect.value;
    const styleKey = styleSelect.value.trim();
    
    if (!basePrompt) {
        showNotification('⚠️ 請輸入圖像描述', 'error');
        return;
    }
    
    const batchSize = 4;
    batchBtn.disabled = true;
    generateBtn.disabled = true;
    
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
        <div class="nb-batch-container">
            <h3 style="text-align: center; margin-bottom: 1rem;">🍌 生成 ${batchSize} 個變體</h3>
            <div class="nb-batch-grid" id="batch-grid"></div>
        </div>
    `;
    
    const batchGrid = document.getElementById('batch-grid');
    
    // 組合完整提示詞
    let fullPrompt = basePrompt;
    const stylePromptText = stylePrompts[styleKey] || '';
    if (stylePromptText) {
        fullPrompt = `${basePrompt}, ${stylePromptText}`;
    }
    
    const modelName = modelNames[selectedModel] || selectedModel;
    
    try {
        for (let i = 0; i < batchSize; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'nb-batch-item';
            itemDiv.innerHTML = `
                <div class="nb-loading">
                    <div class="nb-loading-spinner"></div>
                    <p>變體 ${i + 1}/${batchSize}</p>
                </div>
            `;
            batchGrid.appendChild(itemDiv);
            
            // 添加随机性
            const variantPrompt = `${fullPrompt}, variation ${i + 1}`;
            
            const imageElement = await puter.ai.txt2img(variantPrompt, {
                model: selectedModel,
                disable_safety_checker: true
            });
            
            if (imageElement && imageElement.src) {
                const imageData = imageElement.src;
                
                itemDiv.innerHTML = '';
                imageElement.style.cssText = 'width: 100%; border-radius: 8px; cursor: pointer;';
                imageElement.addEventListener('click', () => {
                    window.open(imageData, '_blank');
                });
                itemDiv.appendChild(imageElement);
                
                // 添加操作按鈕
                const actions = document.createElement('div');
                actions.style.cssText = 'margin-top: 0.5rem; display: flex; gap: 0.5rem;';
                actions.innerHTML = `
                    <button class="nb-btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;" onclick="saveVariant('${imageData}', '${fullPrompt}', '${selectedModel}', '${styleKey}')">
                        ♥️ 保存
                    </button>
                    <a href="${imageData}" download="banana-variant-${i + 1}.png" class="nb-btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem; text-align: center;">
                        ⬇️ 下載
                    </a>
                `;
                itemDiv.appendChild(actions);
            }
        }
        
        showNotification(`✅ 成功生成 ${batchSize} 個變體!`);
        
    } catch (error) {
        console.error('批量生成錯誤:', error);
        showNotification('❌ 部分變體生成失敗', 'error');
    } finally {
        batchBtn.disabled = false;
        generateBtn.disabled = false;
    }
}

// 保存變體到畫廊
window.saveVariant = function(imageData, prompt, model, style) {
    const params = {
        resolution: resolutionSelect?.value || '2K',
        aspectRatio: aspectRatioSelect?.value || '1:1',
        creativity: creativitySlider?.value || 70
    };
    gallery.add(imageData, prompt, model, style, params);
    showNotification('✅ 已保存到畫廊!');
};

// 3. 高級參數控制
if (creativitySlider) {
    creativitySlider.addEventListener('input', (e) => {
        if (creativityValue) {
            creativityValue.textContent = e.target.value + '%';
        }
    });
}

// 4. 實時進度追蹤
function showProgressBar(container, modelName) {
    let progress = 0;
    const startTime = Date.now();
    const estimatedTime = 25000; // 25秒預估
    
    const progressDiv = document.createElement('div');
    progressDiv.className = 'nb-progress-container';
    progressDiv.innerHTML = `
        <div class="nb-loading-spinner"></div>
        <p style="margin: 1rem 0 0.5rem;">🍌 香蕉動力生成中... (使用 ${modelName})</p>
        <div class="nb-progress-bar">
            <div class="nb-progress-fill" id="progress-fill" style="width: 0%"></div>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem; font-size: 0.9rem; color: var(--nb-text-secondary);">
            <span id="progress-percent">0%</span>
            <span id="progress-time">預計 25 秒</span>
        </div>
        <small style="color: var(--nb-text-secondary); display: block; margin-top: 0.5rem;">Nano Banana AI 官方 API</small>
    `;
    
    container.innerHTML = '';
    container.appendChild(progressDiv);
    
    const progressFill = document.getElementById('progress-fill');
    const progressPercent = document.getElementById('progress-percent');
    const progressTime = document.getElementById('progress-time');
    
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(95, (elapsed / estimatedTime) * 100);
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressPercent) progressPercent.textContent = Math.floor(progress) + '%';
        
        const remaining = Math.max(0, Math.ceil((estimatedTime - elapsed) / 1000));
        if (progressTime) progressTime.textContent = `預計 ${remaining} 秒`;
        
        if (progress >= 95) {
            clearInterval(interval);
        }
    }, 100);
    
    return interval;
}

// 圖像生成 (增強版)
async function generateImage() {
    const basePrompt = promptInput.value.trim();
    const selectedModel = modelSelect.value;
    const styleKey = styleSelect.value.trim();
    
    if (!basePrompt) {
        showNotification('⚠️ 請輸入圖像描述', 'error');
        return;
    }
    
    // 組合完整提示詞
    let fullPrompt = basePrompt;
    const stylePromptText = stylePrompts[styleKey] || '';
    if (stylePromptText) {
        fullPrompt = `${basePrompt}, ${stylePromptText}`;
    }
    
    // 添加高級參數
    const resolution = resolutionSelect?.value || '2K';
    const aspectRatio = aspectRatioSelect?.value || '1:1';
    const creativity = creativitySlider?.value || 70;
    
    if (resolution === '4K') {
        fullPrompt += ', 4K ultra high resolution';
    } else if (resolution === '2K') {
        fullPrompt += ', 2K high quality';
    }
    
    generateBtn.disabled = true;
    batchBtn.disabled = true;
    
    const modelName = modelNames[selectedModel] || selectedModel;
    
    resultContainer.style.display = 'block';
    const progressInterval = showProgressBar(resultContainer, modelName);
    
    try {
        const imageElement = await puter.ai.txt2img(fullPrompt, {
            model: selectedModel,
            disable_safety_checker: true
        });
        
        clearInterval(progressInterval);
        
        if (!imageElement || !imageElement.src) {
            throw new Error('圖像生成失敗');
        }
        
        const imageData = imageElement.src;
        
        // 保存到畫廊
        const params = { resolution, aspectRatio, creativity };
        gallery.add(imageData, fullPrompt, selectedModel, styleKey, params);
        
        // 顯示結果
        resultContainer.innerHTML = `
            <div style="text-align: center;">
                <p style="color: var(--nb-success); font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">
                    ✅ 香蕉圖像生成成功!
                </p>
                <p style="color: var(--nb-text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    模型: ${modelName} | 風格: ${styleDescriptions[styleKey] || '無'} | 解析度: ${resolution}
                </p>
            </div>
        `;
        
        imageElement.style.cssText = 'max-width: 100%; border-radius: 12px; box-shadow: var(--nb-shadow-lg); cursor: pointer;';
        imageElement.addEventListener('click', () => window.open(imageData, '_blank'));
        resultContainer.appendChild(imageElement);
        
        // 操作按鈕
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;';
        actionsDiv.innerHTML = `
            <a href="${imageData}" download="banana-${modelName.replace(/\s+/g, '-')}-${Date.now()}.png" class="nb-btn-primary" style="flex: 1;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                🍌 下載圖像
            </a>
            <button onclick="generateImage()" class="nb-btn-secondary" style="flex: 1;">
                🔄 重新生成
            </button>
        `;
        resultContainer.appendChild(actionsDiv);
        
        showNotification('✅ 圖像生成成功!');
        
    } catch (error) {
        clearInterval(progressInterval);
        console.error('生成錯誤:', error);
        resultContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: var(--nb-error); font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">
                    ❌ 生成失敗: ${error.message}
                </p>
                <p style="color: var(--nb-text-secondary); font-size: 0.9rem;">
                    嘗試切換模型或簡化提示詞
                </p>
            </div>
        `;
        showNotification('❌ 生成失敗', 'error');
    } finally {
        generateBtn.disabled = false;
        batchBtn.disabled = false;
    }
}

// 渲染畫廊 (增強版)
function renderGallery(filterTag = null, searchQuery = null) {
    let images = gallery.images;
    
    if (searchQuery) {
        images = gallery.search(searchQuery);
    } else if (filterTag) {
        images = gallery.filterByTag(filterTag);
    }
    
    totalCount.textContent = images.length;
    
    if (images.length === 0) {
        galleryGrid.innerHTML = `
            <div class="nb-empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <path d="M21 15l-5-5L5 21"/>
                </svg>
                <p>還沒有香蕉圖片</p>
                <small>開始創作你的第一張圖像吧! 🍌</small>
            </div>
        `;
        return;
    }
    
    galleryGrid.innerHTML = '';
    
    images.forEach(img => {
        const item = document.createElement('div');
        item.className = 'nb-gallery-item';
        item.innerHTML = `
            <img src="${img.imageData}" alt="${img.prompt.substring(0, 50)}..." />
            <div style="padding: 1rem; background: white;">
                <p style="font-size: 0.85rem; color: var(--nb-text-secondary); margin-bottom: 0.5rem;">
                    ${img.prompt.substring(0, 60)}${img.prompt.length > 60 ? '...' : ''}
                </p>
                <div style="display: flex; gap: 0.25rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
                    ${img.tags.map(tag => `<span style="font-size: 0.7rem; padding: 0.2rem 0.5rem; background: var(--nb-bg-light); border-radius: 4px; color: var(--nb-primary-dark);">#${tag}</span>`).join('')}
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--nb-primary-dark); font-weight: 600;">
                        ${img.modelName}
                    </span>
                    <button class="nb-btn-secondary" style="padding: 0.5rem; font-size: 0.75rem;" onclick="deleteImage(${img.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        
        item.querySelector('img').addEventListener('click', () => {
            window.open(img.imageData, '_blank');
        });
        
        galleryGrid.appendChild(item);
    });
}

function deleteImage(id) {
    if (confirm('確定要刪除這張香蕉圖片嗎?')) {
        gallery.delete(id);
        renderGallery();
        showNotification('✅ 已刪除');
    }
}

// AI 聊天
async function sendMessage() {
    const message = chatInput.value.trim();
    const model = chatModelSelect.value;
    
    if (!message) return;
    
    const userMsg = document.createElement('div');
    userMsg.className = 'nb-message nb-user-message';
    userMsg.innerHTML = `
        <div class="nb-message-avatar">👤</div>
        <div class="nb-message-content"><p>${message}</p></div>
    `;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'nb-message nb-ai-message';
    loadingMsg.innerHTML = `
        <div class="nb-message-avatar">🍌</div>
        <div class="nb-message-content"><p>思考中...</p></div>
    `;
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        const response = await puter.ai.chat(message, { model });
        loadingMsg.remove();
        
        const aiMsg = document.createElement('div');
        aiMsg.className = 'nb-message nb-ai-message';
        aiMsg.innerHTML = `
            <div class="nb-message-avatar">🍌</div>
            <div class="nb-message-content"><p>${response}</p></div>
        `;
        chatMessages.appendChild(aiMsg);
    } catch (error) {
        loadingMsg.remove();
        const errorMsg = document.createElement('div');
        errorMsg.className = 'nb-message nb-ai-message';
        errorMsg.innerHTML = `
            <div class="nb-message-avatar">🍌</div>
            <div class="nb-message-content"><p style="color: var(--nb-error);">錯誤: ${error.message}</p></div>
        `;
        chatMessages.appendChild(errorMsg);
    }
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 切換 Section
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetSection = btn.dataset.section;
        if (!targetSection) return;
        
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `nb-${targetSection}`) {
                section.classList.add('active');
            }
        });

        if (targetSection === 'gallery') {
            renderGallery();
        }
    });
});

// 事件監聽
styleSelect.addEventListener('change', updateStylePreview);
generateBtn.addEventListener('click', generateImage);
if (enhanceBtn) enhanceBtn.addEventListener('click', enhancePrompt);
if (batchBtn) batchBtn.addEventListener('click', generateBatch);

promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
    }
});

if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm('確定要清空所有香蕉圖片嗎?此操作無法撤銷!')) {
            gallery.clear();
            renderGallery();
            showNotification('✅ 已清空畫廊');
        }
    });
}

// 搜索功能
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        renderGallery(null, e.target.value);
    });
}

// 篩選功能
if (filterBtns) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tag = btn.dataset.tag;
            renderGallery(tag);
        });
    });
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 初始化
updateStylePreview();
renderGallery();

// 暴露全局函數
window.deleteImage = deleteImage;
window.generateImage = generateImage;
