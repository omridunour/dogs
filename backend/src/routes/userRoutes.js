const express = require('express');
const userController = require('../controllers/userController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// All routes require authentication and admin role
router.get('/pending', authMiddleware, adminMiddleware, userController.getPendingUsers);
router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.post('/:userId/approve', authMiddleware, adminMiddleware, userController.approveUser);
router.post('/:userId/reject', authMiddleware, adminMiddleware, userController.rejectUser);
router.post('/:userId/role', authMiddleware, adminMiddleware, userController.changeUserRole);
router.post('/:userId/deactivate', authMiddleware, adminMiddleware, userController.deactivateUser);
router.post('/:userId/reactivate', authMiddleware, adminMiddleware, userController.reactivateUser);
router.delete('/:userId', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;
