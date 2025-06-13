// Конфигурация помощника
const config = {
    assistantName: "Помощник Газпром",
    companyInfo: `Газпром — глобальная энергетическая компания. Основные направления деятельности:
    - Разведка и добыча газа
    - Транспортировка газа
    - Хранение и переработка
    - Реализация газа и нефтепродуктов
    
    Контакты поддержки: телефон 1234, email support@gazprom.ru`,
    
    // Локальная модель (работает в браузере)
    modelName: "Xenova/LaMini-Flan-T5-248M",
    
    // Системный промт для модели
    systemPrompt: `Ты - виртуальный помощник компании Газпром. Отвечай профессионально и вежливо на русском языке.
    Если вопрос не по теме компании, вежливо ответь, что помогаешь только с вопросами о Газпроме.
    Отвечай кратко и по делу.`
};

// Элементы интерфейса
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const statusMessage = document.getElementById('status-message');

// Глобальные переменные для модели
let pipeline = null;
let modelLoaded = false;

// Инициализация модели
async function initModel() {
    try {
        statusMessage.textContent = "Загрузка нейросети... (это займет около 30 секунд)";
        
        // Импортируем необходимые компоненты
        const { pipeline } = await import('@xenova/transformers');
        
        // Загружаем модель
        statusMessage.textContent = "Загрузка модели...";
        const generator = await pipeline('text2text-generation', config.modelName, {
            quantized: true,
            progress_callback: (progress) => {
                const percent = Math.round(progress.loaded / progress.total * 100);
                statusMessage.textContent = `Загрузка модели: ${percent}%`;
            }
        });
        
        pipeline = generator;
        modelLoaded = true;
        statusMessage.textContent = "Модель загружена! Можете задавать вопросы.";
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
        
        console.log("Модель успешно загружена");
    } catch (error) {
        console.error("Ошибка загрузки модели:", error);
        statusMessage.textContent = "Ошибка загрузки модели. Пожалуйста, обновите страницу.";
    }
}

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

// Генерация ответа с помощью локальной модели
async function generateResponse(userMessage) {
    if (!modelLoaded || !pipeline) {
        return "Модель еще не загружена. Пожалуйста, подождите.";
    }
    
    try {
        // Формируем полный промт
        const fullPrompt = `${config.systemPrompt}\n\nКонтекст компании:\n${config.companyInfo}\n\nВопрос: ${userMessage}\nОтвет:`;
        
        // Генерируем ответ
        const response = await pipeline(fullPrompt, {
            max_new_tokens: 200,
            temperature: 0.7,
            repetition_penalty: 1.2,
            do_sample: true
        });
        
        return response[0].generated_text.trim();
    } catch (error) {
        console.error("Ошибка генерации ответа:", error);
        return "Извините, произошла ошибка при генерации ответа. Пожалуйста, попробуйте еще раз.";
    }
}

// Отправка сообщения
async function sendMessage() {
    const message = userInput.value.trim();
    if (!message || !modelLoaded) return;

    userInput.value = '';
    addMessage(message, 'user');
    showTypingIndicator();

    try {
        const response = await generateResponse(message);
        addMessage(response, 'assistant');
    } catch (error) {
        console.error('Ошибка:', error);
        addMessage("Произошла ошибка. Пожалуйста, попробуйте позже.", 'assistant');
    } finally {
        hideTypingIndicator();
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    initChat();
    initModel();
});