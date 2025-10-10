import { API_URLS } from './api';

// Функція для збереження дати події в календарі
export const saveEventDate = async (eventData) => {
  try {
    console.log('📅 SAVE_EVENT: Збереження події:', eventData);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Користувач не авторизований');
    }

    const response = await fetch(API_URLS.events.create, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка збереження події');
    }

    const result = await response.json();
    console.log('✅ SAVE_EVENT: Подію збережено:', result);
    return result;

  } catch (error) {
    console.error('❌ SAVE_EVENT: Помилка збереження події:', error);
    throw error;
  }
};

// Функція для оновлення події
export const updateEventDate = async (eventId, eventData) => {
  try {
    console.log('📅 UPDATE_EVENT: Оновлення події:', { eventId, eventData });
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Користувач не авторизований');
    }

    const response = await fetch(API_URLS.events.update(eventId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка оновлення події');
    }

    const result = await response.json();
    console.log('✅ UPDATE_EVENT: Подію оновлено:', result);
    return result;

  } catch (error) {
    console.error('❌ UPDATE_EVENT: Помилка оновлення події:', error);
    throw error;
  }
};

// Функція для видалення події
export const deleteEventDate = async (eventId) => {
  try {
    console.log('📅 DELETE_EVENT: Видалення події:', eventId);
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Користувач не авторизований');
    }

    const response = await fetch(API_URLS.events.delete(eventId), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка видалення події');
    }

    const result = await response.json();
    console.log('✅ DELETE_EVENT: Подію видалено:', result);
    return result;

  } catch (error) {
    console.error('❌ DELETE_EVENT: Помилка видалення події:', error);
    throw error;
  }
};

// Функція для отримання всіх подій користувача
export const getEventDates = async () => {
  try {
    console.log('📅 GET_EVENTS: Отримання подій користувача');
    
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Користувач не авторизований');
    }

    const response = await fetch(API_URLS.events.list, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Помилка отримання подій');
    }

    const result = await response.json();
    console.log('✅ GET_EVENTS: Події отримано:', result);
    return result;

  } catch (error) {
    console.error('❌ GET_EVENTS: Помилка отримання подій:', error);
    throw error;
  }
};

export default {
  saveEventDate,
  updateEventDate,
  deleteEventDate,
  getEventDates
};