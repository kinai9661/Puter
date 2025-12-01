// Nano Banana AI - Official Configuration (Plan A)

// DOM Elements
const navBtns = document.querySelectorAll('.nb-nav-btn');
const sections = document.querySelectorAll('.nb-section');
const modelSelect = document.getElementById('nb-model-select');
const styleSelect = document.getElementById('nb-style-select');
const stylePreview = document.getElementById('nb-style-preview');
const promptInput = document.getElementById('nb-prompt-input');
const generateBtn = document.getElementById('nb-generate-btn');
const batchBtn = document.getElementById('nb-batch-btn');
const resultContainer = document.getElementById('nb-result-container');
const resolutionSelect = document.getElementById('nb-resolution');
const aspectRatioSelect = document.getElementById('nb-aspect-ratio');
const creativitySlider = document.getElementById('nb-creativity');
const creativityValue = document.getElementById('nb-creativity-value');
const galleryGrid = document.getElementById('nb-gallery-grid');
const totalCount = document.getElementById('nb-total-count');
const clearBtn = document.getElementById('nb-clear-btn');
const chatMessages = document.getElementById('nb-chat-messages');
const chatInput = document.getElementById('nb-chat-input');
const sendBtn = document.getElementById('nb-send-btn');
const chatModelSelect = document.getElementById('nb-chat-model-select');

// Constants
const STORAGE_KEY = 'nano_banana_gallery';
const MAX_IMAGES = 50;

// Style prompts
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

const styleDescriptions = {
    '': '🍌 無 - 自由風格',
    'photorealistic': '📸 寫實攝影',
    'anime': '🌸 吉卜力動漫',
    'digital-art': '🖼️ 數位藝術',
    'oil-painting': '🎨 油畫風格',
    'watercolor': '🌊 水彩畫',
    'sketch': '✏️ 素描風格',
    '3d-render': '🎬 3D 渲染',
    'cyberpunk': '🤖 賽博龐克',
    'fantasy': '✨ 奇幻風格',
    'minimalist': '📍 極簡主義',
    'vintage': '📼 復古風格',
    'comic': '📖 漫畫風格',
    'surreal': '🌀 超現實'
};

// 官方標準模型配置 (Plan A)
const modelConfigs = {
    'gemini-3-pro': {
        model: 'google/gemini-3-pro-image',
        provider: 'together-ai',
        displayName: 'Gemini 3 Pro Image'
    },
    'gemini-2.5-flash': {
        model: 'gemini-2.5-flash-image-preview',
        provider: null, // 不需要 provider
        displayName: 'Gemini 2.5 Flash Image'
    }
};

// Gallery class
class BananaGallery {
    constructor() {
        this.images = this.load();
    }

    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Load error:', error);
            return [];
        }
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.images));
        } catch (error) {
            console.error('Save error:', error);
        }
    }

    add(imageData, prompt, modelKey, style, params = {}) {
        const config = modelConfigs[modelKey];
        const image = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            imageData,
            prompt,
            model: modelKey,
            style,
            params,
            modelName: config ? config.displayName : modelKey
        };

        this.images.unshift(image);
        if (this.images.length > MAX_IMAGES) {
            this.images = this.images.slice(0, MAX_IMAGES);
        }
        this.save();
        return image;
    }

    delete(id) {
        this.images = this.images.filter(img => img.id !== id);
        this.save();
    }

    clear() {
        this.images = [];
        this.save();
    }
}

const gallery = new BananaGallery();

