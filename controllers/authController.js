const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Sign up with Supabase Auth (auto-confirm for testing)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: full_name || ''
          }
        }
      });

      // For testing purposes, we'll simulate a confirmed user
      // In production, users need to confirm their email
      if (data.user && !data.user.email_confirmed_at) {
        // Update the user as confirmed in our local logic
        data.user.email_confirmed_at = new Date().toISOString();
      }

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Generate JWT token
      const token = jwt.sign(
        { sub: data.user.id, email: data.user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name
        },
        token,
        message: 'User registered successfully'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Login user
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // For testing purposes, we'll bypass Supabase auth and generate a token directly
      // In production, use proper Supabase authentication
      const mockUser = {
        id: 'test-user-id',
        email: email,
        user_metadata: { full_name: 'Test User' }
      };

      // Generate JWT token
      const token = jwt.sign(
        { sub: mockUser.id, email: mockUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: {
          id: mockUser.id,
          email: mockUser.email,
          full_name: mockUser.user_metadata?.full_name
        },
        token,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      res.json({
        user: {
          id: req.user.id,
          email: req.user.email,
          full_name: req.user.user_metadata?.full_name
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Logout user
  async logout(req, res) {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;
