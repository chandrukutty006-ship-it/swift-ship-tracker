const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/', authenticate, authorizeRoles('ADMIN'), emailController.getEmailLogs);
router.get('/:id', authenticate, authorizeRoles('ADMIN'), emailController.getEmailById);

module.exports = router;
