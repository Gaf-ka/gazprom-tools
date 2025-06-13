const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Настройка статических файлов
app.use(express.static(path.join(__dirname, 'ai-assistant')));

// Роут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'ai-assistant', 'index.html'));
});

// База знаний
const knowledgeBase = {
    "привет": "Здравствуйте! Я виртуальный помощник Газпром. Чем могу помочь?",
    "как создать отчет": "Для создания отчета перейдите в раздел 'Отчеты' в корпоративной системе.",
    "техника безопасности": "Материалы по технике безопасности доступны на внутреннем портале.",
    "контакты": "Служба поддержки: телефон 1234, email support@gazprom.ru",
    "газпром": "ПАО 'Газпром' - российская энергетическая компания, мировой лидер в добыче газа."
};

// API для обработки вопросов
app.get('/ask', (req, res) => {
    const question = req.query.question.toLowerCase();
    let answer = "Извините, я не могу ответить на этот вопрос. Обратитесь в службу поддержки.";

    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (question.includes(key)) {
            answer = value;
            break;
        }
    }

    res.json({ answer });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});