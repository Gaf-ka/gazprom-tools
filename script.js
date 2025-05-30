document.addEventListener('DOMContentLoaded', function() {
    // Навигация по страницам
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            this.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Инициализация ИИ помощника
    initAIAssistant();
    
    // Инициализация инструментов
    initTools();
    
    // Инициализация тренажёров
    initTrainers();
    
    // Инициализация визуализации данных
    initDataVisualizer();
});

function initAIAssistant() {
    const aiContainer = document.querySelector('.ai-assistant-container');
    const aiToggleBtn = document.querySelector('.ai-toggle-btn');
    const aiCloseBtn = document.querySelector('.ai-close-btn');
    
    // Переключение видимости помощника
    aiToggleBtn.addEventListener('click', function() {
        aiContainer.classList.toggle('active');
    });
    
    aiCloseBtn.addEventListener('click', function() {
        aiContainer.classList.remove('active');
    });
    
    // Быстрые вопросы
    const quickQuestions = [
        "Как оформить служебную записку?",
        "Где найти шаблоны документов?",
        "Как получить доступ к корпоративному порталу?",
        "Какие новые проекты запущены в 2025 году?",
        "Как оформить командировку?",
        "Где найти регламенты работы?",
        "Как подключиться к VPN?",
        "Какие льготы предусмотрены для сотрудников?",
        "Как подать заявку на обучение?",
        "Кто отвечает за техническую поддержку?"
    ];
    
    // Заполняем быстрые вопросы
    const quickQuestionsGrid = document.querySelector('.quick-questions-grid');
    quickQuestions.forEach(question => {
        const quickQuestion = document.createElement('div');
        quickQuestion.classList.add('quick-question');
        quickQuestion.textContent = question;
        quickQuestion.addEventListener('click', function() {
            sendMessage(question);
        });
        quickQuestionsGrid.appendChild(quickQuestion);
    });
    
    // Обработчик отправки сообщения
    const aiSend = document.getElementById('ai-send');
    const aiInput = document.getElementById('ai-question');
    
    aiSend.addEventListener('click', function() {
        const question = aiInput.value.trim();
        if (question) {
            sendMessage(question);
            aiInput.value = '';
        }
    });
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const question = aiInput.value.trim();
            if (question) {
                sendMessage(question);
                aiInput.value = '';
            }
        }
    });
    
    function sendMessage(question) {
        const aiMessages = document.querySelector('.ai-messages');
        
        // Добавляем вопрос пользователя
        const userMessage = document.createElement('div');
        userMessage.classList.add('ai-message', 'ai-question');
        userMessage.innerHTML = `<p>${question}</p>`;
        aiMessages.appendChild(userMessage);
        
        // Имитируем задержку ответа
        setTimeout(() => {
            const answer = getAnswer(question);
            
            const aiResponse = document.createElement('div');
            aiResponse.classList.add('ai-message', 'ai-response');
            aiResponse.innerHTML = `<p>${answer}</p>`;
            aiMessages.appendChild(aiResponse);
            
            // Прокрутка к последнему сообщению
            aiMessages.scrollTop = aiMessages.scrollHeight;
        }, 500);
    }
    
    function getAnswer(question) {
        const knowledgeBase = {
            "оформ.*служебн.*записк": "Служебная записка оформляется по стандартному шаблону, который можно найти в разделе 'Инструменты' -> 'Генератор документов'. В 2025 году все служебные записки должны быть оформлены в электронном виде и подписаны ЭЦП.",
            "шаблон.*документ": "Все актуальные шаблоны документов доступны в разделе 'Инструменты' -> 'Генератор документов'. Там вы найдёте шаблоны служебных записок, отчётов, приказов и других документов, соответствующие стандартам Газпрома 2025 года.",
            "корпоративн.*порта": "Корпоративный портал доступен по адресу intranet.gazprom.ru. Для входа используйте ваш корпоративный логин и пароль. В 2025 году был обновлён интерфейс портала - если у вас возникли проблемы с доступом, обратитесь в IT-поддержку.",
            "нов.*проект.*2025": "В 2025 году Газпром запустил несколько новых проектов: 1) Цифровизация процессов учёта, 2) Внедрение ИИ-аналитики на всех этапах работы, 3) Программа 'Зелёный офис' по сокращению углеродного следа. Подробности можно найти на корпоративном портале.",
            "оформ.*командиров": "Для оформления командировки в 2025 году необходимо: 1) Заполнить заявку в системе 'Командировки', 2) Получить одобрение руководителя, 3) Оформить билеты через корпоративного провайдера. Все расходы должны быть согласованы заранее. Подробная инструкция доступна на портале.",
            "регламент.*работ": "Все актуальные регламенты работы доступны в разделе 'Документы' на корпоративном портале. В 2025 году были обновлены регламенты по работе с данными и информационной безопасности.",
            "подключ.*vpn": "Для подключения к VPN в 2025 году необходимо установить приложение 'Газпром Secure Access' с корпоративного магазина приложений. После установки введите ваш логин и пароль. При возникновении проблем обратитесь в IT-поддержку по тел. 5555.",
            "льгот.*сотрудник": "В 2025 году для сотрудников Газпрома предусмотрены следующие льготы: медицинское страхование, корпоративный пенсионный план, льготные путёвки в санатории, компенсация занятий спортом и дополнительные дни отпуска за стаж. Подробности в отделе кадров.",
            "заявк.*обучен": "Для подачи заявки на обучение в 2025 году необходимо: 1) Выбрать программу в каталоге на портале, 2) Получить одобрение руководителя, 3) Зарегистрироваться через систему 'Корпоративный университет'. Все обучение проводится онлайн или в корпоративном учебном центре.",
            "техническ.*поддерж": "Техническая поддержка доступна по телефону 5555 (внутренний) или через тикет-систему на корпоративном портале. В 2025 году время ответа сокращено до 15 минут для критичных вопросов. Перед обращением проверьте раздел 'Частые вопросы'.",
            "привет|здравств": "Здравствуйте! Я ваш цифровой помощник. Чем могу помочь?",
            "спасибо|благодар": "Пожалуйста! Если у вас есть ещё вопросы, обращайтесь. В 2025 году мы стремимся сделать вашу работу максимально комфортной.",
            "пока|до свидан": "До свидания! Если возникнут вопросы, я всегда готов помочь. Хорошего дня!",
            "": "Извините, я не расслышал ваш вопрос. Можете повторить?"
        };
        
        question = question.toLowerCase();
        let answer = "Извините, я не могу ответить на этот вопрос. Попробуйте переформулировать или обратитесь в соответствующее подразделение. В 2025 году все актуальные контакты доступны на корпоративном портале.";
        
        for (const [pattern, response] of Object.entries(knowledgeBase)) {
            if (new RegExp(pattern, 'i').test(question)) {
                answer = response;
                break;
            }
        }
        
        return answer;
    }
}

