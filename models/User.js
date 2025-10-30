const supabase = require('../config/supabase');

class User {
  constructor(data) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.statut = data.statut;
    this.phone = data.phone;
    this.address = data.address;
    this.geocode = data.geocode;
    this.infos = data.infos;
    this.solde_actuelle = data.solde_actuelle;
    this.solde_autorise = data.solde_autorise;
    this.created_at = data.created_at;
    this.qr_code = data.qr_code;
    this.id_rpp = data.id_rpp;
    this.isdeleted = data.isdeleted || false;
    this.code_user = data.code_user;
    this.image = data.image;
    this.schema = data.schema;
  }

  static async findAll() {
    console.log('User.findAll: Fetching all users from Supabase');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('User.findAll: Supabase error:', error);
      throw error;
    }
    console.log('User.findAll: Retrieved', data.length, 'users');
    return data.map(user => new User(user));
  }

  static async findById(id) {
    console.log('User.findById: Fetching user with ID:', id);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('User.findById: Supabase error:', error);
      if (error.code === 'PGRST116') {
        return null; // User not found
      }
      throw error;
    }
    console.log('User.findById: Retrieved user:', data);
    return new User(data);
  }

  static async findByEmail(email) {
    console.log('User.findByEmail: Fetching user with email:', email);
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('User.findByEmail: Supabase error:', error);
      throw error;
    }
    console.log('User.findByEmail: Retrieved user:', data);
    return new User(data);
  }

  async save() {
    const userData = {
      id: this.id,
      email: this.email,
      name: this.name,
      statut: this.statut,
      phone: this.phone,
      address: this.address,
      geocode: this.geocode,
      infos: this.infos,
      solde_actuelle: this.solde_actuelle,
      solde_autorise: this.solde_autorise,
      qr_code: this.qr_code,
      id_rpp: this.id_rpp,
      isdeleted: this.isdeleted,
      code_user: this.code_user,
      image: this.image,
      schema: this.schema,
      created_at: this.id ? undefined : new Date().toISOString() // Only set created_at on insert
    };

    console.log('User.save: Upserting user:', userData);
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single();

    if (error) {
      console.error('User.save: Upsert error:', error);
      throw error;
    }
    console.log('User.save: Upserted user:', data);
    Object.assign(this, data);

    return this;
  }

  async deleteUser() {
    if (!this.id) throw new Error('Cannot delete user without ID');

    console.log('User.deleteUser: Deleting user with ID:', this.id);
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', this.id);

    if (error) {
      console.error('User.deleteUser: Delete error:', error);
      throw error;
    }
    console.log('User.deleteUser: User deleted successfully');
  }

  // Get roles for this user
  async getRoles() {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        roles (
          id,
          name,
          slug,
          created_at,
          updated_at
        )
      `)
      .eq('id_user', this.id);

    if (error) throw error;
    return data.map(item => item.roles);
  }

  // Assign a role to this user
  async assignRole(roleId) {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        id_user: this.id,
        id_role: roleId
      })
      .select();

    if (error) throw error;
    return data;
  }

  // Remove a role from this user
  async removeRole(roleId) {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('id_user', this.id)
      .eq('id_role', roleId);

    if (error) throw error;
  }
}

module.exports = User;
