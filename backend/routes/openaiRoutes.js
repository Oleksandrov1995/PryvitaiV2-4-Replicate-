const express = require('express');
const { generateImagePrompt, generateGreeting } = require('../controllers/openaiController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Маршрут для генерації зображення промпта
router.post('/generate-image-promt', generateImagePrompt);

// Маршрут для генерації привітань (потребує авторизації та витрачає 10 монет)
router.post('/generate-greeting', authMiddleware, generateGreeting);

module.exports = router;
