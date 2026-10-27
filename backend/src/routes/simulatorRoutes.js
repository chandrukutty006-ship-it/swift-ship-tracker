const express = require('express');
const router = express.Router();
const simulatorController = require('../controllers/simulatorController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Get simulator status
router.get('/status', simulatorController.getStatus);

// Admin controls
router.post('/toggle', authenticate, authorizeRoles('ADMIN'), simulatorController.toggle);
router.post('/speed', authenticate, authorizeRoles('ADMIN'), simulatorController.setSpeed);
router.post('/step', authenticate, authorizeRoles('ADMIN'), simulatorController.stepOnce);
router.post('/reset', authenticate, authorizeRoles('ADMIN'), simulatorController.resetShipments);

module.exports = router;
