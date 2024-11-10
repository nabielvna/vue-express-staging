const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken, isAdminOrSuperAdmin, isSuperAdmin } = require('../middlewares/authMiddleware');
const uploadMiddleware = require('../middlewares/uploadMiddleware');

// Apply auth middleware to all routes
router.use(verifyToken);
router.use(isAdminOrSuperAdmin); // Ensure only admin/superadmin can access these routes

// Get all users with filtering and pagination
router.get('/', userController.getAllUsers);

// Get user by ID
router.get('/:id', userController.getUserById);

router.use(isSuperAdmin)

router.post('/',
    uploadMiddleware.profilePicture,
    userController.createUser
);

router.put('/:id/role',
    userController.updateUserRole
);

router.put('/:id',
    uploadMiddleware.profilePicture,
    userController.updateUser
);

router.delete('/:id', userController.deleteUser);

module.exports = router;