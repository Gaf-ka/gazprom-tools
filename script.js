// Основной скрипт для навигации и базовой функциональности
document.addEventListener('DOMContentLoaded', function() {
    // Переключение между страницами
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Удаляем активный класс у всех ссылок и страниц
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            
            // Добавляем активный класс текущей ссылке и странице
            this.classList.add('active');
            document.getElementById(targetPage).classList.add('active');
            
            // Прокрутка вверх
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
    
    // Инициализация загрузки тренажёров
    initTrainers();
    
    // Инициализация ИИ помощника
    initAIAssistant();
    
    // Добавляем анимации к некоторым элементам
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Инициализация инструментов
    initTools();
});

function initTools() {
    const toolCards = document.querySelectorAll('.tool-card');
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
}

function loadToolContent(tool) {
    const toolContent = document.getElementById('tool-content');
    
    switch(tool) {
        case 'converter':
            toolContent.innerHTML = `
                <h3><i class="fas fa-exchange-alt"></i> Конвертер единиц</h3>
                <div class="converter-container">
                    <div class="converter-row">
                        <input type="number" id="converter-value" placeholder="Значение" class="converter-input">
                        <select id="converter-from" class="converter-select">
                            <option value="m">Метры</option>
                            <option value="km">Километры</option>
                            <option value="cm">Сантиметры</option>
                            <option value="mm">Миллиметры</option>
                        </select>
                        <span class="converter-arrow"><i class="fas fa-arrow-right"></i></span>
                        <select id="converter-to" class="converter-select">
                            <option value="m">Метры</option>
                            <option value="km">Километры</option>
                            <option value="cm">Сантиметры</option>
                            <option value="mm">Миллиметры</option>
                        </select>
                        <button id="convert-btn" class="btn"><i class="fas fa-exchange-alt"></i> Конвертировать</button>
                    </div>
                    <div id="converter-result" class="converter-result">
                        Результат появится здесь
                    </div>
                </div>
            `;
            
            // Добавляем обработчик для кнопки конвертации
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
                        <button id="add-meeting" class="btn"><i class="fas fa-plus"></i> Добавить встречу</button>
                    </div>
                    <div class="meeting-list">
                        <h4>Запланированные встречи:</h4>
                        <ul id="meetings">
                            <!-- Встречи будут добавляться сюда -->
                        </ul>
                    </div>
                </div>
            `;
            
            // Обработчик добавления встречи
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
                
                // Очищаем поля формы
                document.getElementById('meeting-title').value = '';
                document.getElementById('meeting-date').value = '';
                document.getElementById('meeting-time').value = '';
                document.getElementById('meeting-duration').value = '30';
                
                // Добавляем обработчик удаления
                meetingItem.querySelector('.delete-meeting').addEventListener('click', function() {
                    meetingItem.remove();
                });
            });
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
                        <button id="generate-doc" class="btn"><i class="fas fa-file-download"></i> Сгенерировать документ</button>
                    </div>
                    <div class="doc-preview">
                        <h4>Предпросмотр:</h4>
                        <div id="doc-preview-content" class="doc-preview-content">
                            <!-- Документ будет отображаться здесь -->
                        </div>
                    </div>
                </div>
            `;
            
            // Обработчик генерации документа
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
            
            // Устанавливаем текущую дату по умолчанию
            document.getElementById('doc-date').valueAsDate = new Date();
            break;
    }
}

// Вспомогательные функции для инструментов
function convertUnits(value, from, to) {
    // Конвертация длины
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