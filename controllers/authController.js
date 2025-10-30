const supabase = require('../config/supabase');
const User = require('../models/User');
const UserRole = require('../models/UserRole');

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

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        return res.status(400).json({ error: authError.message });
      }

      if (!authData.user) {
        return res.status(400).json({ error: 'Failed to create user account' });
      }

      // Create user in our local users table
      const user = new User({
        id: authData.user.id, // Use Supabase user ID
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

      res.status(201).json({
        user: savedUser,
        session: authData.session,
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

      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        return res.status(401).json({ error: authError.message });
      }

      // Get user from local users table
      const user = await User.findById(authData.user.id);

      if (!user) {
        return res.status(404).json({ error: 'User profile not found' });
      }

      // Get user roles
      const roles = await user.getRoles();

      res.json({
        user: user,
        roles: roles,
        session: authData.session,
        message: 'Login successful'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
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
