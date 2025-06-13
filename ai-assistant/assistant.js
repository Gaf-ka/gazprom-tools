// Конфигурация API
const AI_CONFIG = {
    HF_API_KEY: "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",
    MODEL: "facebook/blenderbot-400M-distill",
    API_URL: "https://api-inference.huggingface.co/models/"
};

// Элементы интерфейса
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

// История диалога
let conversationHistory = [];

// Инициализация чата
function initChat() {
    addMessage("Здравствуйте! Я ваш виртуальный помощник. Могу ответить на вопросы о работе компании. Чем могу помочь?", 'assistant');
}

// Добавление сообщения в чат
function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Показать индикатор набора
function showTypingIndicator() {
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator';
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Скрыть индикатор набора
function hideTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) typingElement.remove();
}

// Запрос к Hugging Face API
async function queryHuggingFace(prompt) {
    try {
        // Добавляем контекст для нейросети
        const context = "Ты - помощник в компании Газпром. Отвечай на вопросы вежливо и профессионально. " + 
                        "Газпром — глобальная энергетическая компания, занимающаяся разведкой, добычей, " + 
                        "транспортировкой, хранением, переработкой и реализацией газа, газового конденсата и нефти.";
        
        // Формируем полный запрос с историей диалога
        const fullPrompt = `${context}\n\nТекущий диалог:\n${conversationHistory.join('\n')}\nПользователь: ${prompt}\nАссистент:`;
        
        const response = await fetch(
            AI_CONFIG.API_URL + AI_CONFIG.MODEL,
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${AI_CONFIG.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    inputs: fullPrompt,
                    parameters: {
                        max_length: 200,
                        temperature: 0.7,
                        repetition_penalty: 1.2
                    }
                })
            }
        );

        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const data = await response.json();
        return data.generated_text;
    } catch (error) {
        console.error('Ошибка Hugging Face API:', error);
        return null;
    }
}

// Обработка отправки сообщения
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    userInput.value = '';
    addMessage(message, 'user');
    showTypingIndicator();
    
    // Добавляем вопрос в историю
    conversationHistory.push(`Пользователь: ${message}`);
    
    try {
        const response = await queryHuggingFace(message);
        
        if (response) {
            // Очищаем лишние части ответа (если есть)
            let cleanResponse = response.replace(/Ассистент:/g, '').trim();
            
            // Добавляем ответ в историю
            conversationHistory.push(`Ассистент: ${cleanResponse}`);
            
            // Ограничиваем историю диалога (чтобы не перегружать API)
            if (conversationHistory.length > 6) {
                conversationHistory = conversationHistory.slice(-6);
            }
            
            addMessage(cleanResponse, 'assistant');
        } else {
            addMessage("Извините, не удалось получить ответ. Попробуйте позже.", 'assistant');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        addMessage("Произошла ошибка. Попробуйте позже.", 'assistant');
    } finally {
        hideTypingIndicator();
    }
}

// Обработка нажатия Enter
function handleKeyPress(event) {
    if (event.key === 'Enter') sendMessage();
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initChat();
    
    // Назначение обработчиков
    document.querySelector('.assistant-input button').addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', handleKeyPress);
});