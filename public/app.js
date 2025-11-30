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

const imageUrl = document.getElementById('image-url');
const ocrBtn = document.getElementById('ocr-btn');
const ocrResult = document.getElementById('ocr-result');

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

// 模型資訊
const modelDescriptions = {
    'gpt-image-1': '🖼️ GPT Image 1: Puter 預設高品質模型，平衡速度與品質',
    'dall-e-3': '🤖 DALL-E 3: OpenAI 的經典圖像生成模型',
    'black-forest-labs/FLUX.2-pro': '🏆 FLUX.2 Pro: 最新一代專業級模型 (可能不支持)',
    'black-forest-labs/FLUX.2-dev': '🔧 FLUX.2 Dev: 開發版本 (可能不支持)',
    'black-forest-labs/FLUX.1-pro': '📌 FLUX.1 Pro: 專業級模型 (可能不支持)',
    'black-forest-labs/FLUX.1-dev': '🛠️ FLUX.1 Dev: 開發者版本 (可能不支持)',
    'black-forest-labs/FLUX.1-schnell': '⚡ FLUX.1 Schnell: 快速生成 (可能不支持)'
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

// 圖像生成功能
async function generateImage() {
    const prompt = imagePrompt.value.trim();
    const selectedModel = imageModelSelect.value;
    
    if (!prompt) {
        imageResult.innerHTML = '<p class="error">⚠️ 請輸入圖像描述</p>';
        return;
    }
    
    generateImgBtn.disabled = true;
    imageResult.innerHTML = '<p class="loading">🎨 正在生成圖像，請稍候...</p>';
    
    try {
        const options = {
            model: selectedModel,
            quality: 'hd'
        };
        
        const imageElement = await puter.ai.txt2img(prompt, options);
        const imageData = imageElement.src;
        
        imageResult.innerHTML = '<p class="success">✅ 圖像生成成功!</p>';
        imageResult.appendChild(imageElement);
        imageElement.style.cssText = 'max-width: 100%; border-radius: 12px; margin-top: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);';
        
        const downloadDiv = document.createElement('div');
        downloadDiv.innerHTML = `
            <a href="${imageData}" download="ai-generated-${Date.now()}.png">
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
        console.error('Image generation error:', error);
        imageResult.innerHTML = `
            <p class="error">❌ 生成失敗: ${error.message || '未知錯誤'}</p>
            <p style="color: var(--text-secondary); margin-top: 1rem;">
                <strong>建議:</strong><br>
                • 嘗試使用 "gpt-image-1" 或 "dall-e-3" 模型<br>
                • 簡化提示詞內容<br>
                • 檢查網路連接
            </p>
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
addMessage('👋 您好！我是 AI 助手，有什麼可以幫您的嗎？', 'ai');
updateModelInfo();
