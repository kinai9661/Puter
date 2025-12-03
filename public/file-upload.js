// ========================================
//   文件上傳管理器
// ========================================

class FileUploadManager {
    constructor(chatManager) {
        this.chatManager = chatManager;
        this.uploadedFiles = [];
        this.MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        this.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        this.ALLOWED_DOC_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        this.initElements();
        this.bindEvents();
    }
    
    initElements() {
        this.elements = {
            fileInput: document.getElementById('file-input'),
            uploadBtn: document.getElementById('upload-btn'),
            filePreviewContainer: document.getElementById('file-preview-container'),
            chatInput: document.getElementById('chat-input'),
            chatMessages: document.getElementById('chat-messages')
        };
    }
    
    bindEvents() {
        // 上傳按鈕點擊
        this.elements.uploadBtn?.addEventListener('click', () => {
            this.elements.fileInput?.click();
        });
        
        // 文件選擇
        this.elements.fileInput?.addEventListener('change', (e) => {
            this.handleFileSelect(e);
        });
        
        // 拖拽上傳
        const dropZone = this.elements.chatMessages;
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
            
            dropZone.addEventListener('dragleave', () => {
                dropZone.classList.remove('drag-over');
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                this.handleFileDrop(e);
            });
        }
    }
    
    // ========================================
    // 文件處理
    // ========================================
    handleFileSelect(event) {
        const files = Array.from(event.target.files);
        this.processFiles(files);
        // 清空 input
        event.target.value = '';
    }
    
    handleFileDrop(event) {
        const files = Array.from(event.dataTransfer.files);
        this.processFiles(files);
    }
    
    async processFiles(files) {
        for (const file of files) {
            // 驗證文件
            if (!this.validateFile(file)) {
                continue;
            }
            
            try {
                const fileData = await this.readFile(file);
                this.uploadedFiles.push(fileData);
                this.renderFilePreview(fileData);
            } catch (error) {
                console.error('讀取文件失敗:', error);
                this.showError(`讀取文件失敗: ${file.name}`);
            }
        }
        
        // 顯示預覽區
        if (this.uploadedFiles.length > 0) {
            this.elements.filePreviewContainer.style.display = 'flex';
        }
    }
    
    validateFile(file) {
        // 檢查文件大小
        if (file.size > this.MAX_FILE_SIZE) {
            this.showError(`文件 ${file.name} 超過 10MB 限制`);
            return false;
        }
        
        // 檢查文件類型
        const allowedTypes = [...this.ALLOWED_IMAGE_TYPES, ...this.ALLOWED_DOC_TYPES];
        if (!allowedTypes.includes(file.type)) {
            this.showError(`不支持的文件類型: ${file.type}`);
            return false;
        }
        
        return true;
    }
    
    readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const fileData = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    data: e.target.result, // Base64 data URL
                    isImage: this.ALLOWED_IMAGE_TYPES.includes(file.type)
                };
                resolve(fileData);
            };
            
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }
    
    // ========================================
    // 預覽渲染
    // ========================================
    renderFilePreview(fileData) {
        const previewItem = document.createElement('div');
        previewItem.className = 'file-preview-item';
        previewItem.dataset.fileId = fileData.id;
        
        if (fileData.isImage) {
            // 圖片預覽
            previewItem.innerHTML = `
                <img src="${fileData.data}" alt="${fileData.name}">
                <div class="file-preview-name">${this.truncateFileName(fileData.name)}</div>
                <button class="file-remove-btn" data-file-id="${fileData.id}">×</button>
            `;
        } else {
            // 文檔預覽
            const icon = this.getFileIcon(fileData.type);
            previewItem.innerHTML = `
                <div class="file-preview-icon">${icon}</div>
                <div class="file-preview-name">${this.truncateFileName(fileData.name)}</div>
                <button class="file-remove-btn" data-file-id="${fileData.id}">×</button>
            `;
        }
        
        // 綁定刪除事件
        const removeBtn = previewItem.querySelector('.file-remove-btn');
        removeBtn.addEventListener('click', () => {
            this.removeFile(fileData.id);
        });
        
        this.elements.filePreviewContainer.appendChild(previewItem);
    }
    
    removeFile(fileId) {
        // 從陣列中刪除
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== fileId);
        
        // 刪除 DOM 元素
        const previewItem = this.elements.filePreviewContainer.querySelector(`[data-file-id="${fileId}"]`);
        if (previewItem) {
            previewItem.remove();
        }
        
        // 如果沒有文件了，隱藏預覽區
        if (this.uploadedFiles.length === 0) {
            this.elements.filePreviewContainer.style.display = 'none';
        }
    }
    
    clearAllFiles() {
        this.uploadedFiles = [];
        this.elements.filePreviewContainer.innerHTML = '';
        this.elements.filePreviewContainer.style.display = 'none';
    }
    
    // ========================================
    // AI 分析功能
    // ========================================
    async sendWithFiles(message) {
        if (this.uploadedFiles.length === 0) {
            // 沒有文件，直接發送消息
            return null;
        }
        
        try {
            // 準備文件數據
            const filesData = this.uploadedFiles.map(file => ({
                name: file.name,
                type: file.type,
                data: file.data
            }));
            
            // 添加文件信息到消息
            let enhancedMessage = message;
            if (this.uploadedFiles.some(f => f.isImage)) {
                enhancedMessage += '\n\n[🖼️ 已上傳 ' + this.uploadedFiles.filter(f => f.isImage).length + ' 張圖片]';
            }
            if (this.uploadedFiles.some(f => !f.isImage)) {
                enhancedMessage += '\n[📄 已上傳 ' + this.uploadedFiles.filter(f => !f.isImage).length + ' 個文檔]';
            }
            
            // 調用 AI API (帶圖片/文件)
            const model = document.getElementById('model-select')?.value || 'gpt-5.1-chat';
            
            // 如果是圖片，使用 vision 功能
            if (this.uploadedFiles.some(f => f.isImage)) {
                const imageFile = this.uploadedFiles.find(f => f.isImage);
                
                // 使用 Puter AI vision 功能
                const response = await puter.ai.chat(message, {
                    model: model,
                    vision: {
                        image: imageFile.data
                    }
                });
                
                return {
                    userMessage: enhancedMessage,
                    aiResponse: response,
                    files: filesData
                };
            }
            
            // 如果是文檔，提取文字內容
            // （簡化版，只處理文本文件）
            return {
                userMessage: enhancedMessage,
                aiResponse: null,
                files: filesData
            };
            
        } catch (error) {
            console.error('文件分析失敗:', error);
            throw error;
        }
    }
    
    // ========================================
    // 工具函數
    // ========================================
    truncateFileName(name, maxLength = 15) {
        if (name.length <= maxLength) return name;
        const ext = name.split('.').pop();
        const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
        return nameWithoutExt.substring(0, maxLength - ext.length - 3) + '...' + ext;
    }
    
    getFileIcon(type) {
        if (type.includes('pdf')) return '📝';
        if (type.includes('word') || type.includes('document')) return '📄';
        if (type.includes('text')) return '📃';
        return '📁';
    }
    
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }
    
    showError(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--error);
            color: white;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = '❌ ' + message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    showSuccess(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--success);
            color: white;
            border-radius: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = '✅ ' + message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// ========================================
