const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.get('/', optionalAuth, notificationController.getNotifications);
router.put('/:id/read', notificationController.markAsRead);
router.put('/read-all', optionalAuth, notificationController.markAllAsRead);

module.exports = router;
