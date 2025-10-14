import { API_URLS } from './api';

// Функція для збереження дати події в календарі
export const saveEventDate = async (eventData) => {
  try {
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
    return result;

  } catch (error) {
    throw error;
  }
};

// Функція для оновлення події
export const updateEventDate = async (eventId, eventData) => {
  try {
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
    return result;

  } catch (error) {
    throw error;
  }
};

// Функція для видалення події
export const deleteEventDate = async (eventId) => {
  try {
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
    return result;

  } catch (error) {
    throw error;
  }
};

// Функція для отримання всіх подій користувача
export const getEventDates = async () => {
  try {
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
    return result;

  } catch (error) {
    throw error;
  }
};

export default {
  saveEventDate,
  updateEventDate,
  deleteEventDate,
  getEventDates
};