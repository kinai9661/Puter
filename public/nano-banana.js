// ===== 全局變量 =====
let currentModel = 'google/gemini-3-pro-image';
let uploadedImageData = null;
let generationHistory = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');

// 模型資訊對照表
const MODEL_INFO = {
    'google/gemini-3-pro-image': '🍌 Nano Banana Pro: 最高品質文字渲染，完美支持複雜排版和資訊圖',
    'gemini-2.5-flash-image-preview': '⚡ Nano Banana Flash: 快速生成，支持圖生圖功能，靈活高效',
    'gpt-image-1': '🎨 GPT Image-1: 通用型圖像生成模型，快速響應',
    'dall-e-3': '🖼️ DALL-E 3: OpenAI 經典模型，藝術風格突出',
    'dall-e-2': '🖼️ DALL-E 2: 穩定可靠的圖像生成選擇'
};

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initModelSelector();
    initTextToImage();
    initImageToImage();
    initCompare();
    initHistory();
    initTabs();
    initExamples();
    updateCharCount();
});

// ===== Tab 切換 =====
function initTabs() {
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.tab-panel');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${targetTab}-panel`).classList.add('active');
        });
    });
}

// ===== 快速示例 =====
function initExamples() {
    document.querySelectorAll('.example-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.dataset.prompt;
            document.getElementById('textPrompt').value = prompt;
            updateCharCount();
        });
    });
}

// ===== 模型選擇器 =====
function initModelSelector() {
    const modelSelect = document.getElementById('model-select');
    if (!modelSelect) return;

    currentModel = modelSelect.value;
    updateModelInfo(currentModel);

    modelSelect.addEventListener('change', (e) => {
        currentModel = e.target.value;
        updateModelInfo(currentModel);
        
        const isFlash = currentModel === 'gemini-2.5-flash-image-preview';
        const img2imgBtn = document.getElementById('img2imgBtn');
        
        if (img2imgBtn) {
            img2imgBtn.disabled = !isFlash || !uploadedImageData;
        }
        
        if (!isFlash && document.querySelector('.tab[data-tab="img2img"]').classList.contains('active')) {
            showStatus('img2imgStatus', '⚠️ 圖生圖功能僅支持 Nano Banana Flash 模型', 'warning');
        }
    });
}

function updateModelInfo(model) {
    const infoText = document.getElementById('model-info-text');
    if (infoText && MODEL_INFO[model]) {
        infoText.textContent = MODEL_INFO[model];
    }
}

// ===== 文生圖功能 =====
function initTextToImage() {
    const textPrompt = document.getElementById('textPrompt');
    textPrompt.addEventListener('input', updateCharCount);
    
    document.getElementById('generateBtn').addEventListener('click', async () => {
        const prompt = textPrompt.value.trim();
        
        if (!prompt) {
            showStatus('textStatus', '❌ 請輸入圖像描述！', 'error');
            return;
        }

        await generateImage(prompt, currentModel, 'textResults', 'textStatus');
    });
}

function updateCharCount() {
    const text = document.getElementById('textPrompt').value;
    document.getElementById('charCount').textContent = text.length;
}

// ===== 圖生圖功能 =====
function initImageToImage() {
    const fileInput = document.getElementById('imageFile');
    const uploadArea = document.getElementById('uploadArea');
    const previewDiv = document.getElementById('imagePreview');
    const placeholderDiv = document.getElementById('uploadPlaceholder');
    const img2imgBtn = document.getElementById('img2imgBtn');

    uploadArea.addEventListener('click', () => fileInput.click());
    
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border)';
        const file = e.dataTransfer.files[0];
        if (file) handleImageFile(file);
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });

    async function handleImageFile(file) {
        if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/)) {
            showStatus('img2imgStatus', '❌ 僅支持 PNG、JPEG、JPG、WebP 格式', 'error');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = (event) => {
                placeholderDiv.style.display = 'none';
                previewDiv.innerHTML = `
                    <img src="${event.target.result}" alt="預覽">
                    <p class="file-info">${file.name} (${(file.size / 1024).toFixed(2)} KB)</p>
                `;
                previewDiv.classList.add('show');
            };
            reader.readAsDataURL(file);

            uploadedImageData = {
                base64: await fileToBase64(file),
                mimeType: file.type
            };

            const isFlash = currentModel === 'gemini-2.5-flash-image-preview';
            img2imgBtn.disabled = !isFlash;

            if (isFlash) {
                showStatus('img2imgStatus', '✅ 圖片已上傳，可以開始轉換', 'success');
            } else {
                showStatus('img2imgStatus', '⚠️ 請選擇 Nano Banana Flash 模型', 'warning');
            }

        } catch (error) {
            showStatus('img2imgStatus', `❌ 圖片處理失敗：${error.message}`, 'error');
        }
    }

    document.getElementById('img2imgBtn').addEventListener('click', async () => {
        const prompt = document.getElementById('img2imgPrompt').value.trim();

        if (!prompt) {
            showStatus('img2imgStatus', '❌ 請輸入轉換描述！', 'error');
            return;
        }

        if (!uploadedImageData) {
            showStatus('img2imgStatus', '❌ 請先上傳圖片！', 'error');
            return;
        }

        await generateImageToImage(prompt, uploadedImageData, 'img2imgResults', 'img2imgStatus');
    });
}

