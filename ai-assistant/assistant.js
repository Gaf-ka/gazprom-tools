// Конфигурация помощника
const config = {
    assistantName: "Помощник Газпром",
    companyInfo: "Газпром — глобальная энергетическая компания, занимающаяся разведкой, добычей, транспортировкой, хранением, переработкой и реализацией газа, газового конденсата и нефти.",
    defaultResponse: "Извините, я не могу ответить на этот вопрос. Пожалуйста, обратитесь в службу поддержки по телефону 1234."
};

// Элементы интерфейса
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// История диалога
let conversationHistory = [
    { role: "assistant", content: "Здравствуйте! Я ваш виртуальный помощник в компании Газпром. Чем могу помочь?" }
];

// Инициализация чата
function initChat() {
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
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

// Получение ответа от AI
async function getAIResponse(userMessage) {
    // Добавляем контекст для AI
    const systemPrompt = `Ты - ${config.assistantName}, виртуальный помощник в компании Газпром. 
    ${config.companyInfo}
    Отвечай вежливо и профессионально на русском языке. 
    Если вопрос не связан с компанией, вежливо сообщи, что помогаешь только по вопросам, связанным с Газпромом.`;

    // Формируем полный запрос
    const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.map(msg => ({ role: msg.role, content: msg.content })),
        { role: "user", content: userMessage }
    ];

    try {
        // Используем бесплатный прокси к OpenAI API
        const response = await fetch('https://free.churchless.tech/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Ошибка при запросе к AI:', error);
        return null;
    }
}

// Отправка сообщения
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    userInput.value = '';
    addMessage(message, 'user');
    conversationHistory.push({ role: "user", content: message });
    showTypingIndicator();

    try {
        const response = await getAIResponse(message);
        
        if (response) {
            addMessage(response, 'assistant');
            conversationHistory.push({ role: "assistant", content: response });
        } else {
            addMessage(config.defaultResponse, 'assistant');
            conversationHistory.push({ role: "assistant", content: config.defaultResponse });
        }
    } catch (error) {
        console.error('Ошибка:', error);
        addMessage("Произошла ошибка. Пожалуйста, попробуйте позже.", 'assistant');
    } finally {
        hideTypingIndicator();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initChat);