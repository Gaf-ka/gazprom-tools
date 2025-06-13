const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// База знаний
const knowledgeBase = {
    "привет": "Здравствуйте! Я помощник Газпром. Чем могу помочь?",
    "как создать отчет": "Отчеты создаются через систему SAP. Перейдите в раздел 'Отчеты' в вашем личном кабинете.",
    "техника безопасности": "Инструкции по ТБ доступны на корпоративном портале в разделе 'Документы'.",
    "контакты": "Служба поддержки: тел. 1234, email support@gazprom.ru",
    "газпром": "Газпром - российская энергетическая компания, лидер в добыче и поставках газа."
};

// API endpoint
app.post('/ask', (req, res) => {
    const question = req.body.question.toLowerCase();
    let answer = "Извините, я не могу ответить на этот вопрос. Обратитесь в службу поддержки по тел. 1234.";

    // Проверка базы знаний
    for (const [key, value] of Object.entries(knowledgeBase)) {
        if (question.includes(key)) {
            answer = value;
            break;
        }
    }

    // Имитация задержки нейросети
    setTimeout(() => {
        res.json({ answer });
    }, 500);
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});