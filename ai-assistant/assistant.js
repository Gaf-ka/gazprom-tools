// База знаний помощника (для быстрых ответов)
const knowledgeBase = {
    "как пользоваться калькулятором": "Калькулятор находится в разделе 'Офисные инструменты'. Вы можете выполнять базовые арифметические операции, а также финансовые расчеты.",
    "техника безопасности": "Подробную информацию о технике безопасности вы можете найти в тренажере по технике безопасности в разделе 'Тренажёры'.",
    "визуализация данных": "В разделе 'Визуализация данных' вы можете создавать графики и диаграммы. Доступны линейные, столбчатые, круговые и кольцевые диаграммы.",
    "как создать отчет": "Для создания отчета вы можете использовать инструменты визуализации данных, а также экспортировать результаты в формате PDF или изображения.",
    "контакты службы поддержки": "Служба поддержки доступна по внутреннему телефону 1234 или по email support@gazprom.ru.",
    "как работать с excel": "В разделе 'Тренажёры' доступен тренажёр Excel, где вы можете изучить основные функции и формулы.",
    "что такое газпром": "Газпром — глобальная энергетическая компания, занимающаяся разведкой, добычей, транспортировкой, хранением, переработкой и реализацией газа, газового конденсата и нефти.",
    "привет": "Здравствуйте! Чем могу помочь?",
    "помощь": "Я могу ответить на вопросы о работе компании, внутренних инструментах и документах. Попробуйте задать конкретный вопрос."
};

// Настройки API
const AI_CONFIG = {
    HF_API_KEY: window.HF_API_KEY || "{{HF_API_KEY}}",
    USE_API: true
};

// Элементы интерфейса
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

// Инициализация чата
function initChat() {
    if (chatMessages.children.length <= 1) {
        addMessage("Здравствуйте! Я ваш виртуальный помощник. Могу ответить на вопросы о работе компании, внутренних инструментах и документах. Чем могу помочь?", 'assistant');
    }
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

// Проверка быстрых вопросов
function checkQuickQuestions(question) {
    const lowerQuestion = question.toLowerCase();
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (lowerQuestion.includes(key.toLowerCase())) {
            return value;
        }
    }
    return null;
}

// Получение ответа от Hugging Face API
async function getHuggingFaceResponse(question) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${AI_CONFIG.HF_API_KEY}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ inputs: question })
            }
        );

        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status}`);
        }

        const data = await response.json();
        return data.generated_text || "Не могу ответить на этот вопрос.";
    } catch (error) {
        console.error('Ошибка Hugging Face API:', error);
        AI_CONFIG.USE_API = false;
        return null;
    }
}

// Генерация ответа для неизвестных вопросов
function generateFallbackResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes("как") || lowerQuestion.includes("какой")) {
        return "По этому вопросу обратитесь в службу поддержки по телефону 1234.";
    }
    
    if (lowerQuestion.includes("когда") || lowerQuestion.includes("сколько")) {
        return "Точную информацию по срокам можно уточнить в соответствующем разделе портала.";
    }
    
    return "Извините, я не могу ответить на этот вопрос. Пожалуйста, уточните ваш запрос или обратитесь в поддержку.";
}

// Основная функция получения ответа
async function getAIResponse(question) {
    // Сначала проверяем быстрые вопросы
    const quickAnswer = checkQuickQuestions(question);
    if (quickAnswer) return quickAnswer;
    
    // Пробуем Hugging Face API если доступно
    if (AI_CONFIG.USE_API && AI_CONFIG.HF_API_KEY && AI_CONFIG.HF_API_KEY !== "{{HF_API_KEY}}") {
        const apiResponse = await getHuggingFaceResponse(question);
        if (apiResponse) return apiResponse;
    }
    
    // Если API недоступно, используем резервный вариант
    return generateFallbackResponse(question);
}

// Обработка отправки сообщения
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    userInput.value = '';
    addMessage(message, 'user');
    showTypingIndicator();
    
    try {
        const response = await getAIResponse(message);
        addMessage(response, 'assistant');
    } catch (error) {
        console.error('Ошибка:', error);
        addMessage("Произошла ошибка. Попробуйте позже.", 'assistant');
    } finally {
        hideTypingIndicator();
    }
}

// Быстрый вопрос
function askQuickQuestion(question) {
    userInput.value = question;
    sendMessage();
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