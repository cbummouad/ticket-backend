const User = require('../models/User');

const userController = {
  // Get all users
  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single user by ID
  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      res.json(user);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Get user by email
  async getUserByEmail(req, res) {
    try {
      const { email } = req.params;
      const user = await User.findByEmail(email);
      res.json(user);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Create a new user
  async createUser(req, res) {
    try {
      const {
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
      } = req.body;

      if (!email || !name) {
        return res.status(400).json({ error: 'Email and name are required' });
      }

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
      res.status(201).json(savedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update an existing user
  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const user = await User.findById(id);

      // Update only provided fields
      Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
          user[key] = updateData[key];
        }
      });

      const updatedUser = await user.save();
      res.json(updatedUser);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Delete a user
  async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      await user.delete();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = userController;
