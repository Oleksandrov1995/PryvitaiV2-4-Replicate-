const express = require('express');
const photoRoutes = require('./photoRoutes');
const openaiRoutes = require('./openaiRoutes');
const healthRoutes = require('./healthRoutes');
const crmRoutes = require('./crmRoutes');
const authRoutes = require('./authRoutes');
const replicateRoutes = require('./replicateRoutes');
const eventRoutes = require('./eventRoutes');
const paymentRoutes = require('./paymentRoutes');

const router = express.Router();

// Підключаємо маршрути
router.use('/', photoRoutes);
router.use('/', openaiRoutes);
router.use('/', healthRoutes);
router.use('/', crmRoutes);
router.use('/', authRoutes);
router.use('/', replicateRoutes);
router.use('/events', eventRoutes);
router.use('/payment', paymentRoutes);

module.exports = router;

module.exports = router;
