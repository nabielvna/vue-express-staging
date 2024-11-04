const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken, isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/summary', categoryController.getCategoriesSummary);
router.get('/path/:path', categoryController.getCategoryByPath);
router.get('/:id', categoryController.getCategoryById);


// Protected routes
router.post('/', verifyToken, isAdminOrSuperAdmin, categoryController.createCategory);
router.put('/:id', verifyToken, isAdminOrSuperAdmin, categoryController.updateCategory);
router.delete('/:id', verifyToken, isAdminOrSuperAdmin, categoryController.deleteCategory);

module.exports = router;