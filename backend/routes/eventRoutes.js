const express = require('express');
const router = express.Router();
const { addEventDate, getEventDates, deleteEventDate, updateEventDate } = require('../controllers/eventController');
const authMiddleware = require('../middleware/authMiddleware');

// Всі маршрути потребують авторизації
router.use(authMiddleware);

// POST /api/events - Додати нову дату події
router.post('/', addEventDate);

// GET /api/events - Отримати всі дати подій користувача
router.get('/', getEventDates);

// DELETE /api/events/:dateId - Видалити дату події
router.delete('/:dateId', deleteEventDate);

// PUT /api/events/:dateId - Оновити дату події
router.put('/:dateId', updateEventDate);

module.exports = router;