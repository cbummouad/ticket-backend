const Role = require('../models/Role');
const UserRole = require('../models/UserRole');

const roleController = {
  // Get all roles
  async getAllRoles(req, res) {
    try {
      const roles = await Role.findAll();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single role by ID
  async getRoleById(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);
      res.json(role);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Role not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Get role by slug
  async getRoleBySlug(req, res) {
    try {
      const { slug } = req.params;
      const role = await Role.findBySlug(slug);
      res.json(role);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Role not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Create a new role
  async createRole(req, res) {
    try {
      const { name, slug } = req.body;

      if (!name || !slug) {
        return res.status(400).json({ error: 'Name and slug are required' });
      }

      const role = new Role({ name, slug });
      const savedRole = await role.save();
      res.status(201).json(savedRole);
    } catch (error) {
      if (error.code === '23505') {
        res.status(409).json({ error: 'Role with this name or slug already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Update an existing role
  async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, slug } = req.body;

      const role = await Role.findById(id);
      role.name = name || role.name;
      role.slug = slug || role.slug;

      const updatedRole = await role.save();
      res.json(updatedRole);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Role not found' });
      } else if (error.code === '23505') {
        res.status(409).json({ error: 'Role with this name or slug already exists' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Delete a role
  async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);
      await role.delete();
      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Role not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Get users with a specific role
  async getUsersWithRole(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findById(id);
      const users = await role.getUsers();
      res.json(users);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Role not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Assign role to user
  async assignRoleToUser(req, res) {
    try {
      const { userId, roleId } = req.body;

      if (!userId || !roleId) {
        return res.status(400).json({ error: 'userId and roleId are required' });
      }

      const userRole = await UserRole.assignRoleToUser(userId, roleId);
      res.status(201).json(userRole);
    } catch (error) {
      if (error.code === '23505') {
        res.status(409).json({ error: 'User already has this role' });
      } else if (error.code === '23503') {
        res.status(400).json({ error: 'Invalid user or role ID' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Remove role from user
  async removeRoleFromUser(req, res) {
    try {
      const { userId, roleId } = req.body;

      if (!userId || !roleId) {
        return res.status(400).json({ error: 'userId and roleId are required' });
      }

      await UserRole.removeRoleFromUser(userId, roleId);
      res.json({ message: 'Role removed from user successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get roles for a user
  async getUserRoles(req, res) {
    try {
      const { userId } = req.params;
      const userRoles = await UserRole.findByUserId(userId);
      res.json(userRoles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = roleController;
