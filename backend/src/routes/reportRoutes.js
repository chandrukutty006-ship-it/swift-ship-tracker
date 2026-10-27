const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/export-csv', authenticate, authorizeRoles('ADMIN'), reportController.exportShipmentsCsv);

module.exports = router;
