const express = require('express');

const router = express.Router();

// Тестовий маршрут
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Сервер працює',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
