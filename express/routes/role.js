const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { verifyToken, isSuperAdmin } = require('../middlewares/authMiddleware');


// List all roles - Admin & SuperAdmin only
router.get('/', verifyToken, isSuperAdmin, roleController.getAllRoles
);
router.get('/:id', verifyToken, isSuperAdmin, roleController.getRoleById
);

module.exports = router;