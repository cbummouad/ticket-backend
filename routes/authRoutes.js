const express = require('express');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/register - Register a new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/profile - Get current user profile (protected)
router.get('/profile', auth, authController.getProfile);

// POST /api/auth/logout - Logout user
router.post('/logout', authController.logout);

module.exports = router;
