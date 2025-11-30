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

const aspectBtns = document.querySelectorAll('.aspect-btn');
const customDimensions = document.getElementById('custom-dimensions');
const customWidth = document.getElementById('custom-width');
const customHeight = document.getElementById('custom-height');
const imgSteps = document.getElementById('img-steps');
const imgSeed = document.getElementById('img-seed');
const negativePrompt = document.getElementById('negative-prompt');

const imageUrl = document.getElementById('image-url');
const ocrBtn = document.getElementById('ocr-btn');
const ocrResult = document.getElementById('ocr-result');

// 當前選擇的尺寸
let currentWidth = 1024;
let currentHeight = 1024;

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
    });
});

// 比例選擇
aspectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        aspectBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (btn.dataset.custom === 'true') {
            customDimensions.style.display = 'block';
            currentWidth = parseInt(customWidth.value);
            currentHeight = parseInt(customHeight.value);
        } else {
            customDimensions.style.display = 'none';
            currentWidth = parseInt(btn.dataset.width);
            currentHeight = parseInt(btn.dataset.height);
        }
    });
});

// 自訂尺寸輸入
customWidth.addEventListener('input', () => {
    currentWidth = parseInt(customWidth.value);
});

customHeight.addEventListener('input', () => {
    currentHeight = parseInt(customHeight.value);
});

// 模型資訊
const modelDescriptions = {
    'black-forest-labs/FLUX.2-pro': '🏆 FLUX.2 Pro: 最新一代專業級模型,完美文字渲染與提示詞遵循',
    'black-forest-labs/FLUX.1.1-pro': '⚡ FLUX.1.1 Pro: 改進版專業模型,速度更快',
    'black-forest-labs/FLUX.1-pro': '📌 FLUX.1 Pro: 平衡品質與速度的專業級模型',
    'black-forest-labs/FLUX.1-schnell': '🚀 FLUX.1 Schnell: 快速生成模式,適合快速預覽',
    'black-forest-labs/FLUX.1-dev': '🔧 FLUX.1 Dev: 開發者版本,適合實驗與測試',
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

// FLUX 圖像生成功能 (官方完整參數)
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
                尺寸: ${currentWidth}×${currentHeight} • 約 15-30 秒
            </p>
        </div>
    `;
    
    try {
        // ✅ 根據官方文檔的完整參數支持
        const options = {
            model: selectedModel,
            width: currentWidth,
            height: currentHeight,
            steps: parseInt(imgSteps.value),
            negative_prompt: negativePrompt.value.trim() || undefined
        };
        
        // 添加種子 (如果設置)
        const seedValue = imgSeed.value.trim();
        if (seedValue) {
            options.seed = parseInt(seedValue);
        }
        
        console.log('生成參數:', { prompt, ...options });
        
        const imageElement = await puter.ai.txt2img(prompt, options);
        
        if (!imageElement || !imageElement.src) {
            throw new Error('圖像生成失敗:無效的回應');
        }
        
        const imageData = imageElement.src;
        
        // 顯示成功結果
        imageResult.innerHTML = `
            <div class="success-header">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <div>
                    <p class="success">✅ 圖像生成成功!</p>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">
                        模型: ${selectedModel} • 尺寸: ${currentWidth}×${currentHeight} • 步數: ${options.steps}
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
            <a href="${imageData}" download="flux-${modelName}-${currentWidth}x${currentHeight}.png" class="download-btn">
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
                        <li>嘗試使用 <strong>FLUX.1-schnell</strong> (最快)</li>
                        <li>減少圖像尺寸 (如 768×768)</li>
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
