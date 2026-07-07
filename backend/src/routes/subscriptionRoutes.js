const express = require('express');
const subscriptionController = require('../controllers/subscriptionController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, subscriptionController.getAllSubscriptions);
router.post('/', authMiddleware, adminMiddleware, subscriptionController.createSubscription);
router.put('/:subscriptionId', authMiddleware, adminMiddleware, subscriptionController.updateSubscription);
router.delete('/:subscriptionId', authMiddleware, adminMiddleware, subscriptionController.cancelSubscription);
router.get('/org/:organizationId', authMiddleware, subscriptionController.getOrgSubscriptions);

module.exports = router;
