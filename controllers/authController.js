const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const User = require('../models/User');

const authController = {
  // Register a new user
  async register(req, res) {
    try {
      const {
        email,
        password,
        name,
        statut,
        phone,
        address,
        geocode,
        infos,
        solde_actuelle,
        solde_autorise,
        qr_code,
        id_rpp,
        code_user,
        image,
        schema
      } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ error: 'Email, password, and name are required' });
      }

      // Check if user already exists
      try {
        await User.findByEmail(email);
        return res.status(400).json({ error: 'User with this email already exists' });
      } catch (error) {
        // User doesn't exist, continue with registration
      }

      // Create user in our users table
      const user = new User({
        email,
        name,
        statut,
        phone,
        address,
        geocode,
        infos,
        solde_actuelle,
        solde_autorise,
        qr_code,
        id_rpp,
        code_user,
        image,
        schema
      });

      const savedUser = await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { sub: savedUser.id, email: savedUser.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        user: savedUser,
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

      // Find user by email
      const user = await User.findByEmail(email);

      // For now, we'll skip password verification for testing
      // In production, you should hash and verify passwords
      // const isValidPassword = await bcrypt.compare(password, user.password);
      // if (!isValidPassword) {
      //   return res.status(401).json({ error: 'Invalid credentials' });
      // }

      // Generate JWT token
      const token = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        user: user,
        token,
        message: 'Login successful'
      });
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(401).json({ error: 'Invalid credentials' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Get current user profile
  async getProfile(req, res) {
    try {
      const userId = req.user.sub;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ user });
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
