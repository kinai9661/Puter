// ========================================
//   AI 聊天管理器 - 完整功能實現
// ========================================

class ChatManager {
    constructor() {
        this.conversations = [];
        this.currentConversationId = null;
        this.STORAGE_KEY = 'puter_ai_conversations';
        this.MAX_CONVERSATIONS = 50;
        this.MAX_MESSAGES = 100;
        this.DEFAULT_MODEL = 'gpt-5.1-chat'; // 更新為最新模型
        
        // 配置 Markdown 渲染
        this.configureMarked();
        
        // 加載對話
        this.loadConversations();
        
        // 初始化 UI
        this.initializeUI();
        
        // 綁定事件
        this.bindEvents();
        
        // 創建默認對話
        if (this.conversations.length === 0) {
            this.createConversation();
        } else {
            this.switchConversation(this.conversations[0].id);
        }
    }
    
    // ========================================
    // 配置 Markdown 渲染器
    // ========================================
    configureMarked() {
        if (typeof marked !== 'undefined') {
            marked.setOptions({
                highlight: function(code, lang) {
                    if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                        try {
                            return hljs.highlight(code, { language: lang }).value;
                        } catch (e) {
                            console.error('Highlight error:', e);
                        }
                    }
                    return code;
                },
                breaks: true,
                gfm: true
            });
        }
    }
    
    // ========================================
    // LocalStorage 操作
    // ========================================
    loadConversations() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            if (data) {
                this.conversations = JSON.parse(data);
                console.log('✅ 已加載', this.conversations.length, '個對話');
            }
        } catch (error) {
            console.error('❌ 加載對話失敗:', error);
            this.conversations = [];
        }
    }
    
    saveConversations() {
        try {
            // 限制對話數量
            if (this.conversations.length > this.MAX_CONVERSATIONS) {
                this.conversations = this.conversations.slice(0, this.MAX_CONVERSATIONS);
            }
            
            // 限制每個對話的消息數量
            this.conversations.forEach(conv => {
                if (conv.messages.length > this.MAX_MESSAGES) {
                    conv.messages = conv.messages.slice(-this.MAX_MESSAGES);
                }
            });
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.conversations));
        } catch (error) {
            console.error('❌ 保存對話失敗:', error);
            // 如果存儲空間不足，刪除最舊的對話
            if (this.conversations.length > 5) {
                this.conversations = this.conversations.slice(0, 5);
                this.saveConversations();
            }
        }
    }
    
    // ========================================
    // 對話管理
    // ========================================
    createConversation(title = '新對話') {
        const conversation = {
            id: Date.now(),
            title: title,
            messages: [],
            model: this.DEFAULT_MODEL,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.conversations.unshift(conversation);
        this.saveConversations();
        this.renderConversationsList();
        this.switchConversation(conversation.id);
        
        return conversation;
    }
    
    deleteConversation(id) {
        const index = this.conversations.findIndex(c => c.id === id);
        if (index === -1) return;
        
        this.conversations.splice(index, 1);
        this.saveConversations();
        this.renderConversationsList();
        
        // 如果刪除的是當前對話，切換到第一個對話
        if (this.currentConversationId === id) {
            if (this.conversations.length > 0) {
                this.switchConversation(this.conversations[0].id);
            } else {
                this.createConversation();
            }
        }
    }
    
    switchConversation(id) {
        this.currentConversationId = id;
        const conversation = this.getConversation(id);
        
        if (!conversation) {
            console.error('❌ 對話不存在:', id);
            return;
        }
        
        // 更新 UI
        this.updateChatHeader(conversation);
        this.renderMessages(conversation.messages);
        this.renderConversationsList();
        
        // 更新模型選擇
        const modelSelect = document.getElementById('model-select');
        if (modelSelect) {
            modelSelect.value = conversation.model || this.DEFAULT_MODEL;
        }
    }
    
    getConversation(id) {
        return this.conversations.find(c => c.id === id);
    }
    
    getCurrentConversation() {
        return this.getConversation(this.currentConversationId);
    }
    
    // 自動生成對話標題
    async generateTitle(conversationId) {
        const conv = this.getConversation(conversationId);
        if (!conv || conv.messages.length === 0) return;
        
        // 使用第一條用戶消息作為標題
        const firstUserMessage = conv.messages.find(m => m.role === 'user');
        if (firstUserMessage) {
            conv.title = firstUserMessage.content.substring(0, 30) + (firstUserMessage.content.length > 30 ? '...' : '');
            this.saveConversations();
            this.renderConversationsList();
            this.updateChatHeader(conv);
        }
    }
    
    // ========================================
    // 消息管理
    // ========================================
    addMessage(role, content) {
        const conversation = this.getCurrentConversation();
        if (!conversation) return;
        
        const message = {
            id: Date.now(),
            role: role, // 'user' or 'assistant'
            content: content,
            timestamp: new Date().toISOString()
        };
        
        conversation.messages.push(message);
        conversation.updatedAt = new Date().toISOString();
        this.saveConversations();
        
        // 自動生成標題
        if (conversation.messages.length === 1 && role === 'user') {
            this.generateTitle(conversation.id);
        }
        
        return message;
    }
    
    deleteMessage(messageId) {
        const conversation = this.getCurrentConversation();
        if (!conversation) return;
        
        const index = conversation.messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
            conversation.messages.splice(index, 1);
            this.saveConversations();
            this.renderMessages(conversation.messages);
        }
    }
    
    clearMessages() {
        const conversation = this.getCurrentConversation();
        if (!conversation) return;
        
        if (confirm('確定要清除所有消息嗎？')) {
            conversation.messages = [];
            this.saveConversations();
            this.renderMessages([]);
            this.updateChatHeader(conversation);
        }
    }
    
    // ========================================
    // UI 渲染
    // ========================================
    initializeUI() {
        // 確保 DOM 元素存在
        this.elements = {
            conversationsList: document.getElementById('conversations-list'),
            chatMessages: document.getElementById('chat-messages'),
            chatInput: document.getElementById('chat-input'),
            sendBtn: document.getElementById('send-btn'),
            newChatBtn: document.getElementById('new-chat-btn'),
            clearChatBtn: document.getElementById('clear-chat-btn'),
            searchInput: document.getElementById('search-conversations'),
            currentChatTitle: document.getElementById('current-chat-title'),
            messageCount: document.getElementById('message-count'),
            modelSelect: document.getElementById('model-select')
        };
    }
    
    renderConversationsList(searchTerm = '') {
        if (!this.elements.conversationsList) return;
        
        const filtered = searchTerm 
            ? this.conversations.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
            : this.conversations;
        
        if (filtered.length === 0) {
            this.elements.conversationsList.innerHTML = `
                <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
                    <p>暫無對話</p>
                </div>
            `;
            return;
        }
        
        this.elements.conversationsList.innerHTML = filtered.map(conv => {
            const isActive = conv.id === this.currentConversationId;
            const timeAgo = this.formatTimeAgo(conv.updatedAt);
            
            return `
                <div class="conversation-item ${isActive ? 'active' : ''}" data-id="${conv.id}">
                    <div class="conversation-title">${this.escapeHtml(conv.title)}</div>
                    <div class="conversation-meta">
                        <span class="conversation-date">${timeAgo}</span>
                        <span class="conversation-count">${conv.messages.length} 條</span>
                    </div>
                    <button class="btn-delete-conversation" data-id="${conv.id}" title="刪除對話">🗑️</button>
                </div>
            `;
        }).join('');
        
        // 綁定事件
        this.elements.conversationsList.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-delete-conversation')) {
                    this.switchConversation(parseInt(item.dataset.id));
                }
            });
        });
        
        this.elements.conversationsList.querySelectorAll('.btn-delete-conversation').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('確定要刪除這個對話嗎？')) {
                    this.deleteConversation(parseInt(btn.dataset.id));
                }
            });
        });
    }
    
    renderMessages(messages) {
        if (!this.elements.chatMessages) return;
        
        if (messages.length === 0) {
            this.elements.chatMessages.innerHTML = `
                <div style="text-align: center; padding: 4rem 2rem; color: var(--text-secondary);">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" style="opacity: 0.3; margin-bottom: 1rem;">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <p style="font-size: 1.1rem; font-weight: 600;">開始新對話</p>
                    <small style="font-size: 0.9rem;">輸入消息開始與 AI 助手對話</small>
                </div>
            `;
            return;
        }
        
        this.elements.chatMessages.innerHTML = messages.map(msg => this.createMessageHTML(msg)).join('');
        
        // 綁定消息操作事件
        this.bindMessageActions();
        
        // 滾動到底部
        this.scrollToBottom();
        
        // 高亮代碼
        if (typeof hljs !== 'undefined') {
            this.elements.chatMessages.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }
    
    createMessageHTML(message) {
        const isUser = message.role === 'user';
        const avatar = isUser ? '👤' : '🤖';
        const time = this.formatTime(message.timestamp);
        
        // 渲染 Markdown
        let content = message.content;
        if (!isUser && typeof marked !== 'undefined') {
            content = marked.parse(content);
            // XSS 防護
            if (typeof DOMPurify !== 'undefined') {
                content = DOMPurify.sanitize(content);
            }
        } else {
            content = this.escapeHtml(content).replace(/\n/g, '<br>');
        }
        
        return `
            <div class="message-wrapper ${isUser ? 'user' : 'ai'}" data-id="${message.id}">
                <div class="message-avatar">${avatar}</div>
                <div class="message-content">
                    <div class="message-bubble">${content}</div>
                    <div class="message-meta">
                        <span class="message-time">${time}</span>
                        <div class="message-actions">
                            <button class="btn-message-action btn-copy" title="複製" data-content="${this.escapeHtml(message.content)}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2"/>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                            </button>
                            ${!isUser ? `
                            <button class="btn-message-action btn-regenerate" title="重新生成" data-id="${message.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="23 4 23 10 17 10"/>
                                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                                </svg>
                            </button>
                            ` : ''}
                            <button class="btn-message-action btn-delete-message" title="刪除" data-id="${message.id}">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateChatHeader(conversation) {
        if (this.elements.currentChatTitle) {
            this.elements.currentChatTitle.textContent = conversation.title;
        }
        if (this.elements.messageCount) {
            this.elements.messageCount.textContent = `${conversation.messages.length} 條消息`;
        }
    }
    
    // ========================================
    // AI 對話功能
    // ========================================
    async sendMessage() {
        const input = this.elements.chatInput;
        if (!input) return;
        
        const message = input.value.trim();
        if (!message) return;
        
        const conversation = this.getCurrentConversation();
        if (!conversation) return;
        
        // 禁用輸入
        input.disabled = true;
        this.elements.sendBtn.disabled = true;
        
        // 添加用戶消息
        this.addMessage('user', message);
        this.renderMessages(conversation.messages);
        
        // 清空輸入
        input.value = '';
        this.adjustTextareaHeight(input);
        
        // 顯示打字動畫
        this.showTypingIndicator();
        
        try {
            // 調用 AI API
            const model = this.elements.modelSelect?.value || this.DEFAULT_MODEL;
            const response = await puter.ai.chat(message, { model: model });
            
            // 移除打字動畫
            this.hideTypingIndicator();
            
            // 添加 AI 回答
            this.addMessage('assistant', response);
            this.renderMessages(conversation.messages);
            
        } catch (error) {
            console.error('❌ AI 回答失敗:', error);
            this.hideTypingIndicator();
            this.addMessage('assistant', `抱歉，我遇到了錯誤：${error.message}`);
            this.renderMessages(conversation.messages);
        } finally {
            // 恢復輸入
            input.disabled = false;
            this.elements.sendBtn.disabled = false;
            input.focus();
        }
    }
    
    showTypingIndicator() {
        if (!this.elements.chatMessages) return;
        
        const indicator = document.createElement('div');
        indicator.className = 'message-wrapper ai typing-wrapper';
        indicator.innerHTML = `
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-bubble">
                    <div class="typing-indicator">
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                        <span class="typing-dot"></span>
                    </div>
                </div>
            </div>
        `;
        
        this.elements.chatMessages.appendChild(indicator);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        const indicator = this.elements.chatMessages?.querySelector('.typing-wrapper');
        if (indicator) {
            indicator.remove();
        }
    }
    
    async regenerateMessage(messageId) {
        const conversation = this.getCurrentConversation();
        if (!conversation) return;
        
        const messageIndex = conversation.messages.findIndex(m => m.id === messageId);
        if (messageIndex === -1) return;
        
        // 找到對應的用戶消息
        let userMessageIndex = messageIndex - 1;
        while (userMessageIndex >= 0 && conversation.messages[userMessageIndex].role !== 'user') {
            userMessageIndex--;
        }
        
        if (userMessageIndex < 0) return;
        
        const userMessage = conversation.messages[userMessageIndex].content;
        
        // 刪除原回答
        conversation.messages.splice(messageIndex, 1);
        this.saveConversations();
        this.renderMessages(conversation.messages);
        
        // 顯示打字動畫
        this.showTypingIndicator();
        
        try {
            const model = this.elements.modelSelect?.value || this.DEFAULT_MODEL;
            const response = await puter.ai.chat(userMessage, { model: model });
            
            this.hideTypingIndicator();
            this.addMessage('assistant', response);
            this.renderMessages(conversation.messages);
            
        } catch (error) {
            console.error('❌ 重新生成失敗:', error);
            this.hideTypingIndicator();
            this.addMessage('assistant', `抱歉，重新生成失敗：${error.message}`);
            this.renderMessages(conversation.messages);
        }
    }
    
    // ========================================
    // 事件綁定
    // ========================================
    bindEvents() {
        // 新建對話
        this.elements.newChatBtn?.addEventListener('click', () => {
            this.createConversation();
        });
        
        // 清除消息
        this.elements.clearChatBtn?.addEventListener('click', () => {
            this.clearMessages();
        });
        
        // 發送消息
        this.elements.sendBtn?.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Enter 發送
        this.elements.chatInput?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // 自動調整輸入框高度
        this.elements.chatInput?.addEventListener('input', (e) => {
            this.adjustTextareaHeight(e.target);
        });
        
        // 搜索對話
        this.elements.searchInput?.addEventListener('input', (e) => {
            this.renderConversationsList(e.target.value);
        });
        
        // 模型選擇變更
        this.elements.modelSelect?.addEventListener('change', (e) => {
            const conversation = this.getCurrentConversation();
            if (conversation) {
                conversation.model = e.target.value;
                this.saveConversations();
            }
        });
    }
    
    bindMessageActions() {
        // 複製消息
        this.elements.chatMessages?.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                const content = btn.dataset.content;
                navigator.clipboard.writeText(content).then(() => {
                    this.showNotification('✅ 已複製到剪貼板');
                }).catch(err => {
                    console.error('複製失敗:', err);
                });
            });
        });
        
        // 重新生成
        this.elements.chatMessages?.querySelectorAll('.btn-regenerate').forEach(btn => {
            btn.addEventListener('click', () => {
                const messageId = parseInt(btn.dataset.id);
                this.regenerateMessage(messageId);
            });
        });
        
        // 刪除消息
        this.elements.chatMessages?.querySelectorAll('.btn-delete-message').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('確定要刪除這條消息嗎？')) {
                    const messageId = parseInt(btn.dataset.id);
                    this.deleteMessage(messageId);
                }
            });
        });
    }
    
    // ========================================
    // 工具函數
    // ========================================
    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
    }
    
    formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return '剛剛';
        if (minutes < 60) return `${minutes} 分鐘前`;
        if (hours < 24) return `${hours} 小時前`;
        if (days < 7) return `${days} 天前`;
        
        return date.toLocaleDateString('zh-TW');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    adjustTextareaHeight(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
    }
    
    scrollToBottom() {
        if (this.elements.chatMessages) {
            this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight;
        }
    }
    
    showNotification(message) {
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
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
}

// ========================================
// 初始化聊天管理器
// ========================================
let chatManager;

// 等待 DOM 加載完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        chatManager = new ChatManager();
        console.log('✅ 聊天管理器已初始化');
    });
} else {
    chatManager = new ChatManager();
    console.log('✅ 聊天管理器已初始化');
}