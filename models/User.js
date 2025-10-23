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
      schema: this.schema
    };

    if (this.id) {
      // Update existing user
      console.log('User.save: Updating user with ID:', this.id);
      const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) {
        console.error('User.save: Update error:', error);
        throw error;
      }
      console.log('User.save: Updated user:', data);
      Object.assign(this, data);
    } else {
      // Create new user
      userData.created_at = new Date().toISOString();
      console.log('User.save: Creating new user:', userData);
      const { data, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('User.save: Insert error:', error);
        throw error;
      }
      console.log('User.save: Created user:', data);
      Object.assign(this, data);
    }

    return this;
  }

  async delete() {
    if (!this.id) throw new Error('Cannot delete user without ID');

    console.log('User.delete: Deleting user with ID:', this.id);
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', this.id);

    if (error) {
      console.error('User.delete: Delete error:', error);
      throw error;
    }
    console.log('User.delete: User deleted successfully');
  }
}

module.exports = User;
