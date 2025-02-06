// api/send-message.js
export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { name, email, message } = req.body;

            // Валидация (простейший пример, добавьте больше проверок по необходимости)
            if (!name || !email || !message) {
                return res.status(400).json({ error: 'Будь ласка, заповніть всі поля.' });
            }

            // Токен вашего бота и Chat ID (из переменных окружения Vercel)
            const botToken = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;

            if (!botToken || !chatId) {
                return res.status(500).json({ error: 'Помилка конфігурації сервера (Telegram API).' });
            }

            // Формируем текст сообщения
            const text = `Нове повідомлення від ${name} (${email}):\n${message}`;

            // Формируем URL для отправки сообщения через Telegram Bot API
            const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

            // Отправляем запрос к Telegram API (используем fetch)
            const telegramResponse = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                }),
            });

            const telegramResult = await telegramResponse.json();

            if (!telegramResult.ok) {
                console.error('Telegram API error:', telegramResult);
                return res.status(500).json({ error: 'Помилка при відправці повідомлення в Telegram.' });
            }

            return res.status(200).json({ message: 'Повідомлення успішно надіслано!' });

        } catch (error) {
            console.error('Error processing form:', error);
            return res.status(500).json({ error: 'Сталася внутрішня помилка сервера.' });
        }
    } else {
        // Если метод не POST, возвращаем ошибку 405 (Method Not Allowed)
        return res.status(405).setHeader('Allow', 'POST').end();
    }
}