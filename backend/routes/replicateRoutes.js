const express = require('express');
const router = express.Router();
const replicateController = require('../controllers/replicateController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /generate-image-replicate (потребує авторизації та витрачає 100 монет)
router.post('/generate-image-replicate', authMiddleware, replicateController.generateImage);

module.exports = router;
