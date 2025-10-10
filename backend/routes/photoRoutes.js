const express = require('express');
const { uploadPhoto } = require('../controllers/photoController');

const router = express.Router();

// Маршрут для завантаження фото на Cloudinary
router.post('/upload-photo', uploadPhoto);

module.exports = router;
