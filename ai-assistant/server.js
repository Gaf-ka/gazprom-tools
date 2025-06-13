const express = require('express');
const { Pipeline, pipeline } = require('@xenova/transformers');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

let chatPipeline = null;

async function initializeModel() {
    console.log("Загрузка модели...");
    chatPipeline = await pipeline('text-generation', 'Xenova/LaMini-Flan-T5-248M', {
        quantized: true
    });
    console.log("Модель загружена!");
}

initializeModel();

app.post('/ask', async (req, res) => {
    if (!chatPipeline) {
        return res.status(503).json({ error: "Модель еще не загружена" });
    }

    const { question } = req.body;
    const context = `Ты - помощник компании Газпром. Отвечай профессионально и вежливо.
    Газпром - российская энергетическая компания, специализирующаяся на добыче, транспортировке и продаже газа.
    Если вопрос не по теме, вежливо откажись отвечать.

    Вопрос: ${question}
    Ответ:`;

    try {
        const response = await chatPipeline(context, {
            max_new_tokens: 200,
            temperature: 0.7
        });

        res.json({ answer: response[0].generated_text.replace(context, '').trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ошибка генерации ответа" });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});