// Notification
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
    const description = styleDescriptions[selectedStyle] || '選擇風格後會自動帶入相關描述';
    stylePreview.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4M12 8h.01"/>
        </svg>
        <span>${description}</span>
    `;
}

// 根據模型配置生成圖像
async function callTxt2Img(prompt, selectedModelKey) {
    const config = modelConfigs[selectedModelKey];
    if (!config) {
        throw new Error(`未知的模型: ${selectedModelKey}`);
    }

    const options = {
        model: config.model,
        disable_safety_checker: true
    };

    // Gemini 3 Pro Image 需要 provider 參數
    if (config.provider) {
        options.provider = config.provider;
    }

    console.log('🍌 API 調用參數:', options);
    return await puter.ai.txt2img(prompt, options);
}

// Batch Generate
async function generateBatch() {
    const basePrompt = promptInput.value.trim();
    if (!basePrompt) {
        showNotification('⚠️ 請輸入提示詞', 'error');
        return;
    }
    
    const selectedModelKey = modelSelect.value;
    const config = modelConfigs[selectedModelKey];
    const styleKey = styleSelect.value.trim();
    let fullPrompt = basePrompt;
    const stylePromptText = stylePrompts[styleKey] || '';
    if (stylePromptText) fullPrompt = `${basePrompt}, ${stylePromptText}`;
    
    batchBtn.disabled = true;
    generateBtn.disabled = true;
    
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
        <div style="text-align: center; padding: 1rem;">
            <h3>🍌 批量生成4张變體</h3>
            <div id="batch-grid" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-top: 1rem;"></div>
        </div>
    `;
    
    const batchGrid = document.getElementById('batch-grid');
    let successCount = 0;
    
    try {
        for (let i = 0; i < 4; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.style.cssText = 'border: 2px solid var(--nb-primary); border-radius: 12px; padding: 0.5rem;';
            itemDiv.innerHTML = '<div class="nb-loading"><div class="nb-loading-spinner"></div><p>變體 ' + (i + 1) + '/4</p></div>';
            batchGrid.appendChild(itemDiv);
            
            try {
                const variantPrompt = `${fullPrompt}, variation ${i + 1}`;
                const imageElement = await callTxt2Img(variantPrompt, selectedModelKey);
                
                if (imageElement && imageElement.src) {
                    const imageData = imageElement.src;
                    itemDiv.innerHTML = '';
                    imageElement.style.cssText = 'width: 100%; border-radius: 8px; cursor: pointer;';
                    imageElement.addEventListener('click', () => window.open(imageData, '_blank'));
                    itemDiv.appendChild(imageElement);
                    
                    const actions = document.createElement('div');
                    actions.style.cssText = 'margin-top: 0.5rem; display: flex; gap: 0.5rem;';
                    const escapedPrompt = fullPrompt.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                    actions.innerHTML = `
                        <button class="nb-btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;" onclick="saveVariant('${imageData}', '${escapedPrompt}', '${selectedModelKey}', '${styleKey}')">♥️ 保存</button>
                        <a href="${imageData}" download="banana-${i + 1}.png" class="nb-btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem; text-align: center; text-decoration: none;">⬇️ 下載</a>
                    `;
                    itemDiv.appendChild(actions);
                    successCount++;
                } else {
                    throw new Error('圖像生成失敗');
                }
            } catch (error) {
                console.error(`Variant ${i + 1} error:`, error);
                itemDiv.innerHTML = `<div style="padding: 1rem; text-align: center; color: var(--nb-error);">❌ 失敗</div>`;
            }
        }
        
        if (successCount > 0) {
            showNotification(`✅ 成功生成 ${successCount}/4 张變體!`);
        } else {
            showNotification('❌ 批量生成失敗', 'error');
        }
    } catch (error) {
        console.error('Batch generation error:', error);
        showNotification('❌ 批量生成出現錯誤', 'error');
    } finally {
        batchBtn.disabled = false;
        generateBtn.disabled = false;
    }
}

window.saveVariant = function(imageData, prompt, modelKey, style) {
    const params = {
        resolution: resolutionSelect?.value || '2K',
        aspectRatio: aspectRatioSelect?.value || '1:1',
        creativity: creativitySlider?.value || 70
    };
    gallery.add(imageData, prompt, modelKey, style, params);
    showNotification('✅ 已保存到畫廊!');
};

// Advanced Parameters
if (creativitySlider && creativityValue) {
    creativitySlider.addEventListener('input', (e) => {
        creativityValue.textContent = e.target.value + '%';
    });
}

