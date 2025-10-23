const supabase = require('../config/supabase');

class Role {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(role => new Role(role));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return new Role(data);
  }

  static async findBySlug(slug) {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return new Role(data);
  }

  async save() {
    const roleData = {
      name: this.name,
      slug: this.slug,
      updated_at: new Date().toISOString()
    };

    if (this.id) {
      // Update existing role
      const { data, error } = await supabase
        .from('roles')
        .update(roleData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
    } else {
      // Create new role
      roleData.created_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('roles')
        .insert(roleData)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
    }

    return this;
  }

  async delete() {
    if (!this.id) throw new Error('Cannot delete role without ID');

    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }

  // Get users with this role
  async getUsers() {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        users (
          id,
          email,
          name,
          statut,
          phone,
          address,
          geocode,
          infos,
          solde_actuelle,
          solde_autorise,
          created_at,
          qr_code,
          id_rpp,
          isdeleted,
          code_user,
          image,
          schema
        )
      `)
      .eq('id_role', this.id);

    if (error) throw error;
    return data.map(item => item.users);
  }
}

module.exports = Role;
