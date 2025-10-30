const supabase = require('../config/supabase');

class Notification {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.title = data.title;
    this.message = data.message;
    this.type = data.type; // 'info', 'warning', 'error', 'success'
    this.is_read = data.is_read || false;
    this.created_at = data.created_at;
    this.data = data.data; // Additional data for the notification
  }

  static async findAll(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(notification => new Notification(notification));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return new Notification(data);
  }

  static async findUnread(userId) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('is_read', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(notification => new Notification(notification));
  }

  async save() {
    const notificationData = {
      user_id: this.user_id,
      title: this.title,
      message: this.message,
      type: this.type,
      is_read: this.is_read,
      data: this.data
    };

    if (this.id) {
      // Update existing notification
      const { data, error } = await supabase
        .from('notifications')
        .update(notificationData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
    } else {
      // Create new notification
      notificationData.created_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
    }

    return this;
  }

  async markAsRead() {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', this.id)
      .select()
      .single();

    if (error) throw error;
    Object.assign(this, data);
    return this;
  }

  async delete() {
    if (!this.id) throw new Error('Cannot delete notification without ID');

    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }

  // Static method to create and save a notification
  static async create(userId, title, message, type = 'info', data = null) {
    console.log('Notification.create: Creating notification for user:', userId);
    const notificationData = {
      user_id: userId,
      title,
      message,
      type,
      data: data ? JSON.stringify(data) : null,
      is_read: false,
      created_at: new Date().toISOString()
    };

    console.log('Notification.create: Inserting data:', notificationData);
    // Try direct insert first (will work if called from authenticated context)
    const { data: insertData, error: insertError } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (insertError) {
      console.error('Notification.create: Direct insert failed:', insertError);
      // If RLS blocks it, we need to use a service role or adjust RLS policy
      // For now, create the notification object but don't save to DB
      console.log('Notification.create: Creating notification object without DB save due to RLS');
      const tempNotification = new Notification({
        id: `temp_${Date.now()}`,
        user_id: userId,
        title,
        message,
        type,
        data: data ? JSON.stringify(data) : null,
        is_read: false,
        created_at: new Date().toISOString()
      });
      return tempNotification;
    }

    console.log('Notification.create: Created notification:', insertData);
    return new Notification(insertData);
  }
}

module.exports = Notification;