// ===== 模型對比 =====
function initCompare() {
    document.getElementById('compareBtn').addEventListener('click', async () => {
        const prompt = document.getElementById('comparePrompt').value.trim();
        
        if (!prompt) {
            showStatus('compareStatus', '❌ 請輸入提示詞！', 'error');
            return;
        }

        const models = [
            'google/gemini-3-pro-image',
            'gemini-2.5-flash-image-preview',
            'gpt-image-1'
        ];

        showStatus('compareStatus', '🔄 對比生成中...', 'loading');
        document.getElementById('compareResults').innerHTML = '';

        for (const model of models) {
            await generateImage(prompt, model, 'compareResults', 'compareStatus', true);
        }

        showStatus('compareStatus', '✅ 對比完成！', 'success');
    });
}

// ===== 核心生成函數 =====
async function generateImage(prompt, model, resultsId, statusId, isComparison = false) {
    const resultsDiv = document.getElementById(resultsId);

    if (!isComparison) {
        showStatus(statusId, '🎨 生成中...', 'loading');
        resultsDiv.innerHTML = '';
    }

    try {
        const options = { model };
        
        if (model === 'google/gemini-3-pro-image') {
            options.provider = 'together-ai';
        }
        
        options.disable_safety_checker = true;

        console.log('開始生成圖片...', { prompt, model, options });
        const imageElement = await puter.ai.txt2img(prompt, options);
        
        displayResult(imageElement, prompt, model, resultsDiv, isComparison);
        saveToHistory(imageElement.src, prompt, model, 'text2img');

        if (!isComparison) {
            showStatus(statusId, '✅ 生成成功！', 'success');
        }

    } catch (error) {
        console.error('生成失敗:', error);
        handleGenerationError(error, statusId, resultsDiv, isComparison);
    }
}

async function generateImageToImage(prompt, imageData, resultsId, statusId) {
    showStatus(statusId, '🖌️ 轉換中...', 'loading');
    document.getElementById(resultsId).innerHTML = '';

    try {
        const imageElement = await puter.ai.txt2img(prompt, {
            model: 'gemini-2.5-flash-image-preview',
            input_image: imageData.base64,
            input_image_mime_type: imageData.mimeType,
            disable_safety_checker: true
        });

        displayResult(imageElement, prompt, 'gemini-2.5-flash-image-preview (Image-to-Image)', 
                     document.getElementById(resultsId), false);
        
        saveToHistory(imageElement.src, prompt, 'gemini-2.5-flash-image-preview', 'img2img');
        showStatus(statusId, '✅ 轉換成功！', 'success');

    } catch (error) {
        console.error('轉換失敗:', error);
        handleGenerationError(error, statusId, document.getElementById(resultsId), false);
    }
}

