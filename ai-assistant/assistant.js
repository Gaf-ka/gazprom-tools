// База знаний помощника
const knowledgeBase = {
    "как пользоваться калькулятором": "Калькулятор находится в разделе 'Офисные инструменты'. Вы можете выполнять базовые арифметические операции, а также финансовые расчеты.",
    "техника безопасности": "Подробную информацию о технике безопасности вы можете найти в тренажере по технике безопасности в разделе 'Тренажёры'.",
    "визуализация данных": "В разделе 'Визуализация данных' вы можете создавать графики и диаграммы. Доступны линейные, столбчатые, круговые и кольцевые диаграммы.",
    "как создать отчет": "Для создания отчета вы можете использовать инструменты визуализации данных, а также экспортировать результаты в формате PDF или изображения.",
    "контакты службы поддержки": "Служба поддержки доступна по внутреннему телефону 1234 или по email support@gazprom.ru.",
    "как работать с excel": "В разделе 'Тренажёры' доступен тренажёр Excel, где вы можете изучить основные функции и формулы.",
    "что такое газпром": "Газпром — глобальная энергетическая компания, занимающаяся разведкой, добычей, транспортировкой, хранением, переработкой и реализацией газа, газового конденсата и нефти."
};

// Общие фразы, если вопрос не найден
const defaultAnswers = [
    "Извините, я не совсем понял ваш вопрос. Можете переформулировать?",
    "Уточните, пожалуйста, ваш вопрос.",
    "Я пока не могу ответить на этот вопрос. Попробуйте задать его иначе.",
    "Информация по вашему вопросу может быть доступна в других разделах портала."
];

// API ключ будет заменен во время сборки GitHub Actions
const API_KEY = "{{OPENAI_API_KEY}}";

// Отправка сообщения
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    
    if (message === '') return;
    
    addMessage(message, 'user');
    userInput.value = '';
    
    showTypingIndicator();
    
    try {
        const response = await getResponse(message);
        addMessage(response, 'assistant');
    } catch (error) {
        console.error('Ошибка при получении ответа:', error);
        addMessage("Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.", 'assistant');
    } finally {
        hideTypingIndicator();
    }
}

// Обработка быстрых вопросов
function askQuickQuestion(question) {
    document.getElementById('user-input').value = question;
    sendMessage();
}

// Обработка нажатия Enter
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Добавление сообщения в чат
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}-message`;
    messageElement.textContent = text;
    chatMessages.appendChild(messageElement);
    
    // Прокрутка вниз
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Показать индикатор набора сообщения
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingElement = document.createElement('div');
    typingElement.className = 'typing-indicator';
    typingElement.id = 'typing-indicator';
    typingElement.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingElement);
    
    // Прокрутка вниз
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Скрыть индикатор набора сообщения
function hideTypingIndicator() {
    const typingElement = document.getElementById('typing-indicator');
    if (typingElement) {
        typingElement.remove();
    }
}

// Получение ответа от помощника
async function getResponse(question) {
    const lowerQuestion = question.toLowerCase();
    
    // Ищем точное совпадение в базе знаний
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (lowerQuestion.includes(key.toLowerCase())) {
            return value;
        }
    }
    
    // Проверяем, что API_KEY был заменен (не содержит шаблонных скобок)
    if (API_KEY && API_KEY !== "{{OPENAI_API_KEY}}") {
        return await getAIResponse(question);
    }
    
    // Если API ключа нет или он не был заменен, возвращаем случайный общий ответ
    return defaultAnswers[Math.floor(Math.random() * defaultAnswers.length)];
}

// Получение ответа от нейросети
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
                        content: "Ты помощник в компании Газпром. Отвечай кратко и по делу на русском языке. Если вопрос не связан с работой компании, вежливо откажись отвечать."
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
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error fetching AI response:', error);
        return "Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.";
    }
}

// Инициализация чата при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем приветственное сообщение, если чат пуст
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages.children.length === 0) {
        addMessage("Здравствуйте! Я ваш виртуальный помощник. Могу ответить на вопросы о работе компании, внутренних инструментах и документах. Чем могу помочь?", 'assistant');
    }
    
    // Назначаем обработчик для кнопки отправки
    document.querySelector('.assistant-input button').addEventListener('click', sendMessage);
    
    // Назначаем обработчик для поля ввода
    document.getElementById('user-input').addEventListener('keypress', handleKeyPress);
});