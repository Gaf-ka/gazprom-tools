require('dotenv').config();
const express = require('express');
const path = require('path');
const { HfInference } = require('@huggingface/inference');

const app = express();
const port = process.env.PORT || 3000;
const hf = new HfInference(process.env.HF_API_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// База знаний + нейросеть
app.post('/ask', async (req, res) => {
    const { question } = req.body;
    
    // Сначала проверяем базу знаний
    const knowledgeBase = {
        "привет": "Здравствуйте! Я ИИ-помощник Газпром. Чем могу помочь?",
        "контакты": "Служба поддержки: тел. 1234, email support@gazprom.ru"
    };
    
    for (const [key, answer] of Object.entries(knowledgeBase)) {
        if (question.toLowerCase().includes(key)) {
            return res.json({ answer });
        }
    }
    
    // Если вопроса нет в базе, используем нейросеть
    try {
        const response = await hf.textGeneration({
            model: 'facebook/blenderbot-400M-distill',
            inputs: `Ты - помощник компании Газпром. Ответь на вопрос: ${question}`,
            parameters: { max_new_tokens: 200 }
        });
        
        res.json({ answer: response.generated_text });
    } catch (error) {
        console.error('Ошибка нейросети:', error);
        res.json({ answer: "Не удалось обработать запрос. Попробуйте позже." });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});