// Nano Banana AI v2 - Core Logic

// ========== Configuration ==========
const MODELS = {
    'gemini-3-pro': {
        model: 'google/gemini-3-pro-image',
        provider: 'together-ai',
        displayName: 'Gemini 3 Pro Image'
    },
    'flash': {
        model: 'gemini-2.5-flash-image-preview',
        provider: null,
        displayName: 'Gemini 2.5 Flash'
    }
};

const STYLES = {
    '': '',
    'photorealistic': 'photorealistic, ultra realistic, 8k, highly detailed, professional photography',
    'anime': 'anime style, in the style of Studio Ghibli, detailed anime art, vibrant colors',
    'digital-art': 'digital art, concept art, trending on artstation, highly detailed',
    'oil-painting': 'oil painting, fine art, masterpiece, classical painting style',
    'watercolor': 'watercolor painting, soft colors, artistic, dreamy atmosphere',
    '3d-render': '3D render, octane render, unreal engine, photorealistic 3D',
    'cyberpunk': 'cyberpunk style, neon lights, futuristic city, sci-fi, blade runner aesthetic',
    'fantasy': 'fantasy art, magical, ethereal, epic fantasy illustration',
    'minimalist': 'minimalist design, simple, clean, modern aesthetic'
};

const STORAGE_KEY = 'nano_banana_v2_gallery';
const MAX_IMAGES = 50;

// ========== DOM Elements ==========
const elements = {
    // Navigation
    navBtns: document.querySelectorAll('.nav-btn'),
    tabs: document.querySelectorAll('.tab-content'),
    
    // Form
    modelRadios: document.querySelectorAll('input[name="model"]'),
    resolution: document.getElementById('resolution'),
    aspectRatio: document.getElementById('aspect-ratio'),
    style: document.getElementById('style'),
    prompt: document.getElementById('prompt'),
    
    // Buttons
    btnGenerate: document.getElementById('btn-generate'),
    btnBatch: document.getElementById('btn-batch'),
    btnClear: document.getElementById('btn-clear'),
    
    // Result & Gallery
    result: document.getElementById('result'),
    galleryGrid: document.getElementById('gallery-grid'),
    galleryCount: document.getElementById('gallery-count')
};

// ========== Gallery Class ==========
class Gallery {
    constructor() {
        this.images = this.load();
        this.updateCount();
    }

    load() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Gallery load error:', error);
            return [];
        }
    }

    save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.images));
            this.updateCount();
        } catch (error) {
            console.error('Gallery save error:', error);
        }
    }

    add(imageData, prompt, modelKey, style, params) {
        const config = MODELS[modelKey];
        const image = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            imageData,
            prompt,
            modelKey,
            modelName: config ? config.displayName : modelKey,
            style,
            params
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
        if (confirm('確定要清空所有圖片嗎？')) {
            this.images = [];
            this.save();
            this.render();
            showNotification('✅ 畫廊已清空');
        }
    }

    updateCount() {
        if (elements.galleryCount) {
            elements.galleryCount.textContent = this.images.length;
        }
    }

    render() {
        if (!elements.galleryGrid) return;

        if (this.images.length === 0) {
            elements.galleryGrid.innerHTML = `
                <div class="empty-state">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                    </svg>
                    <p>還沒有香蕉圖片</p>
                    <small>開始創作你的第一張圖像吧！🍌</small>
                </div>
            `;
            return;
        }

        elements.galleryGrid.innerHTML = '';
        this.images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${img.imageData}" alt="${escapeHtml(img.prompt.substring(0, 50))}" onclick="window.open('${img.imageData}', '_blank')">
                <div class="gallery-item-info">
                    <div class="gallery-item-prompt" title="${escapeHtml(img.prompt)}">
                        ${escapeHtml(img.prompt.substring(0, 60))}${img.prompt.length > 60 ? '...' : ''}
                    </div>
                    <div class="gallery-item-meta">
                        <span class="gallery-item-model">${img.modelName}</span>
                        <button class="btn btn-secondary" style="padding: 0.375rem 0.75rem; font-size: 0.75rem;" onclick="gallery.delete(${img.id}); gallery.render();">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            elements.galleryGrid.appendChild(item);
        });
    }
}