function initTools() {
    const toolCards = document.querySelectorAll('.tool-card button');
    const toolContent = document.getElementById('tool-content');
    
    toolCards.forEach(card => {
        card.addEventListener('click', function() {
            const tool = this.getAttribute('data-tool');
            loadToolContent(tool);
        });
    });
    
    // Загружаем первый инструмент по умолчанию
    if (toolCards.length > 0) {
        loadToolContent(toolCards[0].getAttribute('data-tool'));
    }
    
    function loadToolContent(tool) {
        switch(tool) {
            case 'converter':
                toolContent.innerHTML = `
                    <h3><i class="fas fa-exchange-alt"></i> Конвертер единиц</h3>
                    <div class="converter-container">
                        <div class="converter-row">
                            <input type="number" id="converter-value" placeholder="Значение" class="form-control">
                            <select id="converter-from" class="form-control">
                                <option value="m">Метры</option>
                                <option value="km">Километры</option>
                                <option value="cm">Сантиметры</option>
                                <option value="mm">Миллиметры</option>
                            </select>
                            <span class="converter-arrow"><i class="fas fa-arrow-right"></i></span>
                            <select id="converter-to" class="form-control">
                                <option value="m">Метры</option>
                                <option value="km">Километры</option>
                                <option value="cm">Сантиметры</option>
                                <option value="mm">Миллиметры</option>
                            </select>
                            <button id="convert-btn" class="btn btn-primary"><i class="fas fa-exchange-alt"></i> Конвертировать</button>
                        </div>
                        <div id="converter-result" class="converter-result">
                            Результат появится здесь
                        </div>
                    </div>
                `;
                
                document.getElementById('convert-btn').addEventListener('click', function() {
                    const value = parseFloat(document.getElementById('converter-value').value);
                    const from = document.getElementById('converter-from').value;
                    const to = document.getElementById('converter-to').value;
                    
                    if (isNaN(value)) {
                        document.getElementById('converter-result').textContent = 'Введите корректное число';
                        return;
                    }
                    
                    const result = convertUnits(value, from, to);
                    document.getElementById('converter-result').textContent = `${value} ${getUnitName(from)} = ${result.toFixed(4)} ${getUnitName(to)}`;
                });
                break;
                
            case 'meeting':
                toolContent.innerHTML = `
                    <h3><i class="fas fa-calendar-check"></i> Планировщик встреч</h3>
                    <div class="meeting-planner">
                        <div class="meeting-form">
                            <div class="form-group">
                                <label for="meeting-title">Название встречи:</label>
                                <input type="text" id="meeting-title" class="form-control" placeholder="Введите название">
                            </div>
                            <div class="form-group">
                                <label for="meeting-date">Дата:</label>
                                <input type="date" id="meeting-date" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="meeting-time">Время:</label>
                                <input type="time" id="meeting-time" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="meeting-duration">Длительность (мин):</label>
                                <input type="number" id="meeting-duration" class="form-control" value="30" min="15" max="240">
                            </div>
                            <button id="add-meeting" class="btn btn-primary"><i class="fas fa-plus"></i> Добавить встречу</button>
                        </div>
                        <div class="meeting-list">
                            <h4>Запланированные встречи:</h4>
                            <ul id="meetings">
                                <!-- Встречи будут добавляться сюда -->
                            </ul>
                        </div>
                    </div>
                `;
                
                document.getElementById('add-meeting').addEventListener('click', function() {
                    const title = document.getElementById('meeting-title').value;
                    const date = document.getElementById('meeting-date').value;
                    const time = document.getElementById('meeting-time').value;
                    const duration = document.getElementById('meeting-duration').value;
                    
                    if (!title || !date || !time || !duration) {
                        alert('Заполните все поля');
                        return;
                    }
                    
                    const meetingItem = document.createElement('li');
                    meetingItem.innerHTML = `
                        <div class="meeting-item">
                            <div class="meeting-info">
                                <strong>${title}</strong>
                                <span>${formatDate(date)} в ${time}, ${duration} мин</span>
                            </div>
                            <button class="delete-meeting"><i class="fas fa-trash"></i></button>
                        </div>
                    `;
                    
                    document.getElementById('meetings').appendChild(meetingItem);
                    
                    document.getElementById('meeting-title').value = '';
                    document.getElementById('meeting-date').value = '';
                    document.getElementById('meeting-time').value = '';
                    document.getElementById('meeting-duration').value = '30';
                    
                    meetingItem.querySelector('.delete-meeting').addEventListener('click', function() {
                        meetingItem.remove();
                    });
                });
                
                document.getElementById('meeting-date').valueAsDate = new Date();
                break;
                
            case 'doc-gen':
                toolContent.innerHTML = `
                    <h3><i class="fas fa-file-contract"></i> Генератор документов</h3>
                    <div class="doc-generator">
                        <div class="doc-form">
                            <div class="form-group">
                                <label for="doc-type">Тип документа:</label>
                                <select id="doc-type" class="form-control">
                                    <option value="memo">Служебная записка</option>
                                    <option value="report">Отчёт</option>
                                    <option value="order">Приказ</option>
                                    <option value="contract">Договор</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="doc-title">Заголовок:</label>
                                <input type="text" id="doc-title" class="form-control" placeholder="Введите заголовок">
                            </div>
                            <div class="form-group">
                                <label for="doc-author">Автор:</label>
                                <input type="text" id="doc-author" class="form-control" placeholder="Ваше имя и должность">
                            </div>
                            <div class="form-group">
                                <label for="doc-date">Дата:</label>
                                <input type="date" id="doc-date" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="doc-content">Содержание:</label>
                                <textarea id="doc-content" class="form-control" rows="5" placeholder="Введите содержание документа"></textarea>
                            </div>
                            <button id="generate-doc" class="btn btn-primary"><i class="fas fa-file-download"></i> Сгенерировать документ</button>
                        </div>
                        <div class="doc-preview">
                            <h4>Предпросмотр:</h4>
                            <div id="doc-preview-content" class="doc-preview-content">
                                <!-- Документ будет отображаться здесь -->
                            </div>
                        </div>
                    </div>
                `;
                
                document.getElementById('generate-doc').addEventListener('click', function() {
                    const type = document.getElementById('doc-type').value;
                    const title = document.getElementById('doc-title').value;
                    const author = document.getElementById('doc-author').value;
                    const date = document.getElementById('doc-date').value;
                    const content = document.getElementById('doc-content').value;
                    
                    if (!title || !author || !date || !content) {
                        alert('Заполните все обязательные поля');
                        return;
                    }
                    
                    let docHtml = `
                        <div class="doc-template">
                            <div class="doc-header">
                                <h2>${getDocTypeName(type)}</h2>
                                <p>${title}</p>
                            </div>
                            <div class="doc-meta">
                                <p><strong>Автор:</strong> ${author}</p>
                                <p><strong>Дата:</strong> ${formatDate(date)}</p>
                            </div>
                            <div class="doc-body">
                                ${content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                            </div>
                            <div class="doc-footer">
                                <p>Газпром, ${new Date().getFullYear()}</p>
                            </div>
                        </div>
                    `;
                    
                    document.getElementById('doc-preview-content').innerHTML = docHtml;
                });
                
                document.getElementById('doc-date').valueAsDate = new Date();
                break;
                
            case 'logistics':
                toolContent.innerHTML = `
                    <h3><i class="fas fa-truck"></i> Логистика</h3>
                    <div class="logistics-container">
                        <div class="logistics-form">
                            <div class="form-group">
                                <label for="tracking-number">Номер отслеживания:</label>
                                <input type="text" id="tracking-number" class="form-control" placeholder="Введите номер груза">
                            </div>
                            <button id="track-btn" class="btn btn-primary"><i class="fas fa-search"></i> Отследить</button>
                        </div>
                        <div class="logistics-result">
                            <div id="tracking-result">
                                Введите номер груза для отслеживания
                            </div>
                        </div>
                    </div>
                `;
                
                document.getElementById('track-btn').addEventListener('click', function() {
                    const trackingNumber = document.getElementById('tracking-number').value.trim();
                    
                    if (!trackingNumber) {
                        alert('Введите номер отслеживания');
                        return;
                    }
                    
                    // Имитация запроса к серверу
                    setTimeout(() => {
                        document.getElementById('tracking-result').innerHTML = `
                            <div class="tracking-info">
                                <h4>Информация о грузе #${trackingNumber}</h4>
                                <div class="tracking-status">
                                    <div class="status-badge delivered">
                                        <i class="fas fa-check-circle"></i> В пути
                                    </div>
                                </div>
                                <div class="tracking-timeline">
                                    <div class="timeline-item active">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <p>Груз принят на склад</p>
                                            <span>${formatDate(new Date())} 10:00</span>
                                        </div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <p>Ожидается отправка</p>
                                            <span>${formatDate(new Date(Date.now() + 86400000))} 10:00</span>
                                        </div>
                                    </div>
                                    <div class="timeline-item">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-content">
                                            <p>Ожидается доставка</p>
                                            <span>${formatDate(new Date(Date.now() + 172800000))} 10:00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    }, 1000);
                });
                break;
        }
    }
    
    function convertUnits(value, from, to) {
        const units = {
            m: 1,
            km: 1000,
            cm: 0.01,
            mm: 0.001
        };
        
        return value * units[from] / units[to];
    }
    
    function getUnitName(unit) {
        const names = {
            m: 'м',
            km: 'км',
            cm: 'см',
            mm: 'мм'
        };
        
        return names[unit];
    }
    
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    }
    
    function getDocTypeName(type) {
        const names = {
            memo: 'Служебная записка',
            report: 'Отчёт',
            order: 'Приказ',
            contract: 'Договор'
        };
        
        return names[type];
    }
}

function initTrainers() {
    const trainersGrid = document.querySelector('.trainers-grid');
    const trainerContainer = document.querySelector('.trainer-container');
    
    const trainers = [
        {
            id: 'safety',
            title: 'Техника безопасности',
            description: 'Проверьте знания правил техники безопасности на производстве'
        },
        {
            id: 'documents',
            title: 'Работа с документами',
            description: 'Тренажёр по оформлению корпоративных документов'
        },
        {
            id: 'it',
            title: 'IT-безопасность',
            description: 'Проверка знаний по информационной безопасности'
        },
        {
            id: 'communication',
            title: 'Деловая коммуникация',
            description: 'Тренировка навыков делового общения'
        },
        {
            id: 'ecology',
            title: 'Экологическая безопасность',
            description: 'Проверка знаний экологических стандартов'
        },
        {
            id: 'corporate-culture',
            title: 'Корпоративная культура',
            description: 'Знание ценностей и традиций компании'
        },
        {
            id: 'project-management',
            title: 'Управление проектами',
            description: 'Основы управления проектами в Газпроме'
        },
        {
            id: 'finance',
            title: 'Финансовая грамотность',
            description: 'Основы финансовых процессов компании'
        },
        {
            id: 'hr',
            title: 'HR-процессы',
            description: 'Работа с кадровыми вопросами'
        },
        {
            id: 'innovation',
            title: 'Инновации 2025',
            description: 'Новые технологии и процессы в компании'
        }
    ];
    
    // Заполняем список тренажёров
    trainers.forEach(trainer => {
        const trainerCard = document.createElement('div');
        trainerCard.classList.add('trainer-card');
        trainerCard.innerHTML = `
            <h3>${trainer.title}</h3>
            <p>${trainer.description}</p>
        `;
        trainerCard.addEventListener('click', () => loadTrainer(trainer));
        trainersGrid.appendChild(trainerCard);
    });
    
    // Загружаем первый тренажёр по умолчанию
    if (trainers.length > 0) {
        loadTrainer(trainers[0]);
    }
    
    function loadTrainer(trainer) {
        // В реальном проекте здесь была бы загрузка конкретного тренажёра
        trainerContainer.innerHTML = `
            <div class="trainer-header">
                <h3>${trainer.title}</h3>
                <p>${trainer.description}</p>
            </div>
            <div class="trainer-content">
                <p>Выберите тренажёр из списка слева для начала обучения. Каждый тренажёр содержит вопросы по соответствующей теме и помогает закрепить знания.</p>
                <p>После прохождения тренажёра вы увидите свой результат и сможете повторить попытку для улучшения показателей.</p>
            </div>
        `;
    }
}

function initDataVisualizer() {
    // Инициализация будет в data-visualizer.js
}