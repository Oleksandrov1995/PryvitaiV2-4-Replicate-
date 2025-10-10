// generateImagePrompt.js
// Функція для запиту генерації промпта через бекенд
import { API_URLS } from "./api";

/**
 * Відправляє промпт на бекенд для генерації промпта для зображення
 * @param {string} prompt - текстовий промпт
 * @returns {Promise<object>} - відповідь бекенду (JSON)
 * @throws {Error} - якщо сталася помилка при запиті
 */
export async function generateImagePrompt(prompt) {
  const response = await fetch(API_URLS.GENERATE_IMAGE_PROMPT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('Перевищено ліміт запитів. Будь ласка, спробуйте через кілька хвилин.');
    } else if (response.status === 500) {
      throw new Error('Помилка сервера. Спробуйте пізніше.');
    } else if (response.status === 503) {
      throw new Error('Сервіс тимчасово недоступний. Спробуйте пізніше.');
    } else {
      throw new Error(`Помилка при генерації промпта: ${response.status} ${response.statusText}`);
    }
  }

  return await response.json();
}
