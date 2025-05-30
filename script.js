// Основная логика приложения
document.addEventListener('DOMContentLoaded', function() {
    // Навигация между страницами
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            
            // Удаляем активный класс у всех ссылок и страниц
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active-page'));
            
            // Добавляем активный класс текущей ссылке и странице
            this.classList.add('active');
            document.getElementById(`${pageId}-page`).classList.add('active-page');
            
            // При переходе на страницу визуализации сбрасываем состояние
            if (pageId === 'data') {
                resetDataVisualizer();
            }
        });
    });
    
    // Инициализация тренажёров
    initTrainers();
    
    // Инициализация ИИ помощника
    initAIAssistant();
    
    // Инициализация визуализации данных
    initDataVisualizer();
});

function resetDataVisualizer() {
    document.querySelector('.file-info').textContent = 'Файл не выбран';
    document.getElementById('report-output').classList.add('hidden');
    const chartCanvas = document.getElementById('data-chart');
    if (chartCanvas.chart) {
        chartCanvas.chart.destroy();
    }
}

function initTrainers() {
    const trainerSelect = document.getElementById('trainer-select');
    const startBtn = document.getElementById('start-trainer');
    const trainerContainers = document.querySelectorAll('.trainer-container');
    
    startBtn.addEventListener('click', function() {
        const selectedTrainer = trainerSelect.value;
        
        trainerContainers.forEach(container => {
            container.classList.add('hidden');
            if (container.id === `${selectedTrainer}-trainer`) {
                container.classList.remove('hidden');
            }
        });
    });
    
    // Инициализация экономического тренажёра
    const economicsCheckBtn = document.querySelector('#economics-trainer .check-answer');
    if (economicsCheckBtn) {
        economicsCheckBtn.addEventListener('click', checkEconomicsAnswer);
    }
    
    // Инициализация тренажёра по ТБ
    const safetyCheckBtn = document.querySelector('#safety-trainer .check-safety');
    if (safetyCheckBtn) {
        safetyCheckBtn.addEventListener('click', checkSafetyAnswer);
    }
}

function checkEconomicsAnswer() {
    const input = document.querySelector('#economics-trainer input');
    const feedback = document.querySelector('#economics-trainer .trainer-feedback');
    const correctAnswersSpan = document.querySelector('#economics-trainer .correct-answers');
    const incorrectAnswersSpan = document.querySelector('#economics-trainer .incorrect-answers');
    
    // Правильный ответ (пример)
    const correctAnswer = 1.37;
    const userAnswer = parseFloat(input.value);
    
    if (isNaN(userAnswer)) {
        feedback.textContent = 'Пожалуйста, введите числовой ответ';
        feedback.style.color = 'var(--accent-color)';
        return;
    }
    
    const tolerance = 0.05;
    if (Math.abs(userAnswer - correctAnswer) < tolerance) {
        feedback.textContent = 'Правильно! Отличная работа.';
        feedback.style.color = 'var(--primary-color)';
        correctAnswersSpan.textContent = parseInt(correctAnswersSpan.textContent) + 1;
    } else {
        feedback.textContent = `Не совсем. Правильный ответ: ${correctAnswer} млн ₽. Попробуйте ещё раз.`;
        feedback.style.color = 'var(--accent-color)';
        incorrectAnswersSpan.textContent = parseInt(incorrectAnswersSpan.textContent) + 1;
    }
}

function checkSafetyAnswer() {
    const selectedOption = document.querySelector('#safety-trainer input[name="safety-option"]:checked');
    const feedback = document.querySelector('#safety-trainer .safety-feedback');
    
    if (!selectedOption) {
        feedback.textContent = 'Пожалуйста, выберите вариант ответа';
        feedback.style.color = 'var(--accent-color)';
        return;
    }
    
    if (selectedOption.value === 'correct') {
        feedback.textContent = 'Верно! Это правильный порядок действий при утечке газа.';
        feedback.style.color = 'var(--primary-color)';
    } else {
        feedback.textContent = 'Неправильно. При утечке газа необходимо немедленно сообщить в аварийную службу и эвакуировать персонал.';
        feedback.style.color = 'var(--accent-color)';
    }
}