const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { profilePicture } = require('../middlewares/uploadMiddleware');

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Update profile with profile picture upload
router.put('/profile', profilePicture, accountController.updateProfile);

// Change email
router.put('/email', accountController.changeEmail);

// Change password
router.put('/password', accountController.changePassword);

module.exports = router;