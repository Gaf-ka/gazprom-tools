const express = require('express');
const { pipeline } = require('@xenova/transformers');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Инициализация модели
let chatPipeline = null;

async function initializeModel() {
    console.log("Загрузка модели...");
    try {
        chatPipeline = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-248M');
        console.log("Модель успешно загружена!");
    } catch (error) {
        console.error("Ошибка загрузки модели:", error);
        process.exit(1);
    }
}

// Маршрут для обработки вопросов
app.post('/ask', async (req, res) => {
    if (!chatPipeline) {
        return res.status(503).json({ error: "Модель еще не загружена" });
    }

    const { question } = req.body;
    
    try {
        const response = await chatPipeline(
            `Ты - помощник компании Газпром. Отвечай профессионально.
Вопрос: ${question}
Ответ:`,
            {
                max_new_tokens: 200,
                temperature: 0.7
            }
        );

        res.json({ answer: response[0].generated_text });
    } catch (error) {
        console.error("Ошибка генерации ответа:", error);
        res.status(500).json({ error: "Ошибка обработки запроса" });
    }
});

// Запуск сервера
initializeModel().then(() => {
    app.listen(port, () => {
        console.log(`Сервер запущен на http://localhost:${port}`);
    });
});