const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Apply auth middleware to all routes
router.use(verifyToken);

// Get all addresses for authenticated user
router.get('/', addressController.getAddresses);

// Get single address
router.get('/:id', addressController.getAddress);

// Create new address
router.post('/', addressController.createAddress);

// Update address
router.put('/:id', addressController.updateAddress);

// Delete address
router.delete('/:id', addressController.deleteAddress);

module.exports = router;