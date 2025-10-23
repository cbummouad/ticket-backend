const supabase = require('../config/supabase');

class UserRole {
  constructor(data) {
    this.id = data.id;
    this.id_user = data.id_user;
    this.id_role = data.id_role;
    this.created_at = data.created_at;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        users (
          id,
          email,
          name
        ),
        roles (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(userRole => new UserRole(userRole));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        users (
          id,
          email,
          name
        ),
        roles (
          id,
          name,
          slug
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return new UserRole(data);
  }

  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        roles (
          id,
          name,
          slug
        )
      `)
      .eq('id_user', userId);

    if (error) throw error;
    return data.map(userRole => ({
      ...userRole,
      role: userRole.roles
    }));
  }

  static async findByRoleId(roleId) {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        users (
          id,
          email,
          name
        )
      `)
      .eq('id_role', roleId);

    if (error) throw error;
    return data.map(userRole => ({
      ...userRole,
      user: userRole.users
    }));
  }

  async save() {
    const userRoleData = {
      id_user: this.id_user,
      id_role: this.id_role
    };

    if (this.id) {
      // Update existing user-role relationship
      const { data, error } = await supabase
        .from('user_roles')
        .update(userRoleData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
    } else {
      // Create new user-role relationship
      userRoleData.created_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('user_roles')
        .insert(userRoleData)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
    }

    return this;
  }

  async delete() {
    if (!this.id) throw new Error('Cannot delete user-role relationship without ID');

    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }

  // Static method to assign role to user
  static async assignRoleToUser(userId, roleId) {
    const userRole = new UserRole({ id_user: userId, id_role: roleId });
    return await userRole.save();
  }

  // Static method to remove role from user
  static async removeRoleFromUser(userId, roleId) {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id_user', userId)
      .eq('id_role', roleId);

    if (error) throw error;
  }
}

module.exports = UserRole;
