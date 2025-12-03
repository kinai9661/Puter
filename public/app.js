// ==================== 調試模式 ====================
const DEBUG_MODE = true; // 開啟詳細日誌

function debugLog(message, data = null) {
    if (DEBUG_MODE) {
        if (data) {
            console.log(`[DEBUG] ${message}`, data);
        } else {
            console.log(`[DEBUG] ${message}`);
        }
    }
}

// 等待 Puter.js 初始化
let puterReady = false;
let currentUser = null;

// ==================== 用戶認證功能 ====================

// DOM 元素 - 用戶認證
const loginBtn = document.getElementById('login-btn');
const userMenu = document.getElementById('user-menu');
const userMenuTrigger = document.getElementById('user-menu-trigger');
const userDropdown = document.getElementById('user-dropdown');
const userAvatar = document.getElementById('user-avatar');
const userName = document.getElementById('user-name');
const dropdownAvatar = document.getElementById('dropdown-avatar');
const dropdownName = document.getElementById('dropdown-name');
const dropdownEmail = document.getElementById('dropdown-email');
const switchAccountBtn = document.getElementById('switch-account-btn');
const logoutBtn = document.getElementById('logout-btn');

// 檢查用戶登入狀態
async function checkAuthStatus() {
    try {
        debugLog('檢查用戶登入狀態...');
        
        if (!puter || !puter.auth) {
            console.warn('⚠️ Puter 認證模組未就緒');
            showLoginButton();
            return false;
        }

        const isSignedIn = await puter.auth.isSignedIn();
        debugLog('登入狀態:', isSignedIn);
        
        if (isSignedIn) {
            currentUser = await puter.auth.getUser();
            console.log('✅ 用戶已登入:', currentUser.username);
            debugLog('用戶完整資訊:', currentUser);
            showUserMenu(currentUser);
            return true;
        } else {
            console.log('ℹ️ 用戶未登入 - 請點擊「登入 Puter」按鈕');
            showLoginButton();
            showNotification('⚠️ 請先登入才能使用 AI 功能', 'error');
            return false;
        }
    } catch (error) {
        console.error('❌ 檢查登入狀態失敗:', error);
        showLoginButton();
        return false;
    }
}

// 顯示登入按鈕
function showLoginButton() {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (userMenu) userMenu.style.display = 'none';
}

