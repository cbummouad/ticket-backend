const supabase = require('../config/supabase');

class Ticket {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.status = data.status || 'open';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(ticket => new Ticket(ticket));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return new Ticket(data);
  }

  async save() {
    const ticketData = {
      title: this.title,
      description: this.description,
      status: this.status,
      updated_at: new Date().toISOString()
    };

    if (this.id) {
      // Update existing ticket
      const { data, error } = await supabase
        .from('tickets')
        .update(ticketData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
    } else {
      // Create new ticket
      ticketData.created_at = new Date().toISOString();
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select()
        .single();

      if (error) throw error;
      Object.assign(this, data);
    }

    return this;
  }

  async delete() {
    if (!this.id) throw new Error('Cannot delete ticket without ID');

    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', this.id);

    if (error) throw error;
  }
}

module.exports = Ticket;
