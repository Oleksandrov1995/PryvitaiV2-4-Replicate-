const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
dotenv.config();

// Завантаження конфігурації
require('./config/services');

// Імпорт middleware та маршрутів
const { requestLogger } = require('./middleware/logger');
const apiRoutes = require('./routes/index');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Збільшуємо ліміт для завантаження зображень
app.use(express.urlencoded({ extended: true })); // Додаємо підтримку form-encoded даних для WayForPay

// Логування запитів
app.use(requestLogger);

// API маршрути
app.use('/api', apiRoutes);

// Додаткові роути для WayForPay редіректів (без /api префікса)
const { paymentSuccess, paymentError } = require('./controllers/paymentController');
app.get('/payment-success', paymentSuccess);
app.post('/payment-success', paymentSuccess);
app.get('/payment-error', paymentError);
app.post('/payment-error', paymentError);

// Обробка неіснуючих маршрутів
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Маршрут не знайдено' 
  });
});

// Глобальна обробка помилок
app.use((error, req, res, next) => {
  console.error('Глобальна помилка:', error);
  res.status(500).json({ 
    error: 'Внутрішня помилка сервера',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Функція для виведення інформації про запуск
const printServerInfo = () => {
  console.log(`🚀 Сервер запущено на порту ${PORT}`);
  console.log(`📡 API доступне за адресою: http://localhost:${PORT}/api`);
  console.log(`🏥 Перевірка здоров'я: http://localhost:${PORT}/api/health`);
  
  if (!process.env.OPENAI_API_KEY) {
    console.warn('⚠️  УВАГА: Не встановлено OPENAI_API_KEY у файлі .env');
  }
  if (!process.env.CRM_API_KEY) {
    console.warn('⚠️  УВАГА: Не встановлено CRM_API_KEY у файлі .env');
  }
  if (!process.env.FONDY_SECRET_KEY || !process.env.FONDY_MERCHANT_ID) {
    console.warn('⚠️  УВАГА: Не встановлено параметри Fondy у файлі .env');
  }
};

// Функція запуску сервера
const startServer = () => {
  const sslKeyPath = '/etc/letsencrypt/live/vps66716.hyperhost.name/privkey.pem';
  const sslCertPath = '/etc/letsencrypt/live/vps66716.hyperhost.name/fullchain.pem';

  if (fs.existsSync(sslKeyPath) && fs.existsSync(sslCertPath)) {
    const options = {
      key: fs.readFileSync(sslKeyPath),
      cert: fs.readFileSync(sslCertPath),
    };
    https.createServer(options, app).listen(PORT,'0.0.0.0', printServerInfo);
    console.log('🚀 Сервер запущено з HTTPS.');
  }   
 
  else {
    console.error('❌ SSL сертифікати не знайдені. HTTPS сервер не запущено.');
    
    process.exit(1);
  }
  //   app.listen(PORT, () => {
  //   console.log(`🚀 Локальний сервер запущено на http://localhost:${PORT}`);
  // });
};

// Підключення до MongoDB і запуск сервера
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('❌ Помилка: Не вказано MONGODB_URI в файлі .env');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Підключено до MongoDB');
    startServer(); // Запускаємо сервер після успішного підключення до БД
  })
  .catch(err => {
    console.error('❌ Помилка підключення до MongoDB:', err.message);
    process.exit(1);
  });

module.exports = app;