// ===== 錯誤處理 =====
function handleGenerationError(error, statusId, resultsDiv, isComparison) {
    let errorMessage = '';
    let errorDetail = '';
    
    // 檢查是否為額度不足錯誤
    if (error.error && error.error.code === 'insufficient_funds') {
        errorMessage = '💰 Puter 免費額度已用完';
        errorDetail = `
            <div class="error-detail">
                <p><strong>😔 抱歉，Puter.js 的免費額度暫時不足</strong></p>
                <p>這個應用依賴 Puter.js 提供的免費 AI 服務額度。</p>
                <br>
                <p><strong>💡 建議解決方案：</strong></p>
                <ul>
                    <li>🔄 稍後再試（額度可能會重置）</li>
                    <li>⚡ 使用 <a href="/" style="color: var(--primary); font-weight: 600;">FLUX.2 圖像生成頁面</a>（不同的額度池）</li>
                    <li>🔑 前往 <a href="https://puter.com" target="_blank" style="color: var(--primary); font-weight: 600;">Puter.com</a> 註冊賬號獲取更多額度</li>
                </ul>
                <br>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">錯誤代碼: ${error.error.code}</p>
            </div>
        `;
    } else {
        errorMessage = `❌ 生成失敗：${error.message || error.error?.message || '未知錯誤'}`;
        errorDetail = `
            <div class="error-detail">
                <p><strong>發生錯誤</strong></p>
                <p>${error.error?.message || error.message || '請稍後重試'}</p>
                ${error.error?.code ? `<p style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem;">錯誤代碼: ${error.error.code}</p>` : ''}
            </div>
        `;
    }
    
    showStatus(statusId, errorMessage, 'error');
    
    if (!isComparison) {
        resultsDiv.innerHTML = errorDetail;
    }
}

// ===== 顯示結果 =====
function displayResult(imageElement, prompt, model, container, isComparison) {
    const resultCard = document.createElement('div');
    resultCard.className = isComparison ? 'result-card' : 'result-card-single';
    
    const modelName = getModelDisplayName(model);
    const imageId = Date.now() + Math.random();
    
    resultCard.innerHTML = `
        <div class="result-header">
            <h3>${modelName}</h3>
            <div class="result-actions">
                <button class="icon-btn" onclick="downloadImage('${imageId}')" title="下載">
                    💾
                </button>
            </div>
        </div>
        <div class="result-image" id="img-${imageId}">
        </div>
        <p class="result-prompt">${escapeHtml(prompt)}</p>
    `;

    if (isComparison) {
        container.appendChild(resultCard);
    } else {
        container.innerHTML = '';
        container.appendChild(resultCard);
    }
    
    document.getElementById(`img-${imageId}`).appendChild(imageElement);
}

// ===== 工具函數 =====
async function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function getModelDisplayName(model) {
    const names = {
        'google/gemini-3-pro-image': '🍌 Nano Banana Pro',
        'gemini-2.5-flash-image-preview': '⚡ Nano Banana Flash',
        'gpt-image-1': '🎨 GPT Image',
        'dall-e-3': '🖼️ DALL-E 3',
        'dall-e-2': '🖼️ DALL-E 2'
    };
    return names[model] || model;
}

function showStatus(elementId, message, type) {
    const statusDiv = document.getElementById(elementId);
    if (!statusDiv) return;
    statusDiv.textContent = message;
    statusDiv.className = `status-bar show status-${type}`;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== 全局函數 =====
window.downloadImage = function(imageId) {
    const imgElement = document.querySelector(`#img-${imageId} img`);
    if (imgElement) {
        const link = document.createElement('a');
        link.href = imgElement.src;
        link.download = `nano-banana-${Date.now()}.png`;
        link.click();
    }
};

// ===== 歷史記錄 =====
function saveToHistory(imageSrc, prompt, model, type) {
    generationHistory.unshift({
        id: Date.now(),
        imageSrc,
        prompt,
        model,
        type,
        timestamp: new Date().toISOString()
    });

    if (generationHistory.length > 50) {
        generationHistory = generationHistory.slice(0, 50);
    }

    localStorage.setItem('nanoBananaHistory', JSON.stringify(generationHistory));
    renderHistory();
}

function initHistory() {
    renderHistory();
    
    document.getElementById('historyFab').addEventListener('click', () => {
        document.getElementById('historyDrawer').classList.add('open');
        document.getElementById('overlay').classList.add('show');
    });
    
    document.getElementById('closeHistoryBtn').addEventListener('click', closeHistory);
    document.getElementById('overlay').addEventListener('click', closeHistory);
    
    document.getElementById('clearHistoryBtn').addEventListener('click', () => {
        if (confirm('確定要清空所有歷史記錄嗎？')) {
            generationHistory = [];
            localStorage.removeItem('nanoBananaHistory');
            renderHistory();
        }
    });
}

function closeHistory() {
    document.getElementById('historyDrawer').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');
}

function renderHistory() {
    const historyGrid = document.getElementById('historyGrid');
    const historyCount = document.getElementById('historyCount');
    
    historyCount.textContent = generationHistory.length;
    
    if (generationHistory.length === 0) {
        historyGrid.innerHTML = '<p class="empty-msg">暫無生成記錄</p>';
        return;
    }

    historyGrid.innerHTML = generationHistory.map(item => `
        <div class="history-card">
            <img src="${item.imageSrc}" alt="${escapeHtml(item.prompt)}">
            <div class="history-info">
                <span class="model-badge">${getModelDisplayName(item.model)}</span>
                <p class="history-prompt">${escapeHtml(item.prompt)}</p>
                <small>${new Date(item.timestamp).toLocaleString('zh-TW')}</small>
            </div>
        </div>
    `).join('');
}