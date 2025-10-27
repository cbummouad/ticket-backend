const supabase = require('../config/supabase');

class Ticket {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.type = data.type;
    this.description = data.description;
    this.iduser = data.iduser;
    this.publishdate = data.publishdate;
    this.affectdate = data.affectdate;
    this.resolvedate = data.resolvedate;
    this.assignedagent = data.assignedagent;
    this.priority = data.priority || 'medium';
    this.difficulty = data.difficulty || 'medium';
    this.status = data.status || 'open';
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async findAll() {
    console.log('Ticket.findAll: Fetching all tickets from Supabase');
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        creator:users!tickets_iduser_fkey (
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
          qr_code,
          id_rpp,
          code_user,
          image,
          schema
        ),
        agent:users!tickets_assignedagent_fkey (
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
          qr_code,
          id_rpp,
          code_user,
          image,
          schema
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ticket.findAll: Supabase error:', error);
      throw error;
    }
    console.log('Ticket.findAll: Retrieved', data.length, 'tickets');
    return data.map(ticket => ({
      ...new Ticket(ticket),
      user: ticket.creator,
      agent: ticket.agent
    }));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        creator:users!tickets_iduser_fkey (
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
          qr_code,
          id_rpp,
          code_user,
          image,
          schema
        ),
        agent:users!tickets_assignedagent_fkey (
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
          qr_code,
          id_rpp,
          code_user,
          image,
          schema
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return {
      ...new Ticket(data),
      user: data.creator,
      agent: data.agent
    };
  }

  static async findByUserId(userId) {
    console.log('Ticket.findByUserId: Fetching tickets for user:', userId);
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        creator:users!tickets_iduser_fkey (
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
          qr_code,
          id_rpp,
          code_user,
          image,
          schema
        ),
        agent:users!tickets_assignedagent_fkey (
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
          qr_code,
          id_rpp,
          code_user,
          image,
          schema
        )
      `)
      .eq('iduser', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ticket.findByUserId: Supabase error:', error);
      throw error;
    }
    console.log('Ticket.findByUserId: Retrieved', data.length, 'tickets for user');
    return data.map(ticket => ({
      ...new Ticket(ticket),
      user: ticket.creator,
      agent: ticket.agent
    }));
  }

  static async findByAssignedAgent(agentId) {
    console.log('Ticket.findByAssignedAgent: Fetching tickets assigned to agent:', agentId);
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        creator:users!tickets_iduser_fkey (
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
          qr_code,
          id_rpp,
          code_user,
          image,
          schema
        ),
        agent:users!tickets_assignedagent_fkey (
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
          qr_code,
          id_rpp,
          code_user,
          image,
          schema
        )
      `)
      .eq('assignedagent', agentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Ticket.findByAssignedAgent: Supabase error:', error);
      throw error;
    }
    console.log('Ticket.findByAssignedAgent: Retrieved', data.length, 'tickets for agent');
    return data.map(ticket => ({
      ...new Ticket(ticket),
      user: ticket.creator,
      agent: ticket.agent
    }));
  }

  async save() {
    const ticketData = {
      title: this.title,
      type: this.type,
      description: this.description,
      iduser: this.iduser,
      publishdate: this.publishdate,
      affectdate: this.affectdate,
      resolvedate: this.resolvedate,
      assignedagent: this.assignedagent,
      priority: this.priority,
      difficulty: this.difficulty,
      status: this.status,
      updated_at: new Date().toISOString()
    };

    if (this.id) {
      // Update existing ticket
      console.log('Ticket.save: Updating ticket with ID:', this.id);
      const { data, error } = await supabase
        .from('tickets')
        .update(ticketData)
        .eq('id', this.id)
        .select()
        .single();

      if (error) {
        console.error('Ticket.save: Update error:', error);
        throw error;
      }
      console.log('Ticket.save: Updated ticket:', data);
      Object.assign(this, data);
    } else {
      // Create new ticket
      ticketData.created_at = new Date().toISOString();
      console.log('Ticket.save: Creating new ticket:', ticketData);
      const { data, error } = await supabase
        .from('tickets')
        .insert(ticketData)
        .select()
        .single();

      if (error) {
        console.error('Ticket.save: Insert error:', error);
        throw error;
      }
      console.log('Ticket.save: Created ticket:', data);
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
