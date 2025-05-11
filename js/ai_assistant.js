/**
 * AI Study Assistant functionality for CampusConnect
 * Provides AI-powered learning assistance for students
 */

// Initialize AI Assistant
function initAIAssistant() {
    // Set up event listeners for the AI chat form
    const chatForm = document.getElementById('ai-chat-form');
    if (chatForm) {
        chatForm.addEventListener('submit', function(e) {
            e.preventDefault();
            sendAIQuery();
        });
    }
    
    // Set up event listeners for quick action buttons
    const quickActions = document.querySelectorAll('.ai-quick-action');
    quickActions.forEach(button => {
        button.addEventListener('click', function() {
            const query = this.getAttribute('data-query');
            document.getElementById('ai-chat-input').value = query;
            sendAIQuery();
        });
    });
    
    // Set up event listeners for AI tools
    document.getElementById('ai-flashcards').addEventListener('click', function() {
        showFlashcardGenerator();
    });
    
    document.getElementById('ai-summarize').addEventListener('click', function() {
        showTextSummarizer();
    });
    
    document.getElementById('ai-quiz').addEventListener('click', function() {
        showQuizGenerator();
    });
    
    document.getElementById('ai-explain').addEventListener('click', function() {
        showConceptExplainer();
    });
}

// Send query to AI Assistant
function sendAIQuery() {
    const inputElement = document.getElementById('ai-chat-input');
    const query = inputElement.value.trim();
    
    if (!query) return;
    
    // Add user message to chat
    addMessageToChat('user', query);
    
    // Clear input
    inputElement.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // In a real application, this would be an API call to an AI service
    // For this demo, we'll simulate a response after a delay
    setTimeout(() => {
        // Remove typing indicator
        removeTypingIndicator();
        
        // Get AI response based on query
        const response = generateAIResponse(query);
        
        // Add AI response to chat
        addMessageToChat('ai', response);
        
        // Update recommendations based on query
        updateRecommendations(query);
    }, 1500);
}

// Add message to chat
function addMessageToChat(sender, message) {
    const chatContainer = document.getElementById('ai-chat-messages');
    const messageElement = document.createElement('div');
    
    if (sender === 'user') {
        messageElement.className = 'user-message';
        messageElement.innerHTML = `
            <div class="user-avatar">👤</div>
            <div class="user-message-content">
                <p>${message}</p>
            </div>
        `;
    } else {
        messageElement.className = 'ai-message';
        messageElement.innerHTML = `
            <div class="ai-avatar">🤖</div>
            <div class="ai-message-content">
                <p>${message}</p>
            </div>
        `;
    }
    
    chatContainer.appendChild(messageElement);
    
    // Scroll to bottom of chat
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const chatContainer = document.getElementById('ai-chat-messages');
    const typingElement = document.createElement('div');
    typingElement.className = 'ai-message typing-indicator';
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `
        <div class="ai-avatar">🤖</div>
        <div class="ai-message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatContainer.appendChild(typingElement);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}