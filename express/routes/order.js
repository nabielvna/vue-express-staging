const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, isNormalUser, isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');

router.use(verifyToken);
// Customer routes
router.get('/my-orders', isNormalUser, orderController.getMyOrders);
router.get('/my-orders/:id', isNormalUser, orderController.getMyOrderById);
router.post('/', isNormalUser, orderController.createOrder);

// Admin routes
// router.use(isAdminOrSuperAdmin);
// router.get('/', orderController.getAllOrders);
// router.get('/:id', orderController.getOrderById);
// router.put('/:id/status', orderController.updateOrderStatus);

module.exports = router;