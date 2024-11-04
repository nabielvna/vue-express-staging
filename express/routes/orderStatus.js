// orderStatusRoutes.js
const express = require('express');
const router = express.Router();
const orderStatusController = require('../controllers/orderStatusController');
const { verifyToken, isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(verifyToken);

// Public routes (accessible by all authenticated users)
router.get('/', orderStatusController.getOrderStatuses);
router.get('/:id', orderStatusController.getOrderStatus);

// Admin only routes
router.use(isAdminOrSuperAdmin);
router.post('/', orderStatusController.createOrderStatus);
router.put('/:id', orderStatusController.updateOrderStatus);
router.delete('/:id', orderStatusController.deleteOrderStatus);

module.exports = router;