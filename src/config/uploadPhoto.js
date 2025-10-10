// uploadPhoto.js
// Функція для завантаження фото на Cloudinary через бекенд
import { API_URLS } from "./api";

/**
 * Завантажує фото (base64) на сервер і повертає URL завантаженого фото
 * @param {string} photoBase64 - base64-рядок фото
 * @returns {Promise<string>} - URL завантаженого фото
 * @throws {Error} - якщо сталася помилка при завантаженні
 */
export async function uploadPhoto(photoBase64) {
  const uploadResponse = await fetch(API_URLS.UPLOAD_PHOTO, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      photoBase64: photoBase64 
    }),
  });

  if (!uploadResponse.ok) {
    throw new Error('Помилка при завантаженні фото');
  }

  const uploadData = await uploadResponse.json();
  const photoUrl = uploadData.url;
  console.log('Фото завантажено на Cloudinary:', photoUrl);
  return photoUrl;
}