// 整合到 ChatManager
// ========================================

// 等待 ChatManager 初始化完成
function initFileUpload() {
    if (typeof chatManager === 'undefined') {
        setTimeout(initFileUpload, 100);
        return;
    }
    
    // 初始化文件上傳管理器
    const fileUploadManager = new FileUploadManager(chatManager);
    
    // 重寫 ChatManager 的 sendMessage 方法
    const originalSendMessage = chatManager.sendMessage.bind(chatManager);
    
    chatManager.sendMessage = async function() {
        const input = this.elements.chatInput;
        if (!input) return;
        
        const message = input.value.trim();
        if (!message && fileUploadManager.uploadedFiles.length === 0) return;
        
        const conversation = this.getCurrentConversation();
        if (!conversation) return;
        
        // 禁用輸入
        input.disabled = true;
        this.elements.sendBtn.disabled = true;
        
        try {
            // 如果有文件，使用文件上傳功能
            if (fileUploadManager.uploadedFiles.length > 0) {
                const result = await fileUploadManager.sendWithFiles(message || '請分析這個文件');
                
                if (result) {
                    // 添加用戶消息
                    this.addMessage('user', result.userMessage);
                    this.renderMessages(conversation.messages);
                    
                    // 清空輸入
                    input.value = '';
                    this.adjustTextareaHeight(input);
                    
                    // 清空文件
                    fileUploadManager.clearAllFiles();
                    
                    // 顯示打字動畫
                    this.showTypingIndicator();
                    
                    if (result.aiResponse) {
                        this.hideTypingIndicator();
                        this.addMessage('assistant', result.aiResponse);
                        this.renderMessages(conversation.messages);
                    } else {
                        // 如果沒有 AI 回答，使用原始方法
                        const model = this.elements.modelSelect?.value || this.DEFAULT_MODEL;
                        const response = await puter.ai.chat(message, { model: model });
                        this.hideTypingIndicator();
                        this.addMessage('assistant', response);
                        this.renderMessages(conversation.messages);
                    }
                }
            } else {
                // 沒有文件，使用原始方法
                await originalSendMessage();
            }
        } catch (error) {
            console.error('❌ 發送失敗:', error);
            this.hideTypingIndicator();
            this.addMessage('assistant', `抱歉，發送失敗：${error.message}`);
            this.renderMessages(conversation.messages);
            fileUploadManager.clearAllFiles();
        } finally {
            // 恢復輸入
            input.disabled = false;
            this.elements.sendBtn.disabled = false;
            input.focus();
        }
    };
    
    console.log('✅ 文件上傳功能已初始化');
}

// 初始化
initFileUpload();