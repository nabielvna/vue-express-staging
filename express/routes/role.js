const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken, isSuperAdmin, isAdminOrSuperAdmin } = require('../middlewares/authMiddleware');


router.use(verifyToken);
router.use(isAdminOrSuperAdmin)
// List all roles - Admin & SuperAdmin only
router.get('/', roleController.getAllRoles);

// Get specific role - Admin & SuperAdmin only
router.get('/:id', roleController.getRoleById);

// Assign role to user - Admin & SuperAdmin only
router.post('/assign', isSuperAdmin, roleController.assignUserRole);

module.exports = router;