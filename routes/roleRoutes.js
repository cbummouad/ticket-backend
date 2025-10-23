const express = require('express');
const roleController = require('../controllers/roleController');

const router = express.Router();

// GET /api/roles - Get all roles
router.get('/', roleController.getAllRoles);

// GET /api/roles/:id - Get a single role by ID
router.get('/:id', roleController.getRoleById);

// GET /api/roles/slug/:slug - Get role by slug
router.get('/slug/:slug', roleController.getRoleBySlug);

// POST /api/roles - Create a new role
router.post('/', roleController.createRole);

// PUT /api/roles/:id - Update an existing role
router.put('/:id', roleController.updateRole);

// DELETE /api/roles/:id - Delete a role
router.delete('/:id', roleController.deleteRole);

// GET /api/roles/:id/users - Get users with a specific role
router.get('/:id/users', roleController.getUsersWithRole);

// POST /api/roles/assign - Assign role to user
router.post('/assign', roleController.assignRoleToUser);

// POST /api/roles/remove - Remove role from user
router.post('/remove', roleController.removeRoleFromUser);

// GET /api/roles/user/:userId - Get roles for a user
router.get('/user/:userId', roleController.getUserRoles);

module.exports = router;
