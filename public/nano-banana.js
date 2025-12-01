// Nano Banana AI - 完整功能版 (文生圖 + 圖生圖 + 圖像編輯 + 文字助手)
// 結合官方 Free Gemini API 教學

// ========== Configuration ==========

// 圖片生成模型配置（用於 txt2img, img2img, edit）
const IMG_MODELS = {
    'gemini-3-pro-image': {
        model: 'google/gemini-3-pro-image',
        provider: 'together-ai',
        displayName: 'Gemini 3 Pro Image'
    },
    'gemini-2.5-flash-image': {
        model: 'gemini-2.5-flash-image-preview',
        provider: null,
        displayName: 'Gemini 2.5 Flash Image'
    }
};

// 文字/分析模型配置（完全遵循官方 Free Gemini API）
const CHAT_MODELS = {
    'gemini-3-pro-preview': {
        model: 'gemini-3-pro-preview',
        displayName: 'Gemini 3 Pro Preview'
    },
    'gemini-2.5-flash': {
        model: 'gemini-2.5-flash',
        displayName: 'Gemini 2.5 Flash'
    },
    'gemini-2.5-flash-lite': {
        model: 'gemini-2.5-flash-lite',
        displayName: 'Gemini 2.5 Flash Lite'
    },
    'gemini-2.5-pro': {
        model: 'gemini-2.5-pro',
        displayName: 'Gemini 2.5 Pro'
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

const STORAGE_KEY = 'nano_banana_gallery';
const MAX_IMAGES = 50;

// ========== Global State ==========
let img2imgFile = null;
let editFile = null;

// ========== DOM Elements ==========
const elements = {
    navBtns: document.querySelectorAll('.nav-btn'),
    tabs: document.querySelectorAll('.tab-content'),
    modelRadios: document.querySelectorAll('input[name="model"]'),
    resolution: document.getElementById('resolution'),
    aspectRatio: document.getElementById('aspect-ratio'),
    style: document.getElementById('style'),
    prompt: document.getElementById('prompt'),
    btnGenerate: document.getElementById('btn-generate'),
    btnBatch: document.getElementById('btn-batch'),
    result: document.getElementById('result'),
    
    // 圖生圖
    img2imgInput: document.getElementById('img2img-input'),
    img2imgUploadArea: document.getElementById('img2img-upload-area'),
    img2imgPlaceholder: document.getElementById('img2img-placeholder'),
    img2imgPreview: document.getElementById('img2img-preview'),
    img2imgPreviewImg: document.getElementById('img2img-preview-img'),
    img2imgRemove: document.getElementById('img2img-remove'),
    img2imgStrength: document.getElementById('img2img-strength'),
    img2imgStrengthValue: document.getElementById('img2img-strength-value'),
    img2imgPrompt: document.getElementById('img2img-prompt'),
    btnImg2Img: document.getElementById('btn-img2img'),
    img2imgResult: document.getElementById('img2img-result'),
    
    // 圖像編輯
    editInput: document.getElementById('edit-input'),
    editUploadArea: document.getElementById('edit-upload-area'),
    editPlaceholder: document.getElementById('edit-placeholder'),
    editPreview: document.getElementById('edit-preview'),
    editPreviewImg: document.getElementById('edit-preview-img'),
    editRemove: document.getElementById('edit-remove'),
    editInstruction: document.getElementById('edit-instruction'),
    btnEdit: document.getElementById('btn-edit'),
    editResult: document.getElementById('edit-result'),
    
    galleryGrid: document.getElementById('gallery-grid'),
    galleryCount: document.getElementById('gallery-count'),
    btnClear: document.getElementById('btn-clear')
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

    add(imageData, prompt, modelKey, type = 'text2img', params = {}) {
        const config = IMG_MODELS[modelKey];
        const image = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            imageData,
            prompt,
            modelKey,
            modelName: config ? config.displayName : modelKey,
            type,
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
            const typeEmoji = img.type === 'img2img' ? '🖼️' : img.type === 'edit' ? '✏️' : '🎨';
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${img.imageData}" alt="${escapeHtml(img.prompt.substring(0, 50))}" onclick="window.open('${img.imageData}', '_blank')">
                <div class="gallery-item-info">
                    <div class="gallery-item-prompt" title="${escapeHtml(img.prompt)}">
                        ${typeEmoji} ${escapeHtml(img.prompt.substring(0, 50))}${img.prompt.length > 50 ? '...' : ''}
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
        position: fixed; top: 20px; right: 20px; padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
        color: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 9999; font-weight: 600; animation: slideIn 0.3s ease;
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
    return selected ? selected.value : 'gemini-2.5-flash-image';
}

function buildPrompt(basePrompt) {
    let prompt = basePrompt || elements.prompt.value.trim();
    if (!prompt) throw new Error('請輸入提示詞');

    const styleKey = elements.style.value;
    const styleText = STYLES[styleKey] || '';
    if (styleText) prompt = `${prompt}, ${styleText}`;

    const resolution = elements.resolution.value;
    if (resolution === '4K') prompt += ', 4K ultra high resolution';
    else if (resolution === '2K') prompt += ', 2K high quality';

    return prompt;
}

function showProgress(modelName, container) {
    container.style.display = 'block';
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">🍌 香蕉動力生成中...</p>
            <p style="color: var(--text-secondary);">使用 ${modelName}</p>
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

// 圖片生成 API（使用 IMG_MODELS）
async function generateImage(prompt, modelKey) {
    const config = IMG_MODELS[modelKey];
    if (!config) throw new Error(`未知的圖片模型: ${modelKey}`);

    const options = { model: config.model, disable_safety_checker: true };
    if (config.provider) options.provider = config.provider;

    console.log('🍌 Text2Img API:', options);
    return await puter.ai.txt2img(prompt, options);
}

// 圖生圖 API（使用 IMG_MODELS）
async function img2imgGenerate(imageFile, prompt, strength, modelKey) {
    const config = IMG_MODELS[modelKey];
    if (!config) throw new Error(`未知的圖片模型: ${modelKey}`);

    const options = {
        model: config.model,
        image: imageFile,
        prompt: prompt,
        strength: strength,
        disable_safety_checker: true
    };
    if (config.provider) options.provider = config.provider;

    console.log('🍌 Img2Img API:', options);
    
    try {
        if (puter.ai.img2img) {
            return await puter.ai.img2img(options);
        } else {
            return await puter.ai.txt2img(prompt + ' (style transfer)', options);
        }
    } catch (error) {
        console.error('Img2Img error:', error);
        throw error;
    }
}

// 圖像編輯 API（使用 IMG_MODELS）
async function editImage(imageFile, instruction, modelKey) {
    const config = IMG_MODELS[modelKey];
    if (!config) throw new Error(`未知的圖片模型: ${modelKey}`);

    const options = {
        model: config.model,
        image: imageFile,
        instruction: instruction,
        disable_safety_checker: true
    };
    if (config.provider) options.provider = config.provider;

    console.log('🍌 Edit API:', options);
    
    try {
        if (puter.ai.editImage) {
            return await puter.ai.editImage(options);
        } else {
            return await puter.ai.txt2img(instruction, options);
        }
    } catch (error) {
        console.error('Edit error:', error);
        throw error;
    }
}

// 文字對話 API（使用 CHAT_MODELS - 完全遵循官方）
async function callChat(prompt, chatModelKey = 'gemini-2.5-flash', extraOptions = {}) {
    const config = CHAT_MODELS[chatModelKey];
    if (!config) throw new Error(`未知的文字模型: ${chatModelKey}`);

    const options = {
        model: config.model,
        ...extraOptions
    };

    console.log('🍌 Chat API:', options);
    return await puter.ai.chat(prompt, options);
}

// 圖像分析 API（使用 CHAT_MODELS - 官方 Example 5）
async function analyzeImage(prompt, imageUrl, chatModelKey = 'gemini-2.5-flash') {
    const config = CHAT_MODELS[chatModelKey];
    if (!config) throw new Error(`未知的文字模型: ${chatModelKey}`);

    console.log('🍌 Image Analysis API:', config.model);
    return await puter.ai.chat(prompt, imageUrl, { model: config.model });
}

// Prompt 優化（使用文字模型）
async function optimizePrompt(userPrompt) {
    const systemPrompt = `You are a professional AI image prompt engineer. Enhance the following prompt to generate better images. Make it more detailed, vivid, and specific. Return only the enhanced prompt without explanations.\n\nUser prompt: ${userPrompt}`;
    
    try {
        const response = await callChat(systemPrompt, 'gemini-3-pro-preview');
        return response.trim();
    } catch (error) {
        console.error('Prompt optimization failed:', error);
        return userPrompt; // 失敗則返回原提示詞
    }
}

// ========== Text2Img Functions ==========
async function handleGenerate() {
    try {
        const modelKey = getSelectedModel();
        const config = IMG_MODELS[modelKey];
        const prompt = buildPrompt();

        elements.btnGenerate.disabled = true;
        elements.btnBatch.disabled = true;

        const progressInterval = showProgress(config.displayName, elements.result);
        const imageElement = await generateImage(prompt, modelKey);
        clearInterval(progressInterval);

        if (!imageElement || !imageElement.src) throw new Error('生成失敗: 未返回圖像');

        const imageData = imageElement.src;
        gallery.add(imageData, prompt, modelKey, 'text2img', {
            resolution: elements.resolution.value,
            aspectRatio: elements.aspectRatio.value,
            style: elements.style.value
        });

        elements.result.innerHTML = `
            <div class="result-image">
                <p class="text-success" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">✅ 圖像生成成功！</p>
                <img src="${imageData}" alt="Generated" onclick="window.open('${imageData}', '_blank')">
                <div class="button-group" style="margin-top: 1rem;">
                    <a href="${imageData}" download="banana-${Date.now()}.png" class="btn btn-primary">💾 下載圖像</a>
                    <button onclick="handleGenerate()" class="btn btn-secondary">🔄 重新生成</button>
                </div>
            </div>
        `;
        showNotification('✅ 圖像生成成功！');
    } catch (error) {
        console.error('Generate error:', error);
        elements.result.innerHTML = `
            <div class="text-center">
                <p class="text-error" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">❌ 生成失敗</p>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${error.message}</p>
                <button onclick="handleGenerate()" class="btn btn-secondary">🔄 重試</button>
            </div>
        `;
        showNotification('❌ ' + error.message, 'error');
    } finally {
        elements.btnGenerate.disabled = false;
        elements.btnBatch.disabled = false;
    }
}

async function handleBatch() {
    try {
        const modelKey = getSelectedModel();
        const config = IMG_MODELS[modelKey];
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
            itemDiv.innerHTML = `<div class="loading"><div class="spinner" style="width: 32px; height: 32px;"></div><p style="margin-top: 0.5rem; font-size: 0.9rem;">變體 ${i + 1}/4</p></div>`;
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
                                ❤️ 保存
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

        showNotification(successCount > 0 ? `✅ 成功生成 ${successCount}/4 張！` : '❌ 批量生成失敗', successCount > 0 ? 'success' : 'error');
    } catch (error) {
        console.error('Batch error:', error);
        showNotification('❌ ' + error.message, 'error');
    } finally {
        elements.btnGenerate.disabled = false;
        elements.btnBatch.disabled = false;
    }
}

window.saveVariant = function(imageData, prompt, modelKey) {
    gallery.add(imageData, prompt, modelKey, 'text2img', {
        resolution: elements.resolution.value,
        aspectRatio: elements.aspectRatio.value
    });
    showNotification('✅ 已保存到畫廊！');
};

// ========== Img2Img Functions ==========
function setupImg2ImgUpload() {
    elements.img2imgUploadArea.addEventListener('click', () => elements.img2imgInput.click());
    
    elements.img2imgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showNotification('❌ 請上傳圖片文件', 'error');
            return;
        }
        
        img2imgFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
            elements.img2imgPreviewImg.src = event.target.result;
            elements.img2imgPlaceholder.style.display = 'none';
            elements.img2imgPreview.style.display = 'block';
            elements.btnImg2Img.disabled = false;
        };
        reader.readAsDataURL(file);
    });

    elements.img2imgRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        img2imgFile = null;
        elements.img2imgInput.value = '';
        elements.img2imgPlaceholder.style.display = 'block';
        elements.img2imgPreview.style.display = 'none';
        elements.btnImg2Img.disabled = true;
    });

    elements.img2imgStrength.addEventListener('input', (e) => {
        elements.img2imgStrengthValue.textContent = e.target.value + '%';
    });
}

