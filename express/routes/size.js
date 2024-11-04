// routes/size.js
const express = require('express');
const router = express.Router();
const sizeController = require('../controllers/sizeController');
const { verifyToken, isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');


// Public routes
router.get('/', sizeController.getAllSizes);
router.get('/:id', sizeController.getSizeById);

// Protected routes (admin only)
router.post('/', verifyToken, isAdminOrSuperAdmin, sizeController.createSize);
router.put('/:id', verifyToken, isAdminOrSuperAdmin, sizeController.updateSize);
router.delete('/:id', verifyToken, isAdminOrSuperAdmin, sizeController.deleteSize);

module.exports = router;