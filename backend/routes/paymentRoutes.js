const express = require('express');
const router = express.Router();
const { createPayment, handleCallback, paymentSuccess, paymentError, getUserPaymentInfo } = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

// Створення платежу (потребує авторизації)
router.post('/create', authMiddleware, createPayment);

// Callback від WayForPay (без авторизації)
router.post('/callback', handleCallback);

// Сторінка успішного платежу (GET і POST)
router.get('/success', paymentSuccess);
router.post('/success', paymentSuccess);

// Сторінка невдалого платежу (GET і POST)  
router.get('/error', paymentError);
router.post('/error', paymentError);

// Отримання інформації про користувача (потребує авторизації)
router.get('/user-info', authMiddleware, getUserPaymentInfo);

module.exports = router;