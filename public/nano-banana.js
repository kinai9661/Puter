// Nano Banana AI - JavaScript

// DOM 元素
const navBtns = document.querySelectorAll('.nb-nav-btn');
const sections = document.querySelectorAll('.nb-section');

// 圖像生成
const modelSelect = document.getElementById('nb-model-select');
const styleSelect = document.getElementById('nb-style-select');
const stylePreview = document.getElementById('nb-style-preview');
const promptInput = document.getElementById('nb-prompt-input');
const generateBtn = document.getElementById('nb-generate-btn');
const resultContainer = document.getElementById('nb-result-container');

// 畫廊
const galleryGrid = document.getElementById('nb-gallery-grid');
const totalCount = document.getElementById('nb-total-count');
const clearBtn = document.getElementById('nb-clear-btn');

// 聊天
const chatMessages = document.getElementById('nb-chat-messages');
const chatInput = document.getElementById('nb-chat-input');
const sendBtn = document.getElementById('nb-send-btn');
const chatModelSelect = document.getElementById('nb-chat-model-select');

// 常量
const STORAGE_KEY = 'nano_banana_gallery';
const MAX_IMAGES = 50;

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

    add(imageData, prompt, model, style) {
        const image = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            imageData,
            prompt,
            model,
            style,
            modelName: modelNames[model] || model
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

// 工具函數
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
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
    }, 2000);
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

// 切換 Section
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetSection = btn.dataset.section;
        
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

// 圖像生成
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
        console.log('✅ 風格:', styleKey, '\n提示詞:', stylePromptText);
    }
    
    generateBtn.disabled = true;
    const modelName = modelNames[selectedModel] || selectedModel;
    
    resultContainer.style.display = 'block';
    resultContainer.innerHTML = `
        <div class="nb-loading">
            <div class="nb-loading-spinner"></div>
            <p>🍌 香蕉動力生成中... (使用 ${modelName})</p>
            <small style="color: var(--nb-text-secondary);">Nano Banana AI 官方 API • 預計 15-30 秒</small>
        </div>
    `;
    
    try {
        const imageElement = await puter.ai.txt2img(fullPrompt, {
            model: selectedModel,
            disable_safety_checker: true
        });
        
        if (!imageElement || !imageElement.src) {
            throw new Error('圖像生成失敗');
        }
        
        const imageData = imageElement.src;
        
        // 保存到畫廊
        gallery.add(imageData, fullPrompt, selectedModel, styleKey);
        
        // 顯示結果
        resultContainer.innerHTML = `
            <div style="text-align: center;">
                <p style="color: var(--nb-success); font-weight: 600; font-size: 1.1rem; margin-bottom: 1rem;">
                    ✅ 香蕉圖像生成成功!
                </p>
                <p style="color: var(--nb-text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    模型: ${modelName} | 風格: ${styleDescriptions[styleKey] || '無'}
                </p>
            </div>
        `;
        
        imageElement.style.cssText = 'max-width: 100%; border-radius: 12px; box-shadow: var(--nb-shadow-lg); cursor: pointer;';
        imageElement.addEventListener('click', () => window.open(imageData, '_blank'));
        resultContainer.appendChild(imageElement);
        
        // 下載按鈕
        const downloadBtn = document.createElement('a');
        downloadBtn.href = imageData;
        downloadBtn.download = `banana-${modelName.replace(/\s+/g, '-')}-${Date.now()}.png`;
        downloadBtn.className = 'nb-btn-primary';
        downloadBtn.style.marginTop = '1rem';
        downloadBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            🍌 下載香蕉圖像
        `;
        resultContainer.appendChild(downloadBtn);
        
        showNotification('✅ 圖像生成成功!');
        
    } catch (error) {
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
    }
}

// 渲染畫廊
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
    
    // 顯示用戶消息
    const userMsg = document.createElement('div');
    userMsg.className = 'nb-message nb-user-message';
    userMsg.innerHTML = `
        <div class="nb-message-avatar">👤</div>
        <div class="nb-message-content"><p>${message}</p></div>
    `;
    chatMessages.appendChild(userMsg);
    chatInput.value = '';
    
    // 顯示加載
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

// 事件監聽
styleSelect.addEventListener('change', updateStylePreview);
generateBtn.addEventListener('click', generateImage);
promptInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
    }
});

clearBtn.addEventListener('click', () => {
    if (confirm('確定要清空所有香蕉圖片嗎?此操作無法撤銷!')) {
        gallery.clear();
        renderGallery();
        showNotification('✅ 已清空畫廊');
    }
});

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// 初始化
updateStylePreview();
renderGallery();

// 暴露全局函數
window.deleteImage = deleteImage;
