const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { verifyToken, isNormalUser } = require('../middlewares/authMiddleware');

// Apply both verifyToken and isNormalUser middleware to all wishlist routes
router.use(verifyToken, isNormalUser);
router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

module.exports = router;