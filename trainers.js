// Скрипт для тренажёров
document.addEventListener('DOMContentLoaded', function() {
    initTrainers();
});

function initTrainers() {
    const trainersList = document.querySelector('.trainers-list');
    const trainerContainer = document.querySelector('.trainer-container');
    
    // Список тренажёров
    const trainers = [
        {
            id: 'safety',
            title: 'Техника безопасности',
            description: 'Проверьте знания правил техники безопасности на производстве',
            questions: [
                {
                    question: "Что необходимо сделать перед началом работы с оборудованием?",
                    options: [
                        "Проверить его исправность",
                        "Пройти инструктаж",
                        "Надеть средства индивидуальной защиты",
                        "Все перечисленное"
                    ],
                    answer: 3,
                    explanation: "Перед началом работы с оборудованием необходимо выполнить все перечисленные действия для обеспечения безопасности."
                },
                {
                    question: "Какой цвет сигнальной одежды указывает на высокую видимость?",
                    options: [
                        "Синий",
                        "Зеленый",
                        "Оранжевый или желтый",
                        "Черный"
                    ],
                    answer: 2,
                    explanation: "Оранжевый или желтый цвета обеспечивают наилучшую видимость на производстве."
                },
                {
                    question: "Что делать при обнаружении утечки газа?",
                    options: [
                        "Попытаться устранить самостоятельно",
                        "Немедленно сообщить ответственному и покинуть зону",
                        "Продолжить работу, если запах слабый",
                        "Зажечь спичку для проверки"
                    ],
                    answer: 1,
                    explanation: "При обнаружении утечки газа необходимо немедленно сообщить ответственному и покинуть опасную зону."
                }
            ]
        },
        {
            id: 'documents',
            title: 'Работа с документами',
            description: 'Тренажёр по оформлению корпоративных документов',
            questions: [
                {
                    question: "Какой шрифт используется в официальных документах Газпрома?",
                    options: [
                        "Times New Roman 14",
                        "Arial 12",
                        "Calibri 11",
                        "Verdana 10"
                    ],
                    answer: 2,
                    explanation: "Стандарт Газпрома 2025 года предписывает использование шрифта Calibri 11pt для официальных документов."
                },
                {
                    question: "Куда отправляется электронная служебная записка после подписания?",
                    options: [
                        "На личную почту руководителя",
                        "В систему электронного документооборота",
                        "В чат команды",
                        "На корпоративный портал"
                    ],
                    answer: 1,
                    explanation: "Все официальные документы после подписания ЭЦП направляются в систему электронного документооборота."
                },
                {
                    question: "Сколько дней даётся на ответ по входящему документу?",
                    options: [
                        "1 рабочий день",
                        "3 рабочих дня",
                        "5 рабочих дней",
                        "10 рабочих дней"
                    ],
                    answer: 1,
                    explanation: "Стандартный срок ответа по входящим документам - 3 рабочих дня согласно регламенту 2025 года."
                }
            ]
        },
        {
            id: 'it',
            title: 'IT-безопасность',
            description: 'Проверка знаний по информационной безопасности',
            questions: [
                {
                    question: "Как часто нужно менять корпоративный пароль?",
                    options: [
                        "Каждые 30 дней",
                        "Каждые 90 дней",
                        "Только при утечке",
                        "Раз в год"
                    ],
                    answer: 1,
                    explanation: "Согласно политике безопасности 2025 года, пароли необходимо менять каждые 90 дней."
                },
                {
                    question: "Что делать при получении подозрительного письма?",
                    options: [
                        "Открыть и проверить",
                        "Удалить",
                        "Переслать в IT-безопасность",
                        "Ответить на него"
                    ],
                    answer: 2,
                    explanation: "Подозрительные письма необходимо пересылать в отдел IT-безопасности для проверки."
                },
                {
                    question: "Можно ли использовать личный USB-накопитель на рабочем компьютере?",
                    options: [
                        "Да, без ограничений",
                        "Только после проверки антивирусом",
                        "Нет, это запрещено",
                        "Только с разрешения руководителя"
                    ],
                    answer: 2,
                    explanation: "Использование личных USB-накопителей на рабочих компьютерах запрещено политикой безопасности."
                }
            ]
        },
        {
            id: 'communication',
            title: 'Деловая коммуникация',
            description: 'Тренировка навыков делового общения',
            questions: [
                {
                    question: "Как лучше начать деловое письмо?",
                    options: [
                        "Привет, коллега!",
                        "Уважаемый Иван Иванович!",
                        "Доброго времени суток!",
                        "Здравствуйте, уважаемые коллеги!"
                    ],
                    answer: 1,
                    explanation: "В деловой переписке 2025 года рекомендуется использовать официальное обращение по имени-отчеству."
                },
                {
                    question: "Сколько времени обычно отводится на презентацию проекта?",
                    options: [
                        "5-7 минут",
                        "10-15 минут",
                        "20-30 минут",
                        "Сколько потребуется"
                    ],
                    answer: 1,
                    explanation: "Оптимальное время презентации проекта - 10-15 минут, согласно корпоративным стандартам."
                },
                {
                    question: "Что делать, если вы опоздали на встречу?",
                    options: [
                        "Тихо зайти и не привлекать внимания",
                        "Предупредить организатора и извиниться",
                        "Не приходить вообще",
                        "Сказать, что встреча началась раньше"
                    ],
                    answer: 1,
                    explanation: "При опоздании необходимо предупредить организатора, извиниться и по возможности присоединиться, не мешая другим."
                }
            ]
        },
        {
            id: 'ecology',
            title: 'Экологическая безопасность',
            description: 'Проверка знаний экологических стандартов',
            questions: [
                {
                    question: "Какой цвет у контейнера для бумаги в офисах Газпрома?",
                    options: [
                        "Синий",
                        "Зеленый",
                        "Красный",
                        "Желтый"
                    ],
                    answer: 0,
                    explanation: "С 2025 года в офисах Газпрома синие контейнеры предназначены для бумаги в рамках программы переработки."
                },
                {
                    question: "Что делать с использованными батарейками?",
                    options: [
                        "Выбросить в общий мусор",
                        "Сдать в специальный пункт приема",
                        "Хранить на рабочем месте",
                        "Закопать"
                    ],
                    answer: 1,
                    explanation: "Использованные батарейки необходимо сдавать в специальные пункты приема из-за их токсичности."
                },
                {
                    question: "Как экономить электроэнергию в офисе?",
                    options: [
                        "Выключать свет при выходе",
                        "Использовать энергосберегающие лампы",
                        "Отключать неиспользуемые устройства",
                        "Все перечисленное"
                    ],
                    answer: 3,
                    explanation: "Все перечисленные способы помогают экономить электроэнергию и соответствуют программе 'Зелёный офис' 2025 года."
                }
            ]
        },
        {
            id: 'corporate-culture',
            title: 'Корпоративная культура',
            description: 'Знание ценностей и традиций компании',
            questions: [
                {
                    question: "Какая миссия у Газпрома в 2025 году?",
                    options: [
                        "Максимизация прибыли",
                        "Эффективное, надежное и экологичное энергообеспечение",
                        "Завоевание мирового рынка",
                        "Сокращение издержек"
                    ],
                    answer: 1,
                    explanation: "Миссия Газпрома - эффективное, надежное и экологичное энергообеспечение потребителей."
                },
                {
                    question: "Какое мероприятие проводится для новых сотрудников?",
                    options: [
                        "Корпоративный праздник",
                        "Программа адаптации",
                        "Экзамен по истории компании",
                        "Турнир по гольфу"
                    ],
                    answer: 1,
                    explanation: "Для новых сотрудников проводится программа адаптации, включающая знакомство с компанией и коллегами."
                },
                {
                    question: "Как часто проводятся опросы сотрудников?",
                    options: [
                        "Раз в месяц",
                        "Раз в квартал",
                        "Раз в год",
                        "По решению руководства"
                    ],
                    answer: 2,
                    explanation: "Анкетирование сотрудников проводится ежегодно для оценки удовлетворенности и сбора предложений."
                }
            ]
        },
        {
            id: 'project-management',
            title: 'Управление проектами',
            description: 'Основы управления проектами в Газпроме',
            questions: [
                {
                    question: "Какой метод управления проектами чаще используется?",
                    options: [
                        "Waterfall",
                        "Agile",
                        "Hybrid",
                        "Scrum"
                    ],
                    answer: 2,
                    explanation: "В 2025 году Газпром использует гибридный подход, сочетающий элементы Agile и классического управления."
                },
                {
                    question: "Кто утверждает план проекта?",
                    options: [
                        "Руководитель проекта",
                        "Куратор от заказчика",
                        "Технический комитет",
                        "Все перечисленные"
                    ],
                    answer: 3,
                    explanation: "План проекта утверждается совместно руководителем проекта, куратором и техническим комитетом."
                },
                {
                    question: "Какой инструмент используется для управления задачами?",
                    options: [
                        "Microsoft Project",
                        "Jira",
                        "Корпоративная система GP-Tasks",
                        "Trello"
                    ],
                    answer: 2,
                    explanation: "С 2025 года все проекты ведутся в корпоративной системе GP-Tasks."
                }
            ]
        },
        {
            id: 'finance',
            title: 'Финансовая грамотность',
            description: 'Основы финансовых процессов компании',
            questions: [
                {
                    question: "Какой срок утверждения бюджета проекта?",
                    options: [
                        "1 неделя",
                        "2 недели",
                        "1 месяц",
                        "3 месяца"
                    ],
                    answer: 1,
                    explanation: "Бюджет проекта утверждается в течение 2 недель с момента подачи заявки."
                },
                {
                    question: "Куда подавать заявку на командировочные расходы?",
                    options: [
                        "В бухгалтерию",
                        "В финансовый отдел",
                        "Через систему 'Командировки'",
                        "Руководителю"
                    ],
                    answer: 2,
                    explanation: "Все командировочные расходы оформляются через систему 'Командировки' с 2025 года."
                },
                {
                    question: "Как часто обновляются финансовые отчеты?",
                    options: [
                        "Ежедневно",
                        "Еженедельно",
                        "Ежемесячно",
                        "Ежеквартально"
                    ],
                    answer: 2,
                    explanation: "Финансовые отчеты обновляются ежемесячно и доступны в корпоративной системе."
                }
            ]
        },
        {
            id: 'hr',
            title: 'HR-процессы',
            description: 'Работа с кадровыми вопросами',
            questions: [
                {
                    question: "Как подать заявку на отпуск?",
                    options: [
                        "Устно руководителю",
                        "Через систему 'Кадры'",
                        "По электронной почте",
                        "В отделе кадров"
                    ],
                    answer: 1,
                    explanation: "С 2025 года все заявки на отпуск подаются через систему 'Кадры'."
                },
                {
                    question: "Куда обращаться по вопросам зарплаты?",
                    options: [
                        "В бухгалтерию",
                        "К руководителю",
                        "В HR-отдел",
                        "В службу поддержки"
                    ],
                    answer: 0,
                    explanation: "Все вопросы по начислениям зарплаты решаются в бухгалтерии."
                },
                {
                    question: "Как часто проводятся оценки эффективности?",
                    options: [
                        "Раз в месяц",
                        "Раз в полгода",
                        "Раз в год",
                        "По необходимости"
                    ],
                    answer: 1,
                    explanation: "Оценка эффективности сотрудников проводится раз в полгода."
                }
            ]
        },
        {
            id: 'innovation',
            title: 'Инновации 2025',
            description: 'Новые технологии и процессы в компании',
            questions: [
                {
                    question: "Какая система внедрена для цифровизации документов?",
                    options: [
                        "GP-Docs",
                        "GP-Archive",
                        "GP-EDM",
                        "GP-Cloud"
                    ],
                    answer: 2,
                    explanation: "Система GP-EDM (Electronic Document Management) внедрена для полной цифровизации документов."
                },
                {
                    question: "Какой новый инструмент аналитики используется?",
                    options: [
                        "GP-Analytics",
                        "GP-Insight",
                        "GP-Data",
                        "GP-Vision"
                    ],
                    answer: 1,
                    explanation: "GP-Insight - новый инструмент бизнес-аналитики, внедренный в 2025 году."
                },
                {
                    question: "Какое нововведение для удаленной работы?",
                    options: [
                        "GP-Remote",
                        "GP-Connect",
                        "GP-WorkAnywhere",
                        "GP-VirtualOffice"
                    ],
                    answer: 3,
                    explanation: "GP-VirtualOffice - платформа для комфортной удаленной работы, запущенная в 2025 году."
                }
            ]
        }
    ];
    
    // Заполняем список тренажёров
    trainers.forEach(trainer => {
        const trainerItem = document.createElement('div');
        trainerItem.classList.add('trainer-item');
        trainerItem.innerHTML = `
            <h3>${trainer.title}</h3>
            <p>${trainer.description}</p>
        `;
        trainerItem.addEventListener('click', () => loadTrainer(trainer));
        trainersList.appendChild(trainerItem);
    });
    
    // Загружаем первый тренажёр по умолчанию
    if (trainers.length > 0) {
        loadTrainer(trainers[0]);
    }
    
    function loadTrainer(trainer) {
        trainerContainer.innerHTML = `
            <div class="trainer-header">
                <h3>${trainer.title}</h3>
                <p>${trainer.description}</p>
            </div>
            <div class="trainer-questions">
                <!-- Вопросы будут добавляться динамически -->
            </div>
            <div class="trainer-results">
                <button id="start-trainer" class="btn">Начать тренажёр</button>
                <div id="trainer-score" class="trainer-score"></div>
            </div>
        `;
        
        const startBtn = document.getElementById('start-trainer');
        startBtn.addEventListener('click', function() {
            startTrainer(trainer);
        });
    }
    
    function startTrainer(trainer) {
        const questionsContainer = document.querySelector('.trainer-questions');
        questionsContainer.innerHTML = '';
        
        let currentQuestion = 0;
        let score = 0;
        
        function showQuestion() {
            if (currentQuestion >= trainer.questions.length) {
                // Показываем результаты
                const percentage = Math.round((score / trainer.questions.length) * 100);
                document.getElementById('trainer-score').innerHTML = `
                    <h4>Результат: ${score} из ${trainer.questions.length} (${percentage}%)</h4>
                    <p>${getResultMessage(percentage)}</p>
                    <button id="restart-trainer" class="btn">Пройти ещё раз</button>
                `;
                
                document.getElementById('restart-trainer').addEventListener('click', function() {
                    startTrainer(trainer);
                });
                
                return;
            }
            
            const question = trainer.questions[currentQuestion];
            const questionElement = document.createElement('div');
            questionElement.classList.add('trainer-question');
            questionElement.innerHTML = `
                <h4>Вопрос ${currentQuestion + 1}: ${question.question}</h4>
                <div class="trainer-options">
                    ${question.options.map((option, index) => `
                        <div class="trainer-option">
                            <input type="radio" name="answer" id="option-${index}" value="${index}">
                            <label for="option-${index}">${option}</label>
                        </div>
                    `).join('')}
                </div>
                <button id="next-question" class="btn">Ответить</button>
            `;
            
            questionsContainer.innerHTML = '';
            questionsContainer.appendChild(questionElement);
            
            document.getElementById('next-question').addEventListener('click', function() {
                const selectedOption = document.querySelector('input[name="answer"]:checked');
                
                if (!selectedOption) {
                    alert('Выберите вариант ответа');
                    return;
                }
                
                const answerIndex = parseInt(selectedOption.value);
                const isCorrect = answerIndex === question.answer;
                
                if (isCorrect) {
                    score++;
                }
                
                // Показываем правильный ответ и объяснение
                questionsContainer.innerHTML = `
                    <div class="trainer-question">
                        <h4>Вопрос ${currentQuestion + 1}: ${question.question}</h4>
                        <div class="trainer-feedback ${isCorrect ? 'correct' : 'incorrect'}">
                            <p>Ваш ответ: ${question.options[answerIndex]}</p>
                            <p>Правильный ответ: ${question.options[question.answer]}</p>
                            <p class="explanation">${question.explanation}</p>
                        </div>
                        <button id="next-question" class="btn">${currentQuestion < trainer.questions.length - 1 ? 'Следующий вопрос' : 'Завершить'}</button>
                    </div>
                `;
                
                currentQuestion++;
                document.getElementById('next-question').addEventListener('click', showQuestion);
            });
        }
        
        showQuestion();
    }
    
    function getResultMessage(percentage) {
        if (percentage >= 90) return 'Отличный результат! Вы прекрасно разбираетесь в теме.';
        if (percentage >= 70) return 'Хороший результат! Есть немного недочетов.';
        if (percentage >= 50) return 'Удовлетворительно. Рекомендуем повторить материал.';
        return 'Плохой результат. Необходимо изучить тему заново.';
    }
}