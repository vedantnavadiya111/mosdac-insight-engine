// content.js - Injects a persistent chat widget into MOSDAC pages
class PersistentChat {
    constructor() {
        this.isOpen = false;
        this.createChatWidget();
        this.addStyles();
    }

    createChatWidget() {
        // Create chat button
        this.chatButton = document.createElement('div');
        this.chatButton.innerHTML = '💬';
        this.chatButton.className = 'mosdac-chat-button';
        this.chatButton.title = 'MOSDAC Assistant';

        // Create chat container
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'mosdac-chat-container hidden';
        this.chatContainer.innerHTML = `
            <div class="chat-header">
                <h4>MOSDAC Assistant</h4>
                <button class="close-chat">×</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" class="chat-input" placeholder="Ask about MOSDAC...">
                <button class="send-btn">Send</button>
            </div>
        `;

        document.body.appendChild(this.chatButton);
        document.body.appendChild(this.chatContainer);

        this.bindEvents();
    }

    bindEvents() {
        this.chatButton.addEventListener('click', () => this.toggleChat());

        const closeBtn = this.chatContainer.querySelector('.close-chat');
        closeBtn.addEventListener('click', () => this.toggleChat());

        const sendBtn = this.chatContainer.querySelector('.send-btn');
        const input = this.chatContainer.querySelector('.chat-input');

        sendBtn.addEventListener('click', () => this.sendMessage());
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.chatContainer.classList.remove('hidden');
            this.chatContainer.querySelector('.chat-input').focus();
        } else {
            this.chatContainer.classList.add('hidden');
        }
    }

    async sendMessage() {
        const input = this.chatContainer.querySelector('.chat-input');
        const messagesContainer = this.chatContainer.querySelector('.chat-messages');
        const message = input.value.trim();

        if (!message) return;

        // Add user message
        this.addMessage(message, 'user');
        input.value = '';

        try {
            // Get session ID from storage
            const sessionId = await this.getSessionId();

            const response = await fetch('http://localhost:8000/chat/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: message, session_id: sessionId })
            });

            const data = await response.json();
            this.addMessage(data.answer, 'bot');
        } catch (error) {
            this.addMessage('Sorry, I encountered an error.', 'bot');
        }
    }

    addMessage(content, sender) {
        const messagesContainer = this.chatContainer.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    async getSessionId() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['mosdac_session_id'], (result) => {
                if (result.mosdac_session_id) {
                    resolve(result.mosdac_session_id);
                } else {
                    const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    chrome.storage.local.set({ mosdac_session_id: newSessionId });
                    resolve(newSessionId);
                }
            });
        });
    }

    addStyles() {
        const styles = `
            .mosdac-chat-button {
                position: fixed;
                bottom: 20px;
                right: 20px;
                width: 60px;
                height: 60px;
                background: #3b82f6;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                transition: transform 0.2s;
            }
            
            .mosdac-chat-button:hover {
                transform: scale(1.1);
            }
            
            .mosdac-chat-container {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                z-index: 10000;
                display: flex;
                flex-direction: column;
                border: 1px solid #e2e8f0;
            }
            
            .chat-header {
                padding: 16px;
                background: #3b82f6;
                color: white;
                border-radius: 12px 12px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .chat-header h4 {
                margin: 0;
                font-size: 16px;
            }
            
            .close-chat {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .close-chat:hover {
                background: rgba(255,255,255,0.2);
            }
            
            .chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                background: #f8fafc;
            }
            
            .chat-message {
                margin-bottom: 12px;
                padding: 8px 12px;
                border-radius: 12px;
                max-width: 80%;
                word-wrap: break-word;
            }
            
            .user-message {
                background: #3b82f6;
                color: white;
                margin-left: auto;
            }
            
            .bot-message {
                background: white;
                color: #1e293b;
                border: 1px solid #e2e8f0;
            }
            
            .chat-input-container {
                padding: 16px;
                background: white;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 8px;
            }
            
            .chat-input {
                flex: 1;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 14px;
            }
            
            .send-btn {
                padding: 8px 16px;
                background: #3b82f6;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            }
            
            .hidden {
                display: none !important;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Initialize when page loads
if (window.location.hostname.includes('mosdac.gov.in')) {
    new PersistentChat();
}
