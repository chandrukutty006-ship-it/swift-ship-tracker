const express = require('express');
const router = express.Router();
const shipmentController = require('../controllers/shipmentController');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Public tracking lookup (no authentication required)
router.get('/track/:trackingId', shipmentController.getByTrackingId);

// Customer personal shipments
router.get('/my-shipments', authenticate, shipmentController.getMyShipments);

// List all shipments (with search & filter) - available for admin or authenticated users
router.get('/', optionalAuth, shipmentController.getAllShipments);

// Admin shipment management
router.post('/', authenticate, authorizeRoles('ADMIN'), shipmentController.createShipment);
router.put('/:id', authenticate, authorizeRoles('ADMIN'), shipmentController.updateShipment);
router.put('/:id/status', authenticate, authorizeRoles('ADMIN'), shipmentController.updateStatus);
router.put('/:id/location', authenticate, authorizeRoles('ADMIN'), shipmentController.addLocationUpdate);
router.delete('/:id', authenticate, authorizeRoles('ADMIN'), shipmentController.deleteShipment);

module.exports = router;
