<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ИИ помощник - Газпром</title>
    <link rel="stylesheet" href="../style.css">
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Ваши существующие стили остаются без изменений */
        .quick-questions { margin-top: 15px; padding: 10px; }
        .quick-questions p { margin-bottom: 10px; color: #666; font-size: 14px; }
        .quick-question {
            display: inline-block; margin: 5px; padding: 8px 15px;
            background-color: #f0f0f0; border: 1px solid #ddd;
            border-radius: 20px; color: #333; font-size: 14px;
            cursor: pointer; transition: all 0.3s ease;
        }
        .quick-question:hover { background-color: #e0e0e0; border-color: #ccc; }
        .quick-question:active { background-color: #d0d0d0; }
        .assistant-container {
            max-width: 800px; margin: 20px auto;
            background: #fff; border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1); overflow: hidden;
        }
        .assistant-header {
            display: flex; align-items: center; padding: 15px 20px;
            background: #f8f8f8; border-bottom: 1px solid #eee;
        }
        .assistant-avatar {
            width: 40px; height: 40px; background: #0088cc;
            color: white; border-radius: 50%; display: flex;
            align-items: center; justify-content: center;
            margin-right: 15px; font-weight: bold;
        }
        .assistant-messages {
            padding: 20px; height: 400px; overflow-y: auto;
        }
        .message {
            margin-bottom: 15px; padding: 10px 15px;
            border-radius: 18px; max-width: 80%;
        }
        .assistant-message { background: #f1f1f1; margin-right: auto; }
        .user-message {
            background: #0088cc; color: white;
            margin-left: auto;
        }
        .assistant-input {
            display: flex; padding: 15px;
            border-top: 1px solid #eee;
        }
        .assistant-input input {
            flex: 1; padding: 10px 15px;
            border: 1px solid #ddd; border-radius: 20px;
            outline: none;
        }
        .assistant-input button {
            margin-left: 10px; padding: 10px 20px;
            background: #0088cc; color: white;
            border: none; border-radius: 20px; cursor: pointer;
        }
        .assistant-input button:hover { background: #0077bb; }
        .typing-indicator {
            display: flex; padding: 10px 15px;
            margin-bottom: 15px;
        }
        .typing-dot {
            width: 8px; height: 8px;
            background-color: #999; border-radius: 50%;
            margin: 0 3px; animation: typingAnimation 1.4s infinite ease-in-out;
        }
        .typing-dot:nth-child(1) { animation-delay: 0s; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes typingAnimation {
            0%, 60%, 100% { transform: translateY(0); }
            30% { transform: translateY(-5px); }
        }
    </style>
</head>
<body>
    <!-- Ваш существующий HTML код остается без изменений -->
    <header class="header">
        <!-- ... -->
    </header>

    <main class="main">
        <section class="section-header">
            <div class="container">
                <h1 class="section-title">ИИ помощник</h1>
                <p class="section-subtitle">Задавайте вопросы и получайте помощь по работе с внутренними инструментами и документами</p>
            </div>
        </section>

        <div class="assistant-container">
            <div class="assistant-header">
                <div class="assistant-avatar">AI</div>
                <div>
                    <h3>Помощник Газпром</h3>
                    <p>Чем могу помочь?</p>
                </div>
            </div>
            
            <div class="assistant-messages" id="chat-messages">
                <div class="message assistant-message">
                    Здравствуйте! Я ваш виртуальный помощник. Могу ответить на вопросы о работе компании, внутренних инструментах и документах. Чем могу помочь?
                </div>
                <div class="quick-questions">
                    <p>Вы можете спросить:</p>
                    <button class="quick-question" onclick="askQuickQuestion('Как пользоваться калькулятором?')">Как пользоваться калькулятором?</button>
                    <button class="quick-question" onclick="askQuickQuestion('Где найти информацию по технике безопасности?')">Где найти информацию по технике безопасности?</button>
                    <button class="quick-question" onclick="askQuickQuestion('Как создать отчет?')">Как создать отчет?</button>
                    <button class="quick-question" onclick="askQuickQuestion('Контакты службы поддержки')">Контакты службы поддержки</button>
                </div>
            </div>
            
            <div class="assistant-input">
                <input type="text" id="user-input" placeholder="Введите ваш вопрос..." onkeypress="handleKeyPress(event)">
                <button onclick="sendMessage()">Отправить</button>
            </div>
        </div>
    </main>

    <footer class="footer">
        <!-- ... -->
    </footer>

    <script>
        // Установите здесь ваш реальный ключ Hugging Face API
        const HF_API_KEY = "hf_ваш_ключ";
        
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

        // Элементы интерфейса
        const chatMessages = document.getElementById('chat-messages');
        const userInput = document.getElementById('user-input');
        let apiWorking = true;

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
                            "Authorization": `Bearer ${HF_API_KEY}`,
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
                apiWorking = false;
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
            if (apiWorking && HF_API_KEY && HF_API_KEY !== "hf_ваш_ключ") {
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
    </script>
</body>
</html>