const Notification = require('../models/Notification');

const notificationController = {
  // Get all notifications for the current user
  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await Notification.findAll(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get unread notifications for the current user
  async getUnreadNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await Notification.findUnread(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mark a notification as read
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const notification = await Notification.findById(id);

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      // Check if notification belongs to current user
      if (notification.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const updatedNotification = await notification.markAsRead();
      res.json(updatedNotification);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Mark all notifications as read for the current user
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await Notification.findUnread(userId);

      const updatePromises = notifications.map(notification => notification.markAsRead());
      await Promise.all(updatePromises);

      res.json({ message: 'All notifications marked as read' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a notification
  async deleteNotification(req, res) {
    try {
      const { id } = req.params;
      const notification = await Notification.findById(id);

      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }

      // Check if notification belongs to current user
      if (notification.user_id !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await notification.delete();
      res.json({ message: 'Notification deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a notification and emit WebSocket event
  async createNotification(userId, title, message, type = 'info', data = null) {
    try {
      const notification = await Notification.create(userId, title, message, type, data);

      // Emit WebSocket notification if io is available
      // This will be set when called from controllers that have access to req.app
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Send real-time notification via WebSocket
  sendRealTimeNotification(io, userId, notificationData) {
    try {
      io.to(`user_${userId}`).emit('notification', notificationData);
    } catch (error) {
      console.error('Error sending real-time notification:', error);
    }
  }
};

module.exports = notificationController;
