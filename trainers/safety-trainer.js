// Тренажёр по технике безопасности
const safetyQuestions = [
    {
        scenario: "Вы обнаружили утечку газа на производственном объекте. Ваши действия:",
        options: [
            "Немедленно сообщить в аварийную службу и эвакуировать персонал",
            "Попытаться самостоятельно устранить утечку",
            "Продолжить работу, если утечка незначительная"
        ],
        correct: 0,
        explanation: "При обнаружении утечки газа необходимо немедленно сообщить в аварийную службу по телефону 112 или внутреннему номеру 911, после чего организовать эвакуацию персонала из опасной зоны. Самостоятельные попытки устранения запрещены."
    },
    {
        scenario: "При работе на высоте вы заметили, что страховочный трос имеет повреждения. Что делать?",
        options: [
            "Продолжить работу, соблюдая осторожность",
            "Немедленно прекратить работу и сообщить ответственному за ТБ",
            "Заменить трос самостоятельно, если есть запасной"
        ],
        correct: 1,
        explanation: "При обнаружении неисправности СИЗ (средств индивидуальной защиты) необходимо немедленно прекратить работу и сообщить ответственному за технику безопасности. Использование повреждённого оборудования запрещено."
    }
];

let currentSafetyQuestion = 0;

function initSafetyTrainer() {
    displaySafetyQuestion();
    
    document.querySelector('#safety-trainer .check-safety').addEventListener('click', checkSafetyAnswer);
}

function displaySafetyQuestion() {
    if (currentSafetyQuestion >= safetyQuestions.length) {
        currentSafetyQuestion = 0;
    }
    
    const question = safetyQuestions[currentSafetyQuestion];
    const container = document.querySelector('#safety-trainer .safety-scenario');
    
    container.innerHTML = `
        <p>${question.scenario}</p>
        <div class="safety-options">
            ${question.options.map((opt, i) => `
                <label>
                    <input type="radio" name="safety-option" value="${i === question.correct ? 'correct' : 'wrong'}">
                    ${opt}
                </label>
            `).join('')}
        </div>
        <button class="btn check-safety">Проверить</button>
        <div class="safety-feedback"></div>
    `;
    
    container.querySelector('.check-safety').addEventListener('click', checkSafetyAnswer);
}

function checkSafetyAnswer() {
    const question = safetyQuestions[currentSafetyQuestion];
    const selected = document.querySelector('input[name="safety-option"]:checked');
    const feedback = document.querySelector('#safety-trainer .safety-feedback');
    
    if (!selected) {
        feedback.textContent = 'Пожалуйста, выберите вариант ответа';
        feedback.style.color = 'var(--accent-color)';
        return;
    }
    
    if (selected.value === 'correct') {
        feedback.innerHTML = `<strong>Правильно!</strong> ${question.explanation}`;
        feedback.style.color = 'var(--primary-color)';
    } else {
        feedback.innerHTML = `<strong>Неверно.</strong> ${question.explanation}`;
        feedback.style.color = 'var(--accent-color)';
    }
    
    currentSafetyQuestion++;
    setTimeout(displaySafetyQuestion, 4000);
}

document.addEventListener('DOMContentLoaded', initSafetyTrainer);