import { API_URLS } from '../config/api';

/**
 * Завантажує дані поточного користувача з API
 * @returns {Promise<Object>} Дані користувача або null при помилці
 */
export const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Користувач не авторизований');
    }

    const response = await fetch(API_URLS.GET_ME, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.user || data;
  } catch (error) {
    console.error('Помилка завантаження даних користувача:', error);
    throw error;
  }
};

export default fetchUserData;