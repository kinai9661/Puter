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
const refreshModelsBtn = document.getElementById('refresh-models-btn');

const imgWidth = document.getElementById('img-width');
const imgHeight = document.getElementById('img-height');
const imgSteps = document.getElementById('img-steps');
const imgGuidance = document.getElementById('img-guidance');

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

// 動態載入可用模型
let availableModels = [];

async function loadAvailableModels() {
    try {
        modelInfo.innerHTML = '<span>正在載入可用模型...</span>';
        
        // 嘗試獲取所有可用模型
        const models = await puter.ai.listModels();
        
        // 過濾圖像生成模型
        availableModels = models.filter(m => 
            m.id.includes('flux') || 
            m.id.includes('FLUX') || 
            m.id.includes('dall-e') || 
            m.id.includes('gpt-image') ||
            m.id.includes('stable-diffusion')
        );
        
        // 更新下拉選單
        imageModelSelect.innerHTML = '';
        
        // 推薦模型組
        const recommendedGroup = document.createElement('optgroup');
        recommendedGroup.label = '🏆 推薦模型';
        
        const recommended = [
            { id: 'gpt-image-1', name: 'GPT Image 1 (推薦)' },
            { id: 'dall-e-3', name: 'DALL-E 3' }
        ];
        
        recommended.forEach(model => {
            const option = new Option(model.name, model.id);
            recommendedGroup.appendChild(option);
        });
        imageModelSelect.appendChild(recommendedGroup);
        
        // FLUX Pro 模型組
        const fluxProModels = availableModels.filter(m => 
            m.id.includes('FLUX') && (m.id.includes('pro') || m.id.includes('Pro'))
        );
        
        if (fluxProModels.length > 0) {
            const fluxProGroup = document.createElement('optgroup');
            fluxProGroup.label = '⚡ FLUX Pro 系列';
            fluxProModels.forEach(model => {
                const option = new Option(
                    model.id.replace('black-forest-labs/', '') + ' (Pro)',
                    model.id
                );
                fluxProGroup.appendChild(option);
            });
            imageModelSelect.appendChild(fluxProGroup);
        }
        
        // FLUX Dev 模型組
        const fluxDevModels = availableModels.filter(m => 
            m.id.includes('FLUX') && m.id.includes('dev') && !m.id.includes('pro')
        );
        
        if (fluxDevModels.length > 0) {
            const fluxDevGroup = document.createElement('optgroup');
            fluxDevGroup.label = '🔧 FLUX Dev 系列';
            fluxDevModels.forEach(model => {
                const option = new Option(
                    model.id.replace('black-forest-labs/', ''),
                    model.id
                );
                fluxDevGroup.appendChild(option);
            });
            imageModelSelect.appendChild(fluxDevGroup);
        }
        
        // FLUX Schnell 快速模型
        const fluxSchnellModels = availableModels.filter(m => 
            m.id.includes('schnell') || m.id.includes('Schnell')
        );
        
        if (fluxSchnellModels.length > 0) {
            const fluxSchnellGroup = document.createElement('optgroup');
            fluxSchnellGroup.label = '⚡ FLUX Schnell (快速)';
            fluxSchnellModels.forEach(model => {
                const option = new Option(
                    model.id.replace('black-forest-labs/', ''),
                    model.id
                );
                fluxSchnellGroup.appendChild(option);
            });
            imageModelSelect.appendChild(fluxSchnellGroup);
        }
        
        // 設置預設值
        imageModelSelect.value = 'gpt-image-1';
        updateModelInfo();
        
    } catch (error) {
        console.error('載入模型失敗:', error);
        imageModelSelect.innerHTML = `
            <option value="gpt-image-1">GPT Image 1 (預設)</option>
            <option value="dall-e-3">DALL-E 3</option>
        `;
        modelInfo.innerHTML = '<span style="color: var(--warning);">⚠️ 無法載入完整模型列表,使用預設模型</span>';
    }
}

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

// 圖像生成功能 (支持 FLUX Pro 完整參數)
async function generateImage() {
    const prompt = imagePrompt.value.trim();
    const selectedModel = imageModelSelect.value;
    
    if (!prompt) {
        imageResult.innerHTML = '<p class="error">⚠️ 請輸入圖像描述</p>';
        return;
    }
    
    if (!selectedModel) {
        imageResult.innerHTML = '<p class="error">⚠️ 請選擇模型</p>';
        return;
    }
    
    generateImgBtn.disabled = true;
    const modelName = selectedModel.split('/').pop();
    imageResult.innerHTML = `<p class="loading">🎨 正在使用 ${modelName} 生成圖像,請稍候...</p>`;
    
    try {
        // 完整參數支持 (FLUX Pro 需要)
        const options = {
            model: selectedModel,
            width: parseInt(imgWidth.value),
            height: parseInt(imgHeight.value),
            steps: parseInt(imgSteps.value),
            guidance_scale: parseFloat(imgGuidance.value),
            seed: Math.floor(Math.random() * 1000000)
        };
        
        console.log('生成參數:', options);
        
        // 調用 Puter.js API
        const imageElement = await puter.ai.txt2img(prompt, options);
        const imageData = imageElement.src;
        
        // 顯示成功結果
        imageResult.innerHTML = `
            <p class="success">✅ 圖像生成成功!</p>
            <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.5rem;">
                <strong>模型:</strong> ${selectedModel}<br>
                <strong>尺寸:</strong> ${options.width}x${options.height}<br>
                <strong>步數:</strong> ${options.steps}
            </p>
        `;
        
        imageResult.appendChild(imageElement);
        imageElement.style.cssText = 'max-width: 100%; border-radius: 12px; margin-top: 1rem; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);';
        
        // 下載按鈕
        const downloadDiv = document.createElement('div');
        downloadDiv.style.marginTop = '1rem';
        downloadDiv.innerHTML = `
            <a href="${imageData}" download="flux-${modelName}-${Date.now()}.png" style="
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.5rem;
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                box-shadow: var(--shadow);
            ">
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
            <p class="error">❌ 生成失敗: ${error.message || '未知錯誤'}</p>
            <p style="color: var(--text-secondary); margin-top: 1rem;">
                <strong>建議:</strong><br>
                • 嘗試使用 "gpt-image-1" 或 "dall-e-3" 模型<br>
                • 簡化提示詞內容<br>
                • 調整圖像尺寸 (建議 1024x1024)<br>
                • 檢查網路連接<br>
                • 某些 FLUX Pro 模型可能需要特殊權限
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
    
    const descriptions = {
        'gpt-image-1': '🖼️ GPT Image 1: Puter 預設高品質模型,平衡速度與品質',
        'dall-e-3': '🤖 DALL-E 3: OpenAI 的經典圖像生成模型',
    };
    
    let description = descriptions[selectedModel];
    
    if (!description) {
        if (selectedModel.includes('FLUX') && selectedModel.includes('pro')) {
            description = '🏆 FLUX Pro: 專業級模型,支援完整參數與最高品質';
        } else if (selectedModel.includes('FLUX') && selectedModel.includes('dev')) {
            description = '🔧 FLUX Dev: 開發者版本,適合實驗與測試';
        } else if (selectedModel.includes('schnell')) {
            description = '⚡ FLUX Schnell: 快速生成模式,適合快速預覽';
        } else {
            description = '選擇一個模型開始生成';
        }
    }
    
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
refreshModelsBtn.addEventListener('click', loadAvailableModels);
imagePrompt.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
    }
});

ocrBtn.addEventListener('click', extractText);

// 初始化
addMessage('👋 您好!我是 AI 助手,有什麼可以幫您的嗎?', 'ai');
loadAvailableModels();
