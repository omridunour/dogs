const express = require('express');
const organizationController = require('../controllers/organizationController');
const { authMiddleware, adminMiddleware, orgOwnerMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, adminMiddleware, organizationController.getAllOrganizations);
router.post('/', authMiddleware, organizationController.createOrganization);
router.get('/:organizationId', authMiddleware, organizationController.getOrganization);
router.put('/:organizationId', authMiddleware, orgOwnerMiddleware, organizationController.updateOrganization);
router.post('/:organizationId/users', authMiddleware, orgOwnerMiddleware, organizationController.addUserToOrganization);
router.delete('/:organizationId/users/:userId', authMiddleware, orgOwnerMiddleware, organizationController.removeUserFromOrganization);

module.exports = router;
