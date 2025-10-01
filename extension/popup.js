class MOSDACExtension {
    constructor() {
        this.sessionId = null;
        this.baseUrl = 'http://localhost:8000';
        this.init();
    }

    async init() {
        try {
            await this.loadSession();
            this.bindEvents();
            // Removed loadChatHistory() call since we don't have that function
        } catch (error) {
            console.error('Extension init error:', error);
        }
    }

    async loadSession() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['mosdac_session_id'], (result) => {
                if (result.mosdac_session_id) {
                    this.sessionId = result.mosdac_session_id;
                } else {
                    this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                    chrome.storage.local.set({ mosdac_session_id: this.sessionId });
                }
                resolve();
            });
        });
    }

    bindEvents() {
        const sendBtn = document.getElementById('send-btn');
        const userInput = document.getElementById('user-input');
        const clearBtn = document.getElementById('clear-chat');

        if (sendBtn && userInput && clearBtn) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.sendMessage();
            });
            clearBtn.addEventListener('click', () => this.clearChat());

            // Focus input on load
            userInput.focus();
        }
    }

    async sendMessage() {
        const userInput = document.getElementById('user-input');
        const sendBtn = document.getElementById('send-btn');
        const message = userInput.value.trim();

        if (!message) return;

        // Add user message to UI
        this.addMessage(message, 'user');
        userInput.value = '';
        sendBtn.disabled = true;

        // Show loading
        this.showLoading();

        try {
            const response = await this.callAPI(message);
            this.addMessage(response.answer, 'bot');
        } catch (error) {
            console.error('API Error:', error);
            this.addMessage('Sorry, I encountered an error. Please check if the backend server is running on localhost:8000.', 'bot');
        } finally {
            this.hideLoading();
            sendBtn.disabled = false;
            userInput.focus();
        }
    }

    async callAPI(message) {
        const response = await fetch(`${this.baseUrl}/chat/query`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: message,
                session_id: this.sessionId
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');

        // Remove welcome message if it's the first real message
        const welcomeMsg = messagesContainer.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;

        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'message-bubble';
        bubbleDiv.textContent = content;

        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], {
            hour: '2-digit', minute: '2-digit'
        });

        messageDiv.appendChild(bubbleDiv);
        messageDiv.appendChild(timeDiv);
        messagesContainer.appendChild(messageDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    clearChat() {
        const messagesContainer = document.getElementById('chat-messages');
        if (messagesContainer) {
            messagesContainer.innerHTML = `
                <div class="welcome-message">
                    <p>Ask me anything about MOSDAC data!</p>
                    <p class="hint">Try: "What is OSCAT data?" or "How to download data?"</p>
                </div>
            `;
        }

        // Clear backend history
        if (this.sessionId) {
            fetch(`${this.baseUrl}/chat/clear-history`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    session_id: this.sessionId
                })
            }).catch(error => {
                console.log('Error clearing history:', error);
            });
        }

        // Generate new session
        this.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        chrome.storage.local.set({ mosdac_session_id: this.sessionId });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MOSDACExtension();
});
