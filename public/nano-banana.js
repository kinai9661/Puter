// Nano Banana AI - 完整功能版 (文生圖 + 圖生圖 + 圖像編輯 + 圖像分析)
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
let analyzeFile = null;
let analyzeImageUrl = null;

// ========== DOM Elements ==========
const elements = {
    navBtns: document.querySelectorAll('.nav-btn'),
    tabs: document.querySelectorAll('.tab-content'),
    modelRadios: document.querySelectorAll('input[name="model"]'),
    style: document.getElementById('style'),
    prompt: document.getElementById('prompt'),
    btnOptimize: document.getElementById('btn-optimize'),
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
    
    // 圖像分析
    analyzeInput: document.getElementById('analyze-input'),
    analyzeUploadArea: document.getElementById('analyze-upload-area'),
    analyzePlaceholder: document.getElementById('analyze-placeholder'),
    analyzePreview: document.getElementById('analyze-preview'),
    analyzePreviewImg: document.getElementById('analyze-preview-img'),
    analyzeRemove: document.getElementById('analyze-remove'),
    analyzeModel: document.getElementById('analyze-model'),
    analyzeQuestion: document.getElementById('analyze-question'),
    btnAnalyze: document.getElementById('btn-analyze'),
    analyzeResult: document.getElementById('analyze-result'),
    
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

    return prompt;
}

