const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');

router.get('/dashboard', optionalAuth, statsController.getDashboardStats);

module.exports = router;