// Progress Bar
function showProgressBar(container, modelDisplayName) {
    let progress = 0;
    const startTime = Date.now();
    const estimatedTime = 25000;
    
    const progressDiv = document.createElement('div');
    progressDiv.innerHTML = `
        <div class="nb-loading-spinner"></div>
        <p style="margin: 1rem 0 0.5rem;">🍌 香蕉動力生成中... (使用 ${modelDisplayName})</p>
        <div style="width: 100%; height: 8px; background: var(--nb-border); border-radius: 4px; overflow: hidden; margin: 1rem 0;">
            <div id="progress-fill" style="height: 100%; width: 0%; background: linear-gradient(90deg, var(--nb-primary), var(--nb-secondary)); transition: width 0.3s ease; border-radius: 4px;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--nb-text-secondary);">
            <span id="progress-percent">0%</span>
            <span id="progress-time">預計 25 秒</span>
        </div>
        <small style="color: var(--nb-text-secondary); display: block; margin-top: 0.5rem; text-align: center;">Nano Banana AI 官方 API</small>
    `;
    
    container.innerHTML = '';
    container.appendChild(progressDiv);
    
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(95, (elapsed / estimatedTime) * 100);
        
        const progressFill = document.getElementById('progress-fill');
        const progressPercent = document.getElementById('progress-percent');
        const progressTime = document.getElementById('progress-time');
        
        if (progressFill) progressFill.style.width = progress + '%';
        if (progressPercent) progressPercent.textContent = Math.floor(progress) + '%';
        
        const remaining = Math.max(0, Math.ceil((estimatedTime - elapsed) / 1000));
        if (progressTime) progressTime.textContent = `預計 ${remaining} 秒`;
        
        if (progress >= 95) clearInterval(interval);
    }, 100);
    
    return interval;
}

