// Загружаем переменные окружения из .env файла
const env = {
    OPENAI_API_KEY: import.meta.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY
};

// Экспортируем переменные
export const { OPENAI_API_KEY } = env;

// Для Node.js окружения (если нужно)
if (typeof process !== 'undefined') {
    require('dotenv').config();
    env.OPENAI_API_KEY = process.env.OPENAI_API_KEY;
}