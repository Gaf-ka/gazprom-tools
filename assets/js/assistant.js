document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    
    // База знаний помощника
    const knowledgeBase = {
        "привет": {
            answer: "Здравствуйте! Чем могу помочь?",
            quickQuestions: [
                "Как работать с аналитикой данных?",
                "Где найти тренажёры по Excel?",
                "Как создать отчёт?"
            ]
        },
        "аналитик": {
            answer: "Для работы с аналитикой данных перейдите в раздел 'Аналитика' и загрузите ваш файл с данными. Поддерживаются форматы CSV и Excel. После загрузки вы сможете выбрать тип графика и данные для осей.",
            quickQuestions: [
                "Как сохранить график?",
                "Как создать отчёт из данных?",
                "Какие форматы данных поддерживаются?"
            ]
        },
        "тренаж": {
            answer: "Тренажёры доступны в соответствующем разделе. У нас есть: 1) Тренажёр по технике безопасности, 2) Тренажёр Excel, 3) Тренажёр делового общения. Выберите нужный и начните обучение.",
            quickQuestions: [
                "Как пройти тест по технике безопасности?",
                "Где найти тренажёр по Excel?",
                "Есть ли тренажёры по переговорам?"
            ]
        },
        "отчёт": {
            answer: "Чтобы создать отчёт: 1) Загрузите данные в разделе 'Аналитика', 2) Постройте нужную визуализацию, 3) Нажмите 'Создать отчёт'. Вы сможете добавить описание и сохранить отчёт в PDF.",
            quickQuestions: [
                "Как добавить описание к отчёту?",
                "Какие форматы сохранения доступны?",
                "Можно ли отправить отчёт по email?"
            ]
        },
        "поддержк": {
            answer: "Служба поддержки доступна: Телефон: +7 (495) 123-45-67 (доб. 1234), Email: support@gazprom.ru, Часы работы: Пн-Пт с 9:00 до 18:00.",
            quickQuestions: [
                "Как оставить обращение?",
                "Где найти внутренние регламенты?",
                "Куда обратиться по техническим вопросам?"
            ]
        },
        "excel": {
            answer: "Тренажёр Excel находится в разделе 'Тренажёры'. Он включает обучение: 1) Основным функциям, 2) Формулам, 3) Созданию таблиц, 4) Анализу данных.",
            quickQuestions: [
                "Как научиться сводным таблицам?",
                "Где найти примеры формул?",
                "Как экспортировать данные из Excel?"
            ]
        },
        "безопасност": {
            answer: "Тренажёр по технике безопасности включает: 1) Общие правила, 2) Действия в ЧС, 3) Первую помощь, 4) Работу с оборудованием. Пройдите тест после обучения.",
            quickQuestions: [
                "Как часто проходить инструктаж?",
                "Где найти правила эвакуации?",
                "Куда сообщить о нарушении?"
            ]
        },
        "данн": {
            answer: "Для работы с данными используйте раздел 'Аналитика'. Вы можете: 1) Загружать CSV/Excel, 2) Строить графики, 3) Сохранять результаты, 4) Генерировать отчёты.",
            quickQuestions: [
                "Как импортировать данные?",
                "Какие типы графиков доступны?",
                "Как поделиться результатами?"
            ]
        }
    };
    
    // Общие ответы
    const defaultAnswers = [
        "Уточните, пожалуйста, ваш вопрос.",
        "Я не совсем понял. Можете переформулировать?",
        "Посмотрите информацию в соответствующих разделах портала.",
        "Попробуйте задать вопрос иначе."
    ];
    
    // Отправка сообщения
    window.sendMessage = function() {
        const message = userInput.value.trim();
        if (!message) return;
        
        addMessage(message, 'user');
        userInput.value = '';
        
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const response = getResponse(message);
            addMessage(response.answer, 'assistant', response.quickQuestions);
        }, 1000 + Math.random() * 2000);
    };
    
    // Быстрый вопрос
    window.sendQuickQuestion = function(question) {
        addMessage(question, 'user');
        
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const response = getResponse(question);
            addMessage(response.answer, 'assistant', response.quickQuestions);
        }, 500 + Math.random() * 1000);
    };
    
    // Обработка Enter
    window.handleKeyPress = function(e) {
        if (e.key === 'Enter') sendMessage();
    };
    
    // Добавление сообщения в чат
    function addMessage(text, sender, quickQuestions = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (sender === 'assistant') {
            messageDiv.innerHTML = `<p>${text}</p>`;
            
            if (quickQuestions && quickQuestions.length) {
                const quickQuestionsDiv = document.createElement('div');
                quickQuestionsDiv.className = 'quick-questions';
                
                quickQuestions.forEach(q => {
                    const qDiv = document.createElement('div');
                    qDiv.className = 'quick-question';
                    qDiv.textContent = q;
                    qDiv.onclick = () => sendQuickQuestion(q);
                    quickQuestionsDiv.appendChild(qDiv);
                });
                
                messageDiv.appendChild(quickQuestionsDiv);
            }
        } else {
            messageDiv.textContent = text;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Индикатор набора
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Скрыть индикатор
    function hideTypingIndicator() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }
    
    // Получение ответа
    function getResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        // Ищем совпадение в базе знаний
        for (const [key, value] of Object.entries(knowledgeBase)) {
            if (lowerQuestion.includes(key)) {
                return value;
            }
        }
        
        // Если не нашли, возвращаем случайный ответ
        return {
            answer: defaultAnswers[Math.floor(Math.random() * defaultAnswers.length)],
            quickQuestions: [
                "Как работать с аналитикой данных?",
                "Где найти тренажёры?",
                "Как создать отчёт?"
            ]
        };
    }
});