const axios = require('axios');
const crypto = require('crypto');

// URL API KeyCRM
const CRM_API_URL = 'https://openapi.keycrm.app/v1/order';

/**
 * Відправка замовлення до KeyCRM
 */
const sendOrder = async (req, res) => {
  try {
    const response = await axios.post(CRM_API_URL, req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CRM_API_KEY}`,
      },
    });
    
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Помилка при відправці замовлення до CRM:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ 
      error: 'Помилка при відправці замовлення',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Створення платежу на Fondy
 */
const createPayment = async (req, res) => {
  try {
    const secretKey = process.env.FONDY_SECRET_KEY;
    const merchantId = process.env.FONDY_MERCHANT_ID;

    if (!secretKey || !merchantId) {
      return res.status(500).json({ 
        error: 'Не налаштовані параметри Fondy в змінних середовища' 
      });
    }

    // Отримані від клієнта параметри
    const userParams = req.body;

    // Додаємо merchant_id згідно з логікою
    const fullParams = { merchant_id: merchantId, ...userParams };

    // Фільтруємо порожні значення
    const filteredParams = Object.fromEntries(
      Object.entries(fullParams).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );

    // Сортуємо ключі
    const sortedKeys = Object.keys(filteredParams).sort();

    // Створюємо масив значень
    const values = sortedKeys.map(k => filteredParams[k]);

    // Додаємо секретний ключ на початок
    values.unshift(secretKey);

    // Генеруємо sha1-підпис
    const signature = crypto.createHash('sha1').update(values.join('|')).digest('hex');

    // Відправляємо назад повні параметри + підпис
    res.json({
      ...fullParams,
      signature
    });

  } catch (error) {
    console.error('Помилка при обробці платежу:', error);
    res.status(500).json({ 
      error: 'Не вдалося створити платіж',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  sendOrder,
  createPayment
};
