const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken, isNormalUser } = require('../middlewares/authMiddleware');

// All cart routes require authentication and normal user role
router.use(verifyToken);
router.use(isNormalUser);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/items', cartController.addItem);

// Update cart item quantity
router.put('/items/:id', cartController.updateItem);

// Remove item from cart
router.delete('/items/:id', cartController.removeItem);

// Clear cart
router.delete('/', cartController.clearCart);

module.exports = router;