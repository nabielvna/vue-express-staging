const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken, isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');


// List all roles - Admin & SuperAdmin only
router.get('/', verifyToken, isAdminOrSuperAdmin, roleController.getAllRoles
);
router.get('/:id', verifyToken, isAdminOrSuperAdmin, roleController.getRoleById
);

module.exports = router;