async function handleImg2Img() {
    if (!img2imgFile) {
        showNotification('❌ 請先上傳參考圖片', 'error');
        return;
    }

    try {
        const modelKey = getSelectedModel();
        const config = IMG_MODELS[modelKey];
        const prompt = elements.img2imgPrompt.value.trim() || 'anime style transformation';
        const strength = elements.img2imgStrength.value / 100;

        elements.btnImg2Img.disabled = true;
        const progressInterval = showProgress(config.displayName, elements.img2imgResult);

        const imageElement = await img2imgGenerate(img2imgFile, prompt, strength, modelKey);
        clearInterval(progressInterval);

        if (!imageElement || !imageElement.src) throw new Error('圖生圖失敗');

        const imageData = imageElement.src;
        gallery.add(imageData, prompt, modelKey, 'img2img', { strength });

        elements.img2imgResult.innerHTML = `
            <div class="result-image">
                <p class="text-success" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">✅ 圖生圖成功！</p>
                <img src="${imageData}" alt="Img2Img Result" onclick="window.open('${imageData}', '_blank')">
                <div class="button-group" style="margin-top: 1rem;">
                    <a href="${imageData}" download="img2img-${Date.now()}.png" class="btn btn-primary">💾 下載圖像</a>
                    <button onclick="handleImg2Img()" class="btn btn-secondary">🔄 重新生成</button>
                </div>
            </div>
        `;
        showNotification('✅ 圖生圖成功！');
    } catch (error) {
        console.error('Img2Img error:', error);
        elements.img2imgResult.innerHTML = `<div class="text-center"><p class="text-error">❌ 圖生圖失敗: ${error.message}</p></div>`;
        showNotification('❌ ' + error.message, 'error');
    } finally {
        elements.btnImg2Img.disabled = false;
    }
}