const gallery = new Gallery();

// ========== Helper Functions ==========
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getSelectedModel() {
    const selected = document.querySelector('input[name="model"]:checked');
    return selected ? selected.value : 'flash';
}

function buildPrompt() {
    let prompt = elements.prompt.value.trim();
    if (!prompt) {
        throw new Error('請輸入提示詞');
    }

    const styleKey = elements.style.value;
    const styleText = STYLES[styleKey] || '';
    if (styleText) {
        prompt = `${prompt}, ${styleText}`;
    }

    const resolution = elements.resolution.value;
    if (resolution === '4K') {
        prompt += ', 4K ultra high resolution';
    } else if (resolution === '2K') {
        prompt += ', 2K high quality';
    }

    return prompt;
}

function showProgress(modelName) {
    elements.result.style.display = 'block';
    elements.result.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">🍌 香蕉動力生成中...</p>
            <p style="color: var(--text-secondary);">\u4f7f\u7528 ${modelName}</p>
            <div class="progress-bar">
                <div class="progress-fill" id="progress-fill" style="width: 0%;"></div>
            </div>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">
                <span id="progress-text">0%</span> • 預計 25 秒
            </p>
        </div>
    `;

    const startTime = Date.now();
    const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(95, (elapsed / 25000) * 100);
        
        const fill = document.getElementById('progress-fill');
        const text = document.getElementById('progress-text');
        
        if (fill) fill.style.width = progress + '%';
        if (text) text.textContent = Math.floor(progress) + '%';
        
        if (progress >= 95) clearInterval(interval);
    }, 100);

    return interval;
}

// ========== API Functions ==========
async function generateImage(prompt, modelKey) {
    const config = MODELS[modelKey];
    if (!config) {
        throw new Error(`未知的模型: ${modelKey}`);
    }

    const options = {
        model: config.model,
        disable_safety_checker: true
    };

    if (config.provider) {
        options.provider = config.provider;
    }

    console.log('🍌 API 調用:', options);
    return await puter.ai.txt2img(prompt, options);
}

// ========== Single Generate ==========
async function handleGenerate() {
    try {
        const modelKey = getSelectedModel();
        const config = MODELS[modelKey];
        const prompt = buildPrompt();

        elements.btnGenerate.disabled = true;
        elements.btnBatch.disabled = true;

        const progressInterval = showProgress(config.displayName);

        const imageElement = await generateImage(prompt, modelKey);
        clearInterval(progressInterval);

        if (!imageElement || !imageElement.src) {
            throw new Error('生成失敗: 未返回圖像');
        }

        const imageData = imageElement.src;
        const params = {
            resolution: elements.resolution.value,
            aspectRatio: elements.aspectRatio.value
        };
        
        gallery.add(imageData, prompt, modelKey, elements.style.value, params);

        elements.result.innerHTML = `
            <div class="result-image">
                <p class="text-success" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">
                    ✅ 圖像生成成功！
                </p>
                <img src="${imageData}" alt="Generated" onclick="window.open('${imageData}', '_blank')">
                <div class="button-group" style="margin-top: 1rem;">
                    <a href="${imageData}" download="banana-${Date.now()}.png" class="btn btn-primary">
                        💾 下載圖像
                    </a>
                    <button onclick="handleGenerate()" class="btn btn-secondary">
                        🔄 重新生成
                    </button>
                </div>
            </div>
        `;

        showNotification('✅ 圖像生成成功！');
    } catch (error) {
        console.error('Generate error:', error);
        elements.result.innerHTML = `
            <div class="text-center">
                <p class="text-error" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">
                    ❌ 生成失敗
                </p>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${error.message}</p>
                <button onclick="handleGenerate()" class="btn btn-secondary">
                    🔄 重試
                </button>
            </div>
        `;
        showNotification('❌ ' + error.message, 'error');
    } finally {
        elements.btnGenerate.disabled = false;
        elements.btnBatch.disabled = false;
    }
}

// ========== Batch Generate ==========
async function handleBatch() {
    try {
        const modelKey = getSelectedModel();
        const config = MODELS[modelKey];
        const basePrompt = buildPrompt();

        elements.btnGenerate.disabled = true;
        elements.btnBatch.disabled = true;

        elements.result.style.display = 'block';
        elements.result.innerHTML = `
            <div class="text-center">
                <h3 style="margin-bottom: 1rem;">🍌 批量生成 4 張變體</h3>
                <div class="batch-grid" id="batch-grid"></div>
            </div>
        `;

        const batchGrid = document.getElementById('batch-grid');
        let successCount = 0;

        for (let i = 0; i < 4; i++) {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'batch-item';
            itemDiv.innerHTML = `
                <div class="loading">
                    <div class="spinner" style="width: 32px; height: 32px;"></div>
                    <p style="margin-top: 0.5rem; font-size: 0.9rem;">變體 ${i + 1}/4</p>
                </div>
            `;
            batchGrid.appendChild(itemDiv);

            try {
                const prompt = `${basePrompt}, variation ${i + 1}`;
                const imageElement = await generateImage(prompt, modelKey);

                if (imageElement && imageElement.src) {
                    const imageData = imageElement.src;
                    itemDiv.innerHTML = `
                        <img src="${imageData}" alt="Variation ${i + 1}" onclick="window.open('${imageData}', '_blank')">
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            <button class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem;" 
                                    onclick="saveVariant('${imageData}', '${escapeHtml(basePrompt)}', '${modelKey}')">
                                ♥️ 保存
                            </button>
                            <a href="${imageData}" download="banana-${i + 1}.png" 
                               class="btn btn-secondary" style="flex: 1; padding: 0.5rem; font-size: 0.85rem; text-decoration: none; text-align: center;">
                                ⬇️ 下載
                            </a>
                        </div>
                    `;
                    successCount++;
                } else {
                    throw new Error('生成失敗');
                }
            } catch (error) {
                console.error(`Batch ${i + 1} error:`, error);
                itemDiv.innerHTML = `<p class="text-error" style="padding: 2rem; text-align: center;">❌ 失敗</p>`;
            }
        }

        if (successCount > 0) {
            showNotification(`✅ 成功生成 ${successCount}/4 张！`);
        } else {
            showNotification('❌ 批量生成失敗', 'error');
        }
    } catch (error) {
        console.error('Batch error:', error);
        showNotification('❌ ' + error.message, 'error');
    } finally {
        elements.btnGenerate.disabled = false;
        elements.btnBatch.disabled = false;
    }
}

window.saveVariant = function(imageData, prompt, modelKey) {
    const params = {
        resolution: elements.resolution.value,
        aspectRatio: elements.aspectRatio.value
    };
    gallery.add(imageData, prompt, modelKey, elements.style.value, params);
    showNotification('✅ 已保存到畫廊！');
};

// ========== Navigation ==========
function switchTab(tabName) {
    elements.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    elements.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.id === `tab-${tabName}`);
    });
    
    if (tabName === 'gallery') {
        gallery.render();
    }
}

// ========== Event Listeners ==========
elements.navBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

elements.btnGenerate.addEventListener('click', handleGenerate);
elements.btnBatch.addEventListener('click', handleBatch);
elements.btnClear.addEventListener('click', () => gallery.clear());

elements.prompt.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
    }
});

// ========== Initialize ==========
window.addEventListener('load', () => {
    if (typeof puter === 'undefined') {
        showNotification('⚠️ Puter.js 載入失敗，請重新整理頁面', 'error');
    } else {
        console.log('🍌 Nano Banana AI v2 Ready!');
    }
    gallery.render();
});

// Add slide animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Make gallery accessible globally
window.gallery = gallery;