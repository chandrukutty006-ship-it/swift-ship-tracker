const express = require('express');
const router = express.Router();
const vesselController = require('../controllers/vesselController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Get all vessels (public/authenticated)
router.get('/', vesselController.getVessels);

// Admin-only operations
router.post('/', authenticate, authorizeRoles('ADMIN'), vesselController.createVessel);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), vesselController.updateVessel);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), vesselController.deleteVessel);

module.exports = router;
