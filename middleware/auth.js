const supabase = require('../config/supabase');
const UserRole = require('../models/UserRole');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    // Verify the Supabase session token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    req.user = {
      id: user.id,
      email: user.email
    };

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Middleware to check if user has admin role
const requireAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required.' });
    }

    // Check if user has admin role
    const userRoles = await UserRole.findByUserId(req.user.id);
    const hasAdminRole = userRoles.some(userRole => userRole.role && userRole.role.name && userRole.role.name.toLowerCase() === 'admin');

    if (!hasAdminRole) {
      return res.status(403).json({ error: 'Admin access required.' });
    }

    next();
  } catch (error) {
    console.error('Error checking admin role:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

module.exports = { auth, requireAdmin };
