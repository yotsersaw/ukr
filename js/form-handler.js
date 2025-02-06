// js/form-handler.js

// Функция для обработки формы (одна и та же для обеих страниц)
async function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target; // Получаем форму, которая вызвала событие
    const formMessages = document.getElementById(form.id.replace('form', 'form-messages')); // Находим элемент для вывода сообщений
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            formMessages.textContent = result.message;
            // formMessages.classList.add('success-message'); // Если нужны стили
            // formMessages.classList.remove('error-message');
            form.reset();
        } else {
            formMessages.textContent = result.error || 'Помилка при відправці повідомлення.';
            // formMessages.classList.add('error-message');
            // formMessages.classList.remove('success-message');
        }
    } catch (error) {
        console.error('Error:', error);
        formMessages.textContent = 'Сталася несподівана помилка.';
        // formMessages.classList.add('error-message');
        // formMessages.classList.remove('success-message');
    }
}

// Находим все формы на странице и добавляем обработчик события submit
const forms = document.querySelectorAll('form[action="/api/send-message"]');
forms.forEach(form => {
  form.addEventListener('submit', handleFormSubmit);
});