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

const imgWidth = document.getElementById('img-width');
const imgHeight = document.getElementById('img-height');
const imgSteps = document.getElementById('img-steps');
const imgGuidance = document.getElementById('img-guidance');

const imageUrl = document.getElementById('image-url');
const ocrBtn = document.getElementById('ocr-btn');
const ocrResult = document.getElementById('ocr-result');

// 模型資訊
const modelDescriptions = {
    'black-forest-labs/FLUX.2-pro': '🏆 FLUX.2 Pro: 最新一代專業級模型,提供最高品質的圖像生成',
    'black-forest-labs/FLUX.2-dev': '🔧 FLUX.2 Dev: 開發版本,適合實驗和測試新功能',
    'black-forest-labs/FLUX.2-flex': '🔄 FLUX.2 Flex: 彈性模型,可適應多種生成需求',
    'black-forest-labs/FLUX.1.1-pro': '⚡ FLUX.1.1 Pro: 改進版專業模型,速度更快',
    'black-forest-labs/FLUX.1-pro': '📌 FLUX.1 Pro: 平衡品質與速度的專業級模型',
    'black-forest-labs/FLUX.1-Canny-pro': '🎨 FLUX.1 Canny Pro: 專門用於邊緣檢測和線稿轉換',
    'black-forest-labs/FLUX.1-dev': '🛠️ FLUX.1 Dev: 開發者友好版本,支持更多自訂參數',
    'black-forest-labs/FLUX.1-dev-lora': '🎯 FLUX.1 Dev LoRA: 支持 LoRA 微調的開發版',
    'black-forest-labs/FLUX.1-kontext-max': '🚀 FLUX.1 Kontext Max: 最大上下文理解能力',
    'black-forest-labs/FLUX.1-kontext-pro': '💼 FLUX.1 Kontext Pro: 專業級上下文理解',
    'black-forest-labs/FLUX.1-kontext-dev': '🔍 FLUX.1 Kontext Dev: 開發級上下文理解',
    'black-forest-labs/FLUX.1-schnell': '⚡ FLUX.1 Schnell: 快速生成模式,適合快速預覽',
    'black-forest-labs/FLUX.1-schnell-Free': '🆓 FLUX.1 Schnell Free: 免費快速生成版本',
    'black-forest-labs/FLUX.1-krea-dev': '🎨 FLUX.1 Krea Dev: 創意導向的開發版本',
    'dall-e-3': '🤖 DALL-E 3: OpenAI 的經典圖像生成模型'
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
    const model = imageModelSelect.value;
    
    if (!prompt) {
        imageResult.innerHTML = '<p class="error">⚠️ 請輸入圖像描述</p>';
        return;
    }
    
    generateImgBtn.disabled = true;
    imageResult.innerHTML = '<p class="loading">🎨 正在使用 ' + model.split('/')[1] + ' 生成圖像...</p>';
    
    try {
        const options = {
            model: model,
            width: parseInt(imgWidth.value),
            height: parseInt(imgHeight.value),
            steps: parseInt(imgSteps.value),
            guidance_scale: parseFloat(imgGuidance.value)
        };
        
        let imageData;
        if (model === 'dall-e-3') {
            imageData = await puter.ai.txt2img(prompt);
        } else {
            imageData = await puter.ai.txt2img(prompt, options);
        }
        
        imageResult.innerHTML = `
            <p class="success">✅ 圖像生成成功!</p>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
                <strong>模型:</strong> ${model}<br>
                <strong>尺寸:</strong> ${options.width}x${options.height}<br>
                <strong>提示詞:</strong> ${prompt}
            </p>
            <img src="${imageData}" alt="Generated Image" />
            <div style="margin-top: 15px;">
                <a href="${imageData}" download="flux-generated.png" style="
                    display: inline-block;
                    padding: 10px 20px;
                    background: #667eea;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 14px;
                ">💾 下載圖像</a>
            </div>
        `;
    } catch (error) {
        imageResult.innerHTML = `
            <p class="error">❌ 生成失敗: ${error.message}</p>
            <p style="color: #666; font-size: 14px; margin-top: 10px;">
                請嘗試:<br>
                • 更換其他 FLUX 模型<br>
                • 調整圖像尺寸<br>
                • 簡化提示詞描述
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
    ocrResult.innerHTML = '<p class="loading">📝 提取文字中...</p>';
    
    try {
        const text = await puter.ai.img2txt(url);
        ocrResult.innerHTML = `
            <p class="success">✅ 文字提取成功!</p>
            <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 5px; border: 1px solid #e0e0e0;">
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
    modelInfo.innerHTML = `<p>${description}</p>`;
}

// 事件監聽器
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

imageModelSelect.addEventListener('change', updateModelInfo);
generateImgBtn.addEventListener('click', generateImage);
imagePrompt.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') generateImage();
});

ocrBtn.addEventListener('click', extractText);

// 初始化
addMessage('👋 您好!我是 AI 助手,有什麼可以幫您的嗎?', 'ai');
updateModelInfo();