// ========== Edit Functions ==========
function setupEditUpload() {
    elements.editUploadArea.addEventListener('click', () => elements.editInput.click());
    
    elements.editInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showNotification('❌ 請上傳圖片文件', 'error');
            return;
        }
        
        editFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
            elements.editPreviewImg.src = event.target.result;
            elements.editPlaceholder.style.display = 'none';
            elements.editPreview.style.display = 'block';
            elements.btnEdit.disabled = false;
        };
        reader.readAsDataURL(file);
    });

    elements.editRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        editFile = null;
        elements.editInput.value = '';
        elements.editPlaceholder.style.display = 'block';
        elements.editPreview.style.display = 'none';
        elements.btnEdit.disabled = true;
    });

    // 快速指令
    document.querySelectorAll('.quick-cmd').forEach(btn => {
        btn.addEventListener('click', () => {
            elements.editInstruction.value = btn.dataset.cmd;
        });
    });
}

async function handleEdit() {
    if (!editFile) {
        showNotification('❌ 請先上傳要編輯的圖片', 'error');
        return;
    }

    try {
        const modelKey = getSelectedModel();
        const config = IMG_MODELS[modelKey];
        const instruction = elements.editInstruction.value.trim();
        
        if (!instruction) {
            showNotification('❌ 請輸入編輯指令', 'error');
            return;
        }

        elements.btnEdit.disabled = true;
        const progressInterval = showProgress(config.displayName, elements.editResult);

        const imageElement = await editImage(editFile, instruction, modelKey);
        clearInterval(progressInterval);

        if (!imageElement || !imageElement.src) throw new Error('圖像編輯失敗');

        const imageData = imageElement.src;
        gallery.add(imageData, instruction, modelKey, 'edit', {});

        elements.editResult.innerHTML = `
            <div class="result-image">
                <p class="text-success" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">✅ 圖像編輯成功！</p>
                <img src="${imageData}" alt="Edit Result" onclick="window.open('${imageData}', '_blank')">
                <div class="button-group" style="margin-top: 1rem;">
                    <a href="${imageData}" download="edited-${Date.now()}.png" class="btn btn-primary">💾 下載圖像</a>
                    <button onclick="handleEdit()" class="btn btn-secondary">🔄 重新編輯</button>
                </div>
            </div>
        `;
        showNotification('✅ 圖像編輯成功！');
    } catch (error) {
        console.error('Edit error:', error);
        elements.editResult.innerHTML = `<div class="text-center"><p class="text-error">❌ 編輯失敗: ${error.message}</p></div>`;
        showNotification('❌ ' + error.message, 'error');
    } finally {
        elements.btnEdit.disabled = false;
    }
}

// ========== Navigation ==========
function switchTab(tabName) {
    elements.navBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    elements.tabs.forEach(tab => {
        tab.classList.toggle('active', tab.id === `tab-${tabName}`);
    });
    
    if (tabName === 'gallery') gallery.render();
}

// ========== Event Listeners ==========
elements.navBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

elements.btnGenerate.addEventListener('click', handleGenerate);
elements.btnBatch.addEventListener('click', handleBatch);
elements.btnImg2Img.addEventListener('click', handleImg2Img);
elements.btnEdit.addEventListener('click', handleEdit);
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
        console.log('🍌 Nano Banana AI Ready! (Full Version + Official Free Gemini API)');
        console.log('📸 Image Models:', IMG_MODELS);
        console.log('💬 Chat Models:', CHAT_MODELS);
    }
    
    setupImg2ImgUpload();
    setupEditUpload();
    gallery.render();
});

// Animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
`;
document.head.appendChild(style);

// Global exports
window.gallery = gallery;
window.callChat = callChat;
window.analyzeImage = analyzeImage;
window.optimizePrompt = optimizePrompt;