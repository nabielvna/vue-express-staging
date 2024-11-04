const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const { verifyToken, isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', collectionController.getAllCollections);
router.get('/summary', collectionController.getCollectionsSummary);
router.get('/:id', collectionController.getCollectionById);
router.get('/path/:path', collectionController.getCollectionByPath);

// Protected routes
router.post('/', verifyToken, isAdminOrSuperAdmin, collectionController.createCollection);
router.put('/:id', verifyToken, isAdminOrSuperAdmin, collectionController.updateCollection);
router.delete('/:id', verifyToken, isAdminOrSuperAdmin, collectionController.deleteCollection);

module.exports = router;