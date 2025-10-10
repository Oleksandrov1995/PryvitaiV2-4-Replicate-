// generateImageReplicate.js
// Функція для генерації зображення через локальний бекенд Replicate
import { API_URLS } from "./api";

/**
 * Відправляє запит на генерацію зображення через Replicate
 * @param {Object} params - параметри для replicate
 * @param {string} params.modelId - id моделі
 * @param {Object} params.input - об'єкт з параметрами (prompt, input_image, aspect_ratio, ...)
 * @returns {Promise<string>} - URL згенерованого зображення або кидок помилки
 */
export async function generateImageReplicate({ modelId, input }) {
  const response = await fetch(API_URLS.GENERATE_IMAGE_REPLICATE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ modelId, input }),
  });

  if (response.ok) {
    const responseText = await response.text();
    // Якщо відповідь - це просто URL зображення
    if (responseText && (responseText.startsWith('http') || responseText.startsWith('"http'))) {
      return responseText.trim().replace(/"/g, '');
    } else {
      // Спробуємо парсити як JSON
      try {
        const imageData = JSON.parse(responseText);
        if (imageData.generatedImageUrl) {
          return imageData.generatedImageUrl;
        } else {
          throw new Error('replicate повернув дані без generatedImageUrl');
        }
      } catch (parseError) {
        throw new Error('Не вдалося парсити відповідь replicate як JSON: ' + parseError);
      }
    }
  } else {
    const errorText = await response.text();
    throw new Error(`replicate помилка: ${response.status} ${response.statusText} ${errorText}`);
  }
}
