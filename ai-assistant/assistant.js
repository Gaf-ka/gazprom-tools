// База знаний помощника (для быстрых ответов)
const knowledgeBase = {
    "как пользоваться калькулятором": "Калькулятор находится в разделе 'Офисные инструменты'. Вы можете выполнять базовые арифметические операции, а также финансовые расчеты.",
    "техника безопасности": "Подробную информацию о технике безопасности вы можете найти в тренажере по технике безопасности в разделе 'Тренажёры'.",
    "визуализация данных": "В разделе 'Визуализация данных' вы можете создавать графики и диаграммы. Доступны линейные, столбчатые, круговые и кольцевые диаграммы.",
    "как создать отчет": "Для создания отчета вы можете использовать инструменты визуализации данных, а также экспортировать результаты в формате PDF или изображения.",
    "контакты службы поддержки": "Служба поддержки доступна по внутреннему телефону 1234 или по email support@gazprom.ru.",
    "как работать с excel": "В разделе 'Тренажёры' доступен тренажёр Excel, где вы можете изучить основные функции и формулы.",
    "что такое газпром": "Газпром — глобальная энергетическая компания, занимающаяся разведкой, добычей, транспортировкой, хранением, переработкой и реализацией газа, газового конденсата и нефти."
};

// API ключ (будет заменен GitHub Actions)
const API_KEY = window.OPENAI_API_KEY || "{{OPENAI_API_KEY}}";

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

// Отправка запроса к OpenAI
async function getAIResponse(question) {
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "Ты помощник в компании Газпром. Отвечай кратко и по делу на русском языке. Если вопрос не связан с работой компании, вежливо откажись отвечать. Отвечай только по работе компании и её инструментам."
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
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
        console.error('Ошибка OpenAI:', error);
        return "Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.";
    }
}

// Обработка отправки сообщения
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;
    
    userInput.value = '';
    addMessage(message, 'user');
    showTypingIndicator();
    
    try {
        // Сначала проверяем быстрые вопросы
        const quickAnswer = checkQuickQuestions(message);
        if (quickAnswer) {
            addMessage(quickAnswer, 'assistant');
            return;
        }
        
        // Если API ключ заменен (не шаблонный)
        if (API_KEY && API_KEY !== "{{OPENAI_API_KEY}}") {
            const aiResponse = await getAIResponse(message);
            addMessage(aiResponse, 'assistant');
        } else {
            addMessage("Извините, сервис временно недоступен. Попробуйте задать другой вопрос.", 'assistant');
        }
    } catch (error) {
        console.error('Ошибка:', error);
        addMessage("Произошла ошибка при обработке запроса. Пожалуйста, попробуйте позже.", 'assistant');
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