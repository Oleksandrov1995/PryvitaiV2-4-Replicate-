const express = require('express');
const { sendOrder, createPayment } = require('../controllers/crmController');

const router = express.Router();

// Маршрут для відправки замовлення до KeyCRM
router.post('/sendOrder', sendOrder);

// Маршрут для створення платежу на Fondy
router.post('/pay', createPayment);

module.exports = router;
