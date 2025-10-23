const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// GET /api/users - Get all users
router.get('/', userController.getAllUsers);

// GET /api/users/:id - Get a single user by ID
router.get('/:id', userController.getUserById);

// GET /api/users/email/:email - Get user by email
router.get('/email/:email', userController.getUserByEmail);

// POST /api/users - Create a new user
router.post('/', userController.createUser);

// PUT /api/users/:id - Update an existing user
router.put('/:id', userController.updateUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', userController.deleteUser);

// GET /api/users/:id/roles - Get roles for a user
router.get('/:id/roles', userController.getUserRoles);

// POST /api/users/:id/roles - Assign role to user
router.post('/:id/roles', userController.assignRoleToUser);

// DELETE /api/users/:id/roles/:roleId - Remove role from user
router.delete('/:id/roles/:roleId', userController.removeRoleFromUser);

module.exports = router;
