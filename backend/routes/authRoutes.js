const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Auth routes
router.post('/google-auth', authController.googleAuth);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);
router.put('/update-phone', authMiddleware, authController.updatePhone);
router.put('/update-avatar', authMiddleware, authController.updateAvatar);
router.post('/change-password', authMiddleware, authController.changePassword);
router.delete('/delete-account', authMiddleware, authController.deleteAccount);

// Gallery routes
router.post('/users/gallery', authMiddleware, authController.addGalleryImage);
router.get('/users/gallery', authMiddleware, authController.getGallery);
router.delete('/users/gallery/:index', authMiddleware, authController.deleteGalleryImage);

// Tariff and coins management routes
router.put('/update-tariff', authMiddleware, authController.updateTariff);
router.post('/decrement-coins', authMiddleware, authController.decrementCoins);
router.post('/add-coins', authMiddleware, authController.addCoins);

module.exports = router;
