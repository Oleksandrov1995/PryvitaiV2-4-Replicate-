import { API_URLS } from './api';

// Функція для перевірки авторизації
export const checkAuthToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.log('❌ WAYFORPAY: Користувач не авторизований');
    return false;
  }
  
  try {
    // Перевіряємо чи токен не прострочений
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      console.log('❌ WAYFORPAY: Токен прострочений');
      localStorage.removeItem('token');
      return false;
    }
    
    console.log('✅ WAYFORPAY: Користувач авторизований');
    return true;
  } catch (error) {
    console.error('❌ WAYFORPAY: Помилка перевірки токена:', error);
    localStorage.removeItem('token');
    return false;
  }
};

// Функція для отримання токена авторизації
export const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Функція для створення платежу через WayForPay
export const createPayment = async (planData) => {
  try {
    // Перевіряємо авторизацію перед створенням платежу
    if (!checkAuthToken()) {
      throw new Error('Необхідна авторизація для здійснення платежу');
    }

    const token = getAuthToken();
    
    console.log('🔍 WAYFORPAY: Відправляємо запит на створення платежу:', {
      planData,
      hasToken: !!token
    });

    const response = await fetch(API_URLS.CREATE_PAYMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        planId: planData.id || planData.title,
        planTitle: planData.title,
        amount: planData.price,
        coins: planData.coins
      })
    });

    const data = await response.json();

    console.log('📥 WAYFORPAY: Отримано відповідь:', {
      status: response.status,
      statusText: response.statusText,
      data
    });

    if (!response.ok) {
      // Перевіряємо чи це помилка авторизації
      if (response.status === 401) {
        localStorage.removeItem('token');
        throw new Error('Необхідна авторизація для здійснення платежу');
      }
      throw new Error(data.message || `Помилка сервера: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('❌ WAYFORPAY: Помилка створення платежу:', error);
    throw error;
  }
};

// Функція для перенаправлення на WayForPay
export const redirectToWayForPay = (paymentData) => {
  // Створюємо форму для відправки на WayForPay
  const form = document.createElement('form');
  form.method = 'POST';
  form.action = 'https://secure.wayforpay.com/pay';
  form.style.display = 'none';

  // Додаємо всі поля платежу як приховані input
  Object.keys(paymentData).forEach(key => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = Array.isArray(paymentData[key]) ? paymentData[key].join(',') : paymentData[key];
    form.appendChild(input);
  });

  // Додаємо форму до DOM, відправляємо та видаляємо
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

// Основна функція для обробки натискання на тарифний план
export const handlePlanSelection = async (planData) => {
  try {
    // Перша перевірка авторизації
    if (!checkAuthToken()) {
      // Перенаправляємо на сторінку авторизації
      window.location.href = '/SignIn';
      return;
    }

    console.log('🔄 WAYFORPAY: Починаємо обробку вибору плану:', planData);

    // Створюємо платіж на бекенді
    const paymentResponse = await createPayment(planData);
    
    if (paymentResponse.success) {
      // Перенаправляємо на WayForPay
      redirectToWayForPay(paymentResponse.paymentData);
    } else {
      throw new Error(paymentResponse.message || 'Помилка при створенні платежу');
    }
  } catch (error) {
    console.error('❌ WAYFORPAY: Помилка обробки платежу:', error);
    
    // Перевіряємо чи це помилка авторизації
    if (error.message.includes('авторизації') || error.message.includes('401')) {
      alert('Сесія закінчилася. Будь ласка, увійдіть в систему знову.');
      localStorage.removeItem('token');
      window.location.href = '/SignIn';
      return;
    }
    
    // Інші помилки
    alert('Помилка при створенні платежу: ' + error.message);
  }
};