function showLoading(modelName, container) {
    container.style.display = 'block';
    container.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">🍌 AI 生成中...</p>
            <p style="color: var(--text-secondary);">使用 ${modelName}</p>
            <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.5rem;">預計 20-30 秒</p>
        </div>
    `;
}

// 提取錯誤訊息
function extractErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error?.error?.message) return error.error.message;
    if (error?.error) return JSON.stringify(error.error);
    if (error?.message) return error.message;
    return JSON.stringify(error);
}

// ========== API Functions ==========

// 圖片生成 API（使用 IMG_MODELS）
async function generateImage(prompt, modelKey) {
    const config = IMG_MODELS[modelKey];
    if (!config) throw new Error(`未知的圖片模型: ${modelKey}`);

    const options = { model: config.model, disable_safety_checker: true };
    if (config.provider) options.provider = config.provider;

    console.log('🍌 Text2Img API:', options);
    const result = await puter.ai.txt2img(prompt, options);
    
    // 檢查 API 返回
    if (result && result.success === false) {
        const errorMsg = extractErrorMessage(result);
        console.error('❌ API Error:', result);
        throw new Error(`API 錯誤: ${errorMsg}`);
    }
    
    return result;
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
        const result = puter.ai.img2img 
            ? await puter.ai.img2img(options)
            : await puter.ai.txt2img(prompt + ' (style transfer)', options);
        
        if (result && result.success === false) {
            const errorMsg = extractErrorMessage(result);
            console.error('❌ API Error:', result);
            throw new Error(`API 錯誤: ${errorMsg}`);
        }
        
        return result;
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
        const result = puter.ai.editImage
            ? await puter.ai.editImage(options)
            : await puter.ai.txt2img(instruction, options);
        
        if (result && result.success === false) {
            const errorMsg = extractErrorMessage(result);
            console.error('❌ API Error:', result);
            throw new Error(`API 錯誤: ${errorMsg}`);
        }
        
        return result;
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

    console.log('🍌 Image Analysis API:', config.model, 'Image:', imageUrl);
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

        showLoading(config.displayName, elements.result);
        const imageElement = await generateImage(prompt, modelKey);

        if (!imageElement || !imageElement.src) throw new Error('生成失敗: 未返回圖像');

        const imageData = imageElement.src;
        gallery.add(imageData, prompt, modelKey, 'text2img', {
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
        const errorMsg = extractErrorMessage(error);
        elements.result.innerHTML = `
            <div class="text-center">
                <p class="text-error" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">❌ 生成失敗</p>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${errorMsg}</p>
                <button onclick="handleGenerate()" class="btn btn-secondary">🔄 重試</button>
            </div>
        `;
        showNotification('❌ ' + errorMsg, 'error');
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
                const errorMsg = extractErrorMessage(error);
                itemDiv.innerHTML = `<p class="text-error" style="padding: 1rem; text-align: center; font-size: 0.85rem;">❌ ${errorMsg.substring(0, 50)}</p>`;
            }
        }

        showNotification(successCount > 0 ? `✅ 成功生成 ${successCount}/4 張！` : '❌ 批量生成失敗', successCount > 0 ? 'success' : 'error');
    } catch (error) {
        console.error('Batch error:', error);
        showNotification('❌ ' + extractErrorMessage(error), 'error');
    } finally {
        elements.btnGenerate.disabled = false;
        elements.btnBatch.disabled = false;
    }
}

window.saveVariant = function(imageData, prompt, modelKey) {
    gallery.add(imageData, prompt, modelKey, 'text2img', {
        style: elements.style.value
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
        showLoading(config.displayName, elements.img2imgResult);

        const imageElement = await img2imgGenerate(img2imgFile, prompt, strength, modelKey);

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
        const errorMsg = extractErrorMessage(error);
        elements.img2imgResult.innerHTML = `<div class="text-center"><p class="text-error">❌ 圖生圖失敗: ${errorMsg}</p></div>`;
        showNotification('❌ ' + errorMsg, 'error');
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
        showLoading(config.displayName, elements.editResult);

        const imageElement = await editImage(editFile, instruction, modelKey);

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
        const errorMsg = extractErrorMessage(error);
        elements.editResult.innerHTML = `<div class="text-center"><p class="text-error">❌ 編輯失敗: ${errorMsg}</p></div>`;
        showNotification('❌ ' + errorMsg, 'error');
    } finally {
        elements.btnEdit.disabled = false;
    }
}

// ========== Analyze Functions ==========
function setupAnalyzeUpload() {
    if (!elements.analyzeUploadArea) return;
    
    elements.analyzeUploadArea.addEventListener('click', () => elements.analyzeInput.click());
    
    elements.analyzeInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            showNotification('❌ 請上傳圖片文件', 'error');
            return;
        }
        
        analyzeFile = file;
        const reader = new FileReader();
        reader.onload = (event) => {
            analyzeImageUrl = event.target.result;
            elements.analyzePreviewImg.src = analyzeImageUrl;
            elements.analyzePlaceholder.style.display = 'none';
            elements.analyzePreview.style.display = 'block';
            elements.btnAnalyze.disabled = false;
        };
        reader.readAsDataURL(file);
    });

    elements.analyzeRemove.addEventListener('click', (e) => {
        e.stopPropagation();
        analyzeFile = null;
        analyzeImageUrl = null;
        elements.analyzeInput.value = '';
        elements.analyzePlaceholder.style.display = 'block';
        elements.analyzePreview.style.display = 'none';
        elements.btnAnalyze.disabled = true;
    });

    // 快速問題
    document.querySelectorAll('.quick-question').forEach(btn => {
        btn.addEventListener('click', () => {
            elements.analyzeQuestion.value = btn.dataset.question;
        });
    });
    
    // 示例圖片
    document.querySelectorAll('.example-item').forEach(item => {
        item.addEventListener('click', async () => {
            const url = item.dataset.url;
            analyzeImageUrl = url;
            analyzeFile = null;
            elements.analyzePreviewImg.src = url;
            elements.analyzePlaceholder.style.display = 'none';
            elements.analyzePreview.style.display = 'block';
            elements.btnAnalyze.disabled = false;
            showNotification('✅ 已載入示例圖片');
        });
    });
}

async function handleAnalyze() {
    if (!analyzeImageUrl) {
        showNotification('❌ 請先上傳要分析的圖片', 'error');
        return;
    }

    try {
        const question = elements.analyzeQuestion.value.trim();
        if (!question) {
            showNotification('❌ 請輸入問題', 'error');
            return;
        }

        const modelKey = elements.analyzeModel.value;
        const config = CHAT_MODELS[modelKey];
        
        elements.btnAnalyze.disabled = true;
        elements.analyzeResult.style.display = 'block';
        elements.analyzeResult.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 0.5rem;">🔍 AI 分析中...</p>
                <p style="color: var(--text-secondary);">使用 ${config.displayName}</p>
            </div>
        `;

        console.log('🔍 Starting analysis:', { question, modelKey, imageUrl: analyzeImageUrl });
        const response = await analyzeImage(question, analyzeImageUrl, modelKey);
        console.log('✅ Analysis complete:', response);

        elements.analyzeResult.innerHTML = `
            <div class="analysis-result">
                <p style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem; color: var(--primary);">🌟 AI 分析結果（${config.displayName}）</p>
                <p>${response.replace(/\n/g, '<br>')}</p>
                <div class="button-group" style="margin-top: 1rem;">
                    <button onclick="handleAnalyze()" class="btn btn-secondary">🔄 重新分析</button>
                </div>
            </div>
        `;
        showNotification('✅ 分析完成！');
    } catch (error) {
        console.error('Analyze error:', error);
        const errorMsg = extractErrorMessage(error);
        elements.analyzeResult.innerHTML = `
            <div class="text-center">
                <p class="text-error" style="font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">❌ 分析失敗</p>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${errorMsg}</p>
                <button onclick="handleAnalyze()" class="btn btn-secondary">🔄 重試</button>
            </div>
        `;
        showNotification('❌ ' + errorMsg, 'error');
    } finally {
        elements.btnAnalyze.disabled = false;
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

if (elements.btnOptimize) {
    elements.btnOptimize.addEventListener('click', async () => {
        const original = elements.prompt.value.trim();
        if (!original) {
            showNotification('❌ 請先輸入提示詞', 'error');
            return;
        }
        
        elements.btnOptimize.disabled = true;
        elements.btnOptimize.textContent = '🤔 優化中...';
        
        try {
            showNotification('✨ AI 優化提示詞中...', 'info');
            const optimized = await optimizePrompt(original);
            elements.prompt.value = optimized;
            showNotification('✅ 提示詞已優化完成！生成效果將更好～');
        } catch (error) {
            console.error('Prompt 優化錯誤:', error);
            showNotification(`❌ 優化失敗: ${extractErrorMessage(error)}`, 'error');
        } finally {
            elements.btnOptimize.disabled = false;
            elements.btnOptimize.textContent = '✨ AI 優化提示詞';
        }
    });
}

elements.btnGenerate.addEventListener('click', handleGenerate);
elements.btnBatch.addEventListener('click', handleBatch);
elements.btnImg2Img.addEventListener('click', handleImg2Img);
elements.btnEdit.addEventListener('click', handleEdit);
if (elements.btnAnalyze) {
    elements.btnAnalyze.addEventListener('click', handleAnalyze);
}
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
        console.log('🍌 Nano Banana AI Ready! (簡化版)');
        console.log('📸 Image Models:', IMG_MODELS);
        console.log('💬 Chat Models:', CHAT_MODELS);
        console.log('🔧 Puter.ai 可用方法:', Object.keys(puter.ai));
    }
    
    setupImg2ImgUpload();
    setupEditUpload();
    setupAnalyzeUpload();
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
window.handleAnalyze = handleAnalyze;