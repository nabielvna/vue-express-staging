const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { verifyToken, isNormalUser, isSuperAdmin } = require('../middlewares/authMiddleware');
const { profilePicture } = require('../middlewares/uploadMiddleware');

// Apply verifyToken middleware to all routes
router.use(verifyToken);

// Update profile with profile picture upload
router.put('/profile', profilePicture, [isNormalUser || isSuperAdmin], accountController.updateProfile);

// Change email
router.put('/email', [isNormalUser || isSuperAdmin], accountController.changeEmail);

// Change password
router.put('/password', [isNormalUser || isSuperAdmin], accountController.changePassword);

module.exports = router;