// Single Image Generation
async function generateImage() {
    const basePrompt = promptInput.value.trim();
    if (!basePrompt) {
        showNotification('⚠️ 請輸入提示詞', 'error');
        return;
    }
    
    const selectedModelKey = modelSelect.value;
    const config = modelConfigs[selectedModelKey];
    const styleKey = styleSelect.value.trim();
    let fullPrompt = basePrompt;
    const stylePromptText = stylePrompts[styleKey] || '';
    if (stylePromptText) fullPrompt = `${basePrompt}, ${stylePromptText}`;
    
    const resolution = resolutionSelect?.value || '2K';
    const aspectRatio = aspectRatioSelect?.value || '1:1';
    const creativity = creativitySlider?.value || 70;
    
    if (resolution === '4K') fullPrompt += ', 4K ultra high resolution';
    else if (resolution === '2K') fullPrompt += ', 2K high quality';
    
    generateBtn.disabled = true;
    batchBtn.disabled = true;
    
    resultContainer.style.display = 'block';
    const progressInterval = showProgressBar(resultContainer, config.displayName);
    
    try {
        if (typeof puter === 'undefined' || !puter.ai) {
            throw new Error('Puter.js 尚未初始化,請重新整理頁面');
        }
        
        console.log('🍌 使用模型:', config.model, config.provider ? `(provider: ${config.provider})` : '');
        const imageElement = await callTxt2Img(fullPrompt, selectedModelKey);
        
        clearInterval(progressInterval);
        
        if (!imageElement || !imageElement.src) throw new Error('生成失敗:未返回圖像');
        
        const imageData = imageElement.src;
        const params = { resolution, aspectRatio, creativity };
        gallery.add(imageData, fullPrompt, selectedModelKey, styleKey, params);
        
        resultContainer.innerHTML = `
            <div style="text-align: center;">
                <p style="color: var(--nb-success); font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">✅ 香蕉圖像生成成功!</p>
                <p style="color: var(--nb-text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">模型: ${config.displayName} | 風格: ${styleDescriptions[styleKey] || '無'} | 解析度: ${resolution}</p>
            </div>
        `;
        
        imageElement.style.cssText = 'max-width: 100%; border-radius: 12px; box-shadow: var(--nb-shadow-lg); cursor: pointer;';
        imageElement.addEventListener('click', () => window.open(imageData, '_blank'));
        resultContainer.appendChild(imageElement);
        
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = 'display: flex; gap: 1rem; margin-top: 1rem; flex-wrap: wrap;';
        actionsDiv.innerHTML = `
            <a href="${imageData}" download="banana-${Date.now()}.png" class="nb-btn-primary" style="flex: 1; text-decoration: none;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                🍌 下載圖像
            </a>
            <button onclick="generateImage()" class="nb-btn-secondary" style="flex: 1;">🔄 重新生成</button>
        `;
        resultContainer.appendChild(actionsDiv);
        
        showNotification('✅ 圖像生成成功!');
    } catch (error) {
        clearInterval(progressInterval);
        console.error('Generation error:', error);
        resultContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: var(--nb-error); font-weight: 600; margin-bottom: 1rem;">❌ 生成失敗</p>
                <p style="color: var(--nb-text-secondary); font-size: 0.9rem;">${error.message}</p>
                <button onclick="generateImage()" class="nb-btn-secondary" style="margin-top: 1rem;">🔄 重試</button>
            </div>
        `;
        showNotification('❌ 生成失敗: ' + error.message, 'error');
    } finally {
        generateBtn.disabled = false;
        batchBtn.disabled = false;
    }
}

// Gallery
function renderGallery() {
    const images = gallery.images;
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
                <small>開始創作你的第一张圖像吧! 🍌</small>
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
                <p style="font-size: 0.85rem; color: var(--nb-text-secondary); margin-bottom: 0.5rem;">${img.prompt.substring(0, 60)}${img.prompt.length > 60 ? '...' : ''}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75rem; color: var(--nb-primary-dark); font-weight: 600;">${img.modelName}</span>
                    <button class="nb-btn-secondary" style="padding: 0.5rem; font-size: 0.75rem;" onclick="deleteImage(${img.id})">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        item.querySelector('img').addEventListener('click', () => window.open(img.imageData, '_blank'));
        galleryGrid.appendChild(item);
    });
}

function deleteImage(id) {
    if (confirm('確定要刪除嗎?')) {
        gallery.delete(id);
        renderGallery();
        showNotification('✅ 已刪除');
    }
}

// AI Chat
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    const model = chatModelSelect.value;
    const userMsg = document.createElement('div');
    userMsg.className = 'nb-message nb-user-message';
    userMsg.innerHTML = `<div class="nb-message-avatar">👤</div><div class="nb-message-content"><p>${message}</p></div>`;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'nb-message nb-ai-message';
    loadingMsg.innerHTML = `<div class="nb-message-avatar">🍌</div><div class="nb-message-content"><p>思考中...</p></div>`;
    chatMessages.appendChild(loadingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    try {
        if (typeof puter === 'undefined' || !puter.ai) {
            throw new Error('Puter.js 尚未初始化');
        }
        
        const response = await puter.ai.chat(message, { model });
        loadingMsg.remove();
        const aiMsg = document.createElement('div');
        aiMsg.className = 'nb-message nb-ai-message';
        aiMsg.innerHTML = `<div class="nb-message-avatar">🍌</div><div class="nb-message-content"><p>${response}</p></div>`;
        chatMessages.appendChild(aiMsg);
    } catch (error) {
        loadingMsg.remove();
        console.error('Chat error:', error);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'nb-message nb-ai-message';
        errorMsg.innerHTML = `<div class="nb-message-avatar">🍌</div><div class="nb-message-content"><p style="color: var(--nb-error);">錯誤: ${error.message}</p></div>`;
        chatMessages.appendChild(errorMsg);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Navigation
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetSection = btn.dataset.section;
        if (!targetSection) return;
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `nb-${targetSection}`) section.classList.add('active');
        });
        if (targetSection === 'gallery') renderGallery();
    });
});

// Event Listeners
styleSelect.addEventListener('change', updateStylePreview);
generateBtn.addEventListener('click', generateImage);
if (batchBtn) batchBtn.addEventListener('click', generateBatch);
promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
    }
});
if (clearBtn) {
    clearBtn.addEventListener('click', () => {
        if (confirm('確定要清空所有圖片嗎?')) {
            gallery.clear();
            renderGallery();
            showNotification('✅ 已清空');
        }
    });
}
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Initialize
updateStylePreview();
renderGallery();
window.deleteImage = deleteImage;
window.generateImage = generateImage;

// Add CSS for spin animation
const style = document.createElement('style');
style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
document.head.appendChild(style);

// 初始化檢查
window.addEventListener('load', () => {
    if (typeof puter === 'undefined') {
        showNotification('⚠️ Puter.js 載入失敗,請重新整理頁面', 'error');
    } else {
        console.log('🍌 Nano Banana AI 已就緒 (官方配置)');
    }
});