// ===== 全局變量 =====
let currentModel = 'google/gemini-3-pro-image';
let uploadedImageData = null;
let generationHistory = JSON.parse(localStorage.getItem('nanoBananaHistory') || '[]');

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
    initModelSelector();
    initTextToImage();
    initImageToImage();
    initCompare();
    initHistory();
    initTabs();
    initExamples();
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
    document.querySelectorAll('input[name="model"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            currentModel = e.target.value;
            
            const isFlash = currentModel === 'gemini-2.5-flash-image-preview';
            const img2imgBtn = document.getElementById('img2imgBtn');
            img2imgBtn.disabled = !isFlash || !uploadedImageData;
            
            if (!isFlash && document.querySelector('.tab[data-tab="img2img"]').classList.contains('active')) {
                showStatus('img2imgStatus', '⚠️ 圖生圖功能僅支持 Nano Banana Flash 模型', 'warning');
            }
        });
    });
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
    
    document.getElementById('randomBtn').addEventListener('click', () => {
        const prompts = [
            "A vintage movie poster for 'The Last Voyage', featuring bold art deco typography",
            "A serene Japanese garden with cherry blossoms in full bloom, koi pond, stone lanterns",
            "A cyberpunk street scene with neon lights, flying cars, rain-soaked streets",
            "A majestic dragon perched on a mountain peak at sunset",
            "An underwater city with bioluminescent creatures and ancient ruins"
        ];
        textPrompt.value = prompts[Math.floor(Math.random() * prompts.length)];
        updateCharCount();
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
        uploadArea.style.borderColor = 'var(--primary-color)';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
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
    }

    try {
        const options = { model };
        
        if (model === 'google/gemini-3-pro-image') {
            options.provider = 'together-ai';
        }
        
        options.disable_safety_checker = true;

        const imageElement = await puter.ai.txt2img(prompt, options);
        
        displayResult(imageElement, prompt, model, resultsDiv, isComparison);
        saveToHistory(imageElement.src, prompt, model, 'text2img');

        if (!isComparison) {
            showStatus(statusId, '✅ 生成成功！', 'success');
        }

    } catch (error) {
        console.error('生成失敗:', error);
        showStatus(statusId, `❌ 生成失敗：${error.message}`, 'error');
    }
}

async function generateImageToImage(prompt, imageData, resultsId, statusId) {
    showStatus(statusId, '🖌️ 轉換中...', 'loading');

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
        showStatus(statusId, `❌ 轉換失敗：${error.message}`, 'error');
    }
}

// ===== 顯示結果 =====
function displayResult(imageElement, prompt, model, container, isComparison) {
    const resultCard = document.createElement('div');
    resultCard.className = 'result-card';
    
    const modelName = getModelDisplayName(model);
    const imageId = Date.now();
    
    resultCard.innerHTML = `
        <div class="result-header">
            <h3>${modelName}</h3>
            <div class="result-actions">
                <button class="icon-btn" onclick="downloadImage('${imageId}')" title="下載">
                    💾
                </button>
                <button class="icon-btn" onclick="copyPrompt('${escapeHtml(prompt)}')" title="複製提示詞">
                    📋
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
        container.insertBefore(resultCard, container.firstChild);
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
        link.download = `nano-banana-${imageId}.png`;
        link.click();
    }
};

window.copyPrompt = function(prompt) {
    const textarea = document.createElement('textarea');
    textarea.value = prompt;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    alert('✅ 提示詞已複製！');
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