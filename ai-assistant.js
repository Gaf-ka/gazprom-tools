function initAIAssistant() {
    const aiInput = document.querySelector('.ai-input input');
    const sendBtn = document.querySelector('.send-question');
    const quickQuestions = document.querySelectorAll('.quick-question');
    const aiMessages = document.querySelector('.ai-messages');
    
    const knowledgeBase = {
        'командировка': {
            questionPatterns: [/как оформить командировк\w+/i, /документы для командировк\w+/i],
            response: `Для оформления командировки в 2025 году необходимо:
            1. Заполнить заявку в корпоративном портале
            2. Прикрепить обоснование поездки
            3. Согласовать с руководителем подразделения
            4. После подтверждения получить приказ о командировке
            
            Все шаблоны документов доступны в разделе "Офисные инструменты".`
        },
        'шаблоны': {
            questionPatterns: [/где найти шаблон\w+/i, /шаблон\w+ документ\w+/i],
            response: `Шаблоны документов доступны:
            1. На корпоративном портале в разделе "Документы"
            2. В облачном хранилище Газпром (доступ по VPN)
            3. В разделе "Офисные инструменты" этого приложения
            
            Если вам нужен конкретный шаблон, уточните его название.`
        },
        'регламенты': {
            questionPatterns: [/какие новые регламент\w+/i, /изменения в регламент\w+/i],
            response: `В 2025 году вступили в силу следующие изменения:
            1. Новый регламент по работе с подрядчиками (ГП-2025-07)
            2. Обновлённые правила техники безопасности (ГП-2025-12)
            3. Изменения в порядке согласования договоров (ГП-2025-05)
            
            Полные тексты документов доступны на корпоративном портале.`
        },
        'контакты': {
            questionPatterns: [/контакт\w+ ответственн\w+/i, /кто ответственный за/i],
            response: `Контакты ответственных сотрудников:
            1. По общим вопросам - Иванова А.П., тел. 1234, каб. 305
            2. По техническим вопросам - Петров С.И., тел. 5678, каб. 412
            3. По кадровым вопросам - Сидорова О.Л., тел. 9012, каб. 201
            
            Полный список контактов доступен в корпоративном справочнике.`
        },
        'default': {
            response: `Извините, я не совсем понял ваш вопрос. Пожалуйста, уточните его или выберите один из вариантов:
            1. Как оформить командировку?
            2. Где найти шаблоны документов?
            3. Какие новые регламенты в 2025?
            4. Кто ответственный за...?`
        }
    };
    
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${isUser ? 'user-message' : 'ai-response'}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    function processQuestion(question) {
        let found = false;
        
        for (const topic in knowledgeBase) {
            if (topic === 'default') continue;
            
            const patterns = knowledgeBase[topic].questionPatterns;
            for (const pattern of patterns) {
                if (pattern.test(question)) {
                    addMessage(knowledgeBase[topic].response);
                    found = true;
                    break;
                }
            }
            if (found) break;
        }
        
        if (!found) {
            addMessage(knowledgeBase.default.response);
        }
    }
    
    sendBtn.addEventListener('click', function() {
        const question = aiInput.value.trim();
        if (question) {
            addMessage(question, true);
            processQuestion(question);
            aiInput.value = '';
        }
    });
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });
    
    quickQuestions.forEach(btn => {
        btn.addEventListener('click', function() {
            const question = this.textContent;
            aiInput.value = question;
            sendBtn.click();
        });
    });
    
    // Инициализация чата
    addMessage('Здравствуйте! Я цифровой помощник Газпром. Чем могу помочь?');
}