// 顯示用戶選單
function showUserMenu(user) {
    if (!user) return;
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    
    const avatarUrl = user.picture || user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`;
    const displayName = user.username || '用戶';
    const email = user.email || '';
    
    if (userAvatar) {
        userAvatar.src = avatarUrl;
        userAvatar.alt = displayName;
    }
    if (userName) userName.textContent = displayName;
    if (dropdownAvatar) {
        dropdownAvatar.src = avatarUrl;
        dropdownAvatar.alt = displayName;
    }
    if (dropdownName) dropdownName.textContent = displayName;
    if (dropdownEmail) dropdownEmail.textContent = email || '未設置郵箱';
}

// 登入功能
async function handleLogin() {
    try {
        console.log('🔐 開始登入流程...');
        if (!puter || !puter.auth) throw new Error('Puter 認證模組未就緒');
        await puter.auth.signIn();
        currentUser = await puter.auth.getUser();
        console.log('✅ 登入成功:', currentUser.username);
        showUserMenu(currentUser);
        showNotification(`✅ 歡迎回來,${currentUser.username}!`);
    } catch (error) {
        console.error('❌ 登入失敗:', error);
        showNotification(`❌ 登入失敗: ${error.message}`, 'error');
    }
}

// 登出功能
async function handleLogout() {
    try {
        console.log('🚪 開始登出...');
        if (!puter || !puter.auth) throw new Error('Puter 認證模組未就緒');
        await puter.auth.signOut();
        currentUser = null;
        console.log('✅ 登出成功');
        showLoginButton();
        closeUserDropdown();
        showNotification('✅ 已成功登出');
    } catch (error) {
        console.error('❌ 登出失敗:', error);
        showNotification(`❌ 登出失敗: ${error.message}`, 'error');
    }
}

// 切換帳戶功能
async function handleSwitchAccount() {
    try {
        console.log('🔄 切換帳戶...');
        if (!puter || !puter.auth) throw new Error('Puter 認證模組未就緒');
        await puter.auth.signOut();
        await puter.auth.signIn();
        currentUser = await puter.auth.getUser();
        console.log('✅ 切換帳戶成功:', currentUser.username);
        showUserMenu(currentUser);
        closeUserDropdown();
        showNotification(`✅ 已切換到 ${currentUser.username}`);
    } catch (error) {
        console.error('❌ 切換帳戶失敗:', error);
        showNotification(`❌ 切換帳戶失敗: ${error.message}`, 'error');
        showLoginButton();
    }
}

function toggleUserDropdown() {
    if (!userMenu || !userDropdown) return;
    const isActive = userMenu.classList.toggle('active');
    if (!isActive) closeUserDropdown();
}

function closeUserDropdown() {
    if (userMenu) userMenu.classList.remove('active');
}

document.addEventListener('click', (e) => {
    if (userMenu && !userMenu.contains(e.target)) closeUserDropdown();
});

if (loginBtn) loginBtn.addEventListener('click', handleLogin);
if (userMenuTrigger) userMenuTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleUserDropdown();
});
if (switchAccountBtn) switchAccountBtn.addEventListener('click', handleSwitchAccount);
if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

// ==================== Puter.js 初始化 ====================

async function initPuter() {
    try {
        console.log('🚀 正在初始化 Puter.js...');
        
        if (typeof puter === 'undefined') {
            console.log('⏳ 等待 Puter SDK 加載...');
            await new Promise((resolve) => {
                const checkPuter = setInterval(() => {
                    if (typeof puter !== 'undefined') {
                        clearInterval(checkPuter);
                        resolve();
                    }
                }, 100);
                setTimeout(() => {
                    clearInterval(checkPuter);
                    resolve();
                }, 10000);
            });
        }
        
        if (typeof puter === 'undefined') {
            throw new Error('Puter SDK 加載失敗 - 請檢查網路連接');
        }
        
        console.log('✅ Puter.js SDK 加載成功!');
        debugLog('可用的 AI 方法:', Object.keys(puter.ai || {}));
        
        await checkAuthStatus();
        
        puterReady = true;
        console.log('✅ Puter.js 完全初始化成功!');
        return true;
    } catch (error) {
        console.error('❌ Puter.js 初始化失敗:', error);
        puterReady = false;
        showLoginButton();
        showNotification('❌ 初始化失敗,請刷新頁面重試', 'error');
        return false;
    }
}

// ==================== 其他功能代碼 ====================

// DOM 元素
const chatMessages = document.getElementById('messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');
const modelSelect = document.getElementById('model-select');

const imageModelSelect = document.getElementById('image-model-select');
const styleSelect = document.getElementById('style-select');
const aspectRatioSelect = document.getElementById('aspect-ratio-select');
const batchCountSelect = document.getElementById('batch-count-select');
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

// ✅ localStorage 安全包裝器
const HISTORY_KEY = 'puter_ai_image_history';
const MAX_HISTORY = 50;

function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        console.warn('⚠️ localStorage 不可用,使用內存存儲');
        return false;
    }
}

const USE_LOCAL_STORAGE = isLocalStorageAvailable();

class ImageHistory {
    constructor() {
        this.memoryHistory = [];
        this.history = this.loadHistory();
    }

    loadHistory() {
        if (!USE_LOCAL_STORAGE) return this.memoryHistory;
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            const loaded = data ? JSON.parse(data) : [];
            this.memoryHistory = loaded;
            return loaded;
        } catch (error) {
            console.warn('⚠️ 載入記錄失敗,使用內存:', error);
            return this.memoryHistory;
        }
    }

    saveHistory() {
        if (!USE_LOCAL_STORAGE) return;
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
        } catch (error) {
            console.warn('⚠️ 保存記錄失敗:', error);
        }
    }

    addImage(imageData, prompt, model, aspectRatio = '1024x1024') {
        const record = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            imageData,
            prompt,
            model,
            modelName: model.split('/').pop() || model,
            aspectRatio
        };
        this.history.unshift(record);
        this.memoryHistory.unshift(record);
        if (this.history.length > MAX_HISTORY) {
            this.history = this.history.slice(0, MAX_HISTORY);
            this.memoryHistory = this.memoryHistory.slice(0, MAX_HISTORY);
        }
        this.saveHistory();
        return record;
    }

    deleteImage(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.memoryHistory = this.memoryHistory.filter(item => item.id !== id);
        this.saveHistory();
    }

    clearAll() {
        this.history = [];
        this.memoryHistory = [];
        this.saveHistory();
    }

    getStorageSize() {
        if (!USE_LOCAL_STORAGE) {
            const size = JSON.stringify(this.memoryHistory).length;
            return (size / 1024).toFixed(2);
        }
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? (new Blob([data]).size / 1024).toFixed(2) : 0;
        } catch (error) {
            return '0';
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
        if (targetTab === 'history') renderHistory();
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
    }, 3000);
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

const styleDescriptions = {
    '': '無 - 自由風格,不添加額外風格提示詞',
    'photorealistic': '📸 寫實風格 - 超高清寫實效果',
    'anime': '🌸 日本動漫風格 - 吉卜力工作室風格',
    'digital-art': '🖼️ 數位藝術 - 現代數位繪畫風格',
    'oil-painting': '🎨 油畫風格 - 經典油畫質感',
    'watercolor': '🌊 水彩畫 - 柔和水彩效果',
    'sketch': '✏️ 素描風格 - 手繪素描效果',
    '3d-render': '🎬 3D 渲染 - 高品質 3D 建模',
    'cyberpunk': '🤖 賽博龐克 - 未來科技風格',
    'fantasy': '✨ 奇幻風格 - 魔幻奇幻世界',
    'minimalist': '📍 極簡主義 - 簡潔設計',
    'vintage': '📼 復古風格 - 老照片質感',
    'comic': '📖 漫畫風格 - 美式漫畫風格',
    'surreal': '🌀 超現實主義 - 超現實藝術'
};

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

function updateAspectRatioPreview() {
    if (!aspectRatioSelect || !aspectRatioPreview || !imageModelSelect) return;
    const selectedModel = imageModelSelect.value;
    const selectedSize = aspectRatioSelect.value;
    const isPro = selectedModel === 'black-forest-labs/FLUX.2-pro';
    
    if (isPro) {
        Array.from(aspectRatioSelect.options).forEach(option => {
            if (option.value !== '1024x1024') option.disabled = true;
        });
        aspectRatioSelect.value = '1024x1024';
        aspectRatioPreview.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
            </svg>
            <span style="font-size: 0.85rem; color: #f59e0b;">⚠️ FLUX.2 Pro 僅支持 1024x1024(官方限制)</span>
        `;
    } else {
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

function updateBatchCountPreview() {
    if (!batchCountSelect || !batchCountPreview) return;
    const count = parseInt(batchCountSelect.value);
    const text = count === 1 ? '將生成 1 張圖片' : `將並行生成 ${count} 張圖片`;
    batchCountPreview.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="3" width="7" height="7" rx="1"/>
            <rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/>
            <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
        <span style="font-size: 0.85rem; color: #10b981;">✅ ${text}</span>
    `;
}

function openImageModal(imageData, prompt, modelName, aspectRatio = '1024x1024') {
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
                    <span class="modal-size">📐 ${aspectRatio}</span>
                    <div class="modal-actions">
                        <button class="btn-modal-action btn-copy-prompt" title="複製提示詞">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <rect x="9" y="9" width="13" height="13" rx="2"/>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                            複製提示詞
                        </button>
                        <a href="${imageData}" download="flux-${modelName}-${aspectRatio.replace('x', '-')}-${Date.now()}.png" class="btn-modal-action">
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
    modal.querySelector('.btn-copy-prompt').addEventListener('click', () => copyPrompt(prompt));
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
                <small>開始生成圖片後,記錄會自動保存在這裡${USE_LOCAL_STORAGE ? '' : ' (僅當前會話)'}</small>
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
        const aspectRatio = item.aspectRatio || '1024x1024';
        historyItem.innerHTML = `
            <img src="${item.imageData}" alt="${truncatedPrompt}" loading="lazy">
            <div class="history-overlay">
                <div class="history-info">
                    <span class="history-model">${item.modelName}</span>
                    <span class="history-size">📐 ${aspectRatio}</span>
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
                    <a href="${item.imageData}" download="flux-${item.modelName}-${aspectRatio.replace('x', '-')}-${item.id}.png" class="btn-icon" title="下載">
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
        
        img.addEventListener('click', () => openImageModal(item.imageData, item.prompt, item.modelName, aspectRatio));
        btnCopy.addEventListener('click', (e) => {
            e.stopPropagation();
            copyPrompt(item.prompt);
        });
        btnZoom.addEventListener('click', (e) => {
            e.stopPropagation();
            openImageModal(item.imageData, item.prompt, item.modelName, aspectRatio);
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

// FLUX.2 模型資訊
const modelDescriptions = {
    'black-forest-labs/FLUX.2-pro': '🏆 FLUX.2 Pro: 2025 最新專業級模型,完美文字渲染,最高品質(僅支持 1024x1024)',
    'black-forest-labs/FLUX.2-flex': '🔄 FLUX.2 Flex: 彈性模型,適應多種生成需求,支持多種尺寸比例',
    'black-forest-labs/FLUX.2-dev': '🔧 FLUX.2 Dev: 開發版本,適合實驗與測試,支持多種尺寸比例'
};

// 聊天功能
async function sendMessage() {
    if (!puterReady) {
        showNotification('⚠️ 正在初始化,請稍候...', 'error');
        return;
    }
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
        console.error('聊天錯誤:', error);
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

// 🔥 完全重建 FLUX.2 圖像生成 - 嚴格遵循官方文檔
async function generateImage() {
    console.log('🎨 ===== 開始 FLUX.2 圖像生成 =====');
    
    if (!puterReady) {
        console.error('❌ Puter 未就緒');
        showNotification('⚠️ 正在初始化 Puter.js,請稍候...', 'error');
        return;
    }
    
    if (!currentUser) {
        console.error('❌ 用戶未登入');
        showNotification('⚠️ 請先登入才能使用 AI 功能', 'error');
        imageResult.innerHTML = `
            <div class="error-container">
                <p class="error">⚠️ 請先點擊右上角「登入 Puter」按鈕</p>
            </div>
        `;
        return;
    }
    
    const basePrompt = imagePrompt.value.trim();
    const selectedModel = imageModelSelect.value;
    const batchCount = parseInt(batchCountSelect.value);
    
    if (!basePrompt) {
        imageResult.innerHTML = '<p class="error">⚠️ 請輸入圖像描述</p>';
        return;
    }
    
    // 組合風格提示詞
    let fullPrompt = basePrompt;
    if (styleSelect) {
        const styleKey = styleSelect.value.trim();
        const stylePromptText = stylePrompts[styleKey] || '';
        if (stylePromptText) {
            fullPrompt = `${basePrompt}, ${stylePromptText}`;
            debugLog('已添加風格', styleKey);
        }
    }
    
    const isPro = selectedModel === 'black-forest-labs/FLUX.2-pro';
    
    // 獲取圖像比例
    let aspectRatio = '1024x1024';
    if (!isPro && aspectRatioSelect) {
        aspectRatio = aspectRatioSelect.value;
    }
    
    console.log('📋 生成參數:', {
        model: selectedModel,
        isPro,
        aspectRatio,
        batchCount,
        promptLength: fullPrompt.length,
        user: currentUser?.username
    });
    
    generateImgBtn.disabled = true;
    const modelName = selectedModel.split('/').pop() || selectedModel;
    
    const countText = batchCount === 1 ? '1 張圖片' : `${batchCount} 張圖片`;
    imageResult.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading">⚡ 正在使用 ${modelName} 並行生成 ${countText}...</p>
            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 0.5rem;">
                ${isPro ? '專業級品質 • 1024x1024' : `FLUX.2 官方 API • ${aspectRatio}`} • 預計 ${batchCount * 20}-${batchCount * 40} 秒
            </p>
            <div id="batch-progress" style="margin-top: 1rem;"></div>
        </div>
    `;
    
    const batchProgress = document.getElementById('batch-progress');
    
    try {
        const promises = [];
        
        for (let i = 0; i < batchCount; i++) {
            const progressItem = document.createElement('div');
            progressItem.style.cssText = 'padding: 0.5rem; background: rgba(102, 126, 234, 0.1); border-radius: 6px; margin-bottom: 0.5rem; font-size: 0.85rem;';
            progressItem.innerHTML = `🔄 圖片 ${i + 1}/${batchCount}: 正在生成...`;
            batchProgress.appendChild(progressItem);
            
            const promise = generateSingleImage(fullPrompt, selectedModel, isPro, aspectRatio, i + 1)
                .then(result => {
                    progressItem.innerHTML = `✅ 圖片 ${i + 1}/${batchCount}: 生成成功!`;
                    progressItem.style.background = 'rgba(16, 185, 129, 0.1)';
                    return result;
                })
                .catch(error => {
                    console.error(`圖片 ${i + 1} 生成失敗:`, error);
                    progressItem.innerHTML = `❌ 圖片 ${i + 1}/${batchCount}: ${error.message}`;
                    progressItem.style.background = 'rgba(239, 68, 68, 0.1)';
                    return null;
                });
            
            promises.push(promise);
        }
        
        const results = await Promise.all(promises);
        const successResults = results.filter(r => r !== null);
        
        if (successResults.length === 0) {
            throw new Error('所有圖片生成失敗');
        }
        
        const sizeInfo = isPro ? '1024x1024 (官方預設)' : aspectRatio;
        imageResult.innerHTML = `
            <div class="success-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                    <p class="success">✅ 批量生成成功! (共 ${successResults.length} 張,已保存到記錄)</p>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">
                        模型: ${selectedModel} • 尺寸: ${sizeInfo}
                    </p>
                </div>
            </div>
            <div class="batch-result-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; margin-top: 1rem;"></div>
        `;
        
        const grid = imageResult.querySelector('.batch-result-grid');
        
        successResults.forEach((result, index) => {
            const container = document.createElement('div');
            container.style.cssText = 'position: relative; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);';
            
            result.imageElement.style.cssText = 'width: 100%; height: auto; display: block; cursor: pointer;';
            result.imageElement.addEventListener('click', () => openImageModal(result.imageData, fullPrompt, modelName, aspectRatio));
            
            const badge = document.createElement('div');
            badge.style.cssText = 'position: absolute; top: 10px; left: 10px; background: rgba(0, 0, 0, 0.7); color: white; padding: 0.25rem 0.5rem; border-radius: 6px; font-size: 0.75rem; font-weight: 600;';
            badge.textContent = `#${index + 1}`;
            
            const downloadBtn = document.createElement('a');
            downloadBtn.href = result.imageData;
            downloadBtn.download = `flux2-${modelName}-${aspectRatio.replace('x', '-')}-${index + 1}-${Date.now()}.png`;
            downloadBtn.style.cssText = 'position: absolute; bottom: 10px; right: 10px; background: rgba(102, 126, 234, 0.9); color: white; padding: 0.5rem; border-radius: 8px; text-decoration: none; display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; font-weight: 600;';
            downloadBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                下載
            `;
            
            container.appendChild(result.imageElement);
            container.appendChild(badge);
            container.appendChild(downloadBtn);
            grid.appendChild(container);
        });
        
        showNotification(`✅ 成功生成 ${successResults.length} 張圖片!`);
        console.log('🎉 ===== 圖像生成完成 =====');
        
    } catch (error) {
        console.error('❌ 批量生成錯誤:', error);
        console.error('錯誤堆棧:', error.stack);
        imageResult.innerHTML = `
            <div class="error-container">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p class="error">❌ 生成失敗: ${error.message || '未知錯誤'}</p>
                <div class="error-suggestions">
                    <p><strong>💡 解決建議:</strong></p>
                    <ul>
                        <li><strong>確認已登入:</strong> 檢查右上角是否顯示用戶名</li>
                        <li><strong>減少數量:</strong> 嘗試生成 1 張圖片</li>
                        <li><strong>切換模型:</strong> 使用 <strong>FLUX.2-flex</strong></li>
                        <li><strong>簡化提示詞:</strong> 移除特殊字符</li>
                        <li><strong>檢查網路:</strong> 確保網路連接正常</li>
                        <li><strong>查看控制台:</strong> 按 F12 查看詳細錯誤</li>
                    </ul>
                </div>
            </div>
        `;
        showNotification(`❌ 生成失敗: ${error.message}`, 'error');
    } finally {
        generateImgBtn.disabled = false;
    }
}

// 🔧 增強錯誤處理 - 單張圖片生成
async function generateSingleImage(fullPrompt, selectedModel, isPro, aspectRatio, index) {
    console.log(`\n🖼️ ===== 圖片 ${index} 開始生成 =====`);
    debugLog('完整提示詞', fullPrompt);
    debugLog('模型參數', { selectedModel, isPro, aspectRatio });
    
    const startTime = Date.now();
    
    return new Promise((resolve, reject) => {
        try {
            if (!puter || !puter.ai || typeof puter.ai.txt2img !== 'function') {
                reject(new Error('puter.ai.txt2img 方法不存在'));
                return;
            }
            
            // ✅ 根據官方文檔構建參數
            let options = {
                model: selectedModel,
                disable_safety_checker: true  // 官方必須參數
            };
            
            // ✅ 只有非 Pro 模型才添加 width/height
            if (!isPro) {
                const [width, height] = aspectRatio.split('x').map(Number);
                options.width = width;
                options.height = height;
                console.log(`🔄 FLUX.2 Flex/Dev 格式 (${width}x${height})`);
            } else {
                console.log('🏆 FLUX.2 Pro 格式 (無 width/height)');
            }
            
            debugLog('API 調用參數', options);
            console.log('⏳ 正在調用 puter.ai.txt2img...');
            
            // ✅ 使用官方推薦的 .then() 語法
            puter.ai.txt2img(fullPrompt, options)
                .then(imageElement => {
                    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                    console.log(`⏱️ API 調用完成 (耗時: ${elapsed}秒)`);
                    
                    debugLog('API 返回結果', imageElement);
                    debugLog('返回值類型', imageElement?.constructor?.name);
                    
                    // 🔥 完整記錄錯誤對象
                    if (!imageElement) {
                        console.error('❌ API 返回 null 或 undefined');
                        reject(new Error('API 返回 null'));
                        return;
                    }
                    
                    // ✅ 提取圖片 URL
                    let imageData = null;
                    
                    if (imageElement instanceof HTMLImageElement) {
                        imageData = imageElement.src;
                        console.log('✅ 返回 HTMLImageElement,成功提取 src');
                    } else if (typeof imageElement === 'string') {
                        imageData = imageElement;
                        console.log('✅ 返回字符串 URL');
                    } else if (imageElement.src) {
                        imageData = imageElement.src;
                        console.log('✅ 返回對象包含 src 屬性');
                    } else {
                        console.error('❌ 無法識別的返回格式:', imageElement);
                        console.error('完整對象:', JSON.stringify(imageElement, null, 2));
                        reject(new Error(`無法從返回值提取圖片數據,類型: ${imageElement?.constructor?.name}`));
                        return;
                    }
                    
                    if (!imageData || imageData === '') {
                        reject(new Error('圖片 src 為空'));
                        return;
                    }
                    
                    console.log(`✅ 圖片 ${index} 生成成功 (尺寸: ${aspectRatio}, 耗時: ${elapsed}秒)`);
                    debugLog('圖片 Data URL 前100字符', imageData.substring(0, 100));
                    
                    // 保存到記錄
                    imageHistory.addImage(imageData, fullPrompt, selectedModel, aspectRatio);
                    
                    // 創建用於顯示的 img 元素
                    const displayImage = document.createElement('img');
                    displayImage.src = imageData;
                    displayImage.alt = fullPrompt;
                    
                    resolve({ 
                        imageElement: displayImage,
                        imageData: imageData
                    });
                })
                .catch(error => {
                    console.error(`❌ 圖片 ${index} 生成失敗:`, error);
                    
                    // 🔥 深度解析錯誤對象
                    console.error('━━━━━━━━━ 錯誤詳情開始 ━━━━━━━━━');
                    console.error('錯誤類型:', error?.constructor?.name);
                    console.error('錯誤訊息:', error?.message);
                    console.error('錯誤堆棧:', error?.stack);
                    console.error('完整錯誤對象:', error);
                    
                    // 嘗試提取更多錯誤信息
                    if (error.error) {
                        console.error('error.error:', error.error);
                    }
                    if (error.response) {
                        console.error('error.response:', error.response);
                    }
                    if (error.status) {
                        console.error('error.status:', error.status);
                    }
                    if (error.statusText) {
                        console.error('error.statusText:', error.statusText);
                    }
                    
                    // 嘗試 JSON 序列化錯誤對象
                    try {
                        console.error('錯誤對象 JSON:', JSON.stringify(error, null, 2));
                    } catch (e) {
                        console.error('無法序列化錯誤對象');
                    }
                    
                    // 列出錯誤對象所有屬性
                    console.error('錯誤對象所有鍵:', Object.keys(error));
                    console.error('錯誤對象所有值:', Object.values(error));
                    console.error('━━━━━━━━━ 錯誤詳情結束 ━━━━━━━━━\n');
                    
                    let errorMessage = error.message || error.error || error.statusText || '未知錯誤';
                    
                    if (errorMessage.includes('not signed in') || errorMessage.includes('authentication')) {
                        errorMessage = '用戶未登入,請先登入';
                    } else if (errorMessage.includes('timeout')) {
                        errorMessage = '請求超時,請重試';
                    } else if (errorMessage.includes('network')) {
                        errorMessage = '網路錯誤,請檢查連接';
                    } else if (errorMessage === '未知錯誤') {
                        errorMessage = 'Puter API 錯誤 (請查看控制台完整日誌)';
                    }
                    
                    reject(new Error(errorMessage));
                });
                
        } catch (error) {
            console.error(`❌ 圖片 ${index} 同步錯誤:`, error);
            reject(error);
        }
    });
}

// OCR 功能
async function extractText() {
    if (!puterReady) {
        showNotification('⚠️ 正在初始化,請稍候...', 'error');
        return;
    }
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
        console.error('OCR 錯誤:', error);
        ocrResult.innerHTML = `<p class="error">❌ 提取失敗: ${error.message}</p>`;
    } finally {
        ocrBtn.disabled = false;
    }
}

function updateModelInfo() {
    const selectedModel = imageModelSelect.value;
    const description = modelDescriptions[selectedModel] || '選擇一個 FLUX.2 模型開始生成';
    modelInfo.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>${description}</span>
    `;
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

if (styleSelect) styleSelect.addEventListener('change', updateStylePreview);
if (aspectRatioSelect) aspectRatioSelect.addEventListener('change', updateAspectRatioPreview);
if (batchCountSelect) batchCountSelect.addEventListener('change', updateBatchCountPreview);
ocrBtn.addEventListener('click', extractText);

// 初始化
async function initialize() {
    console.log('🚀 ===== 應用初始化開始 =====');
    console.log('當前時間:', new Date().toLocaleString('zh-TW'));
    console.log('調試模式:', DEBUG_MODE ? '開啟' : '關閉');
    console.log('localStorage:', USE_LOCAL_STORAGE ? '可用' : '不可用 (使用內存)');
    
    await initPuter();
    
    if (chatMessages) {
        addMessage('👋 您好!我是 AI 助手,有什麼可以幫您的嗎?', 'ai');
    }
    updateModelInfo();
    if (styleSelect) updateStylePreview();
    if (aspectRatioSelect) updateAspectRatioPreview();
    if (batchCountSelect) updateBatchCountPreview();
    renderHistory();
    
    console.log('✅ ===== 應用初始化完成 =====\n');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
} else {
    initialize();
}
