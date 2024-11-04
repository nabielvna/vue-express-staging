const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Public routes
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Protected routes (admin only)
router.post('/', 
    verifyToken, 
    isAdminOrSuperAdmin,
    uploadMiddleware.products,
    productController.createProduct
);

// New routes for handling product images
router.post('/:id',
    verifyToken,
    isAdminOrSuperAdmin,
    uploadMiddleware.products,
    productController.updateProduct
);

router.delete('/:id', 
    verifyToken, 
    isAdminOrSuperAdmin,
    productController.deleteProduct
);

module.exports = router;