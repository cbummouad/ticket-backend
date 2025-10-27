const Ticket = require('../models/Ticket');

const ticketController = {
  // Get all tickets
  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.findAll();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get tickets by user ID
  async getTicketsByUser(req, res) {
    try {
      const { userId } = req.params;
      const tickets = await Ticket.findByUserId(userId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get tickets assigned to an agent
  async getTicketsByAgent(req, res) {
    try {
      const { agentId } = req.params;
      const tickets = await Ticket.findByAssignedAgent(agentId);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single ticket by ID
  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findById(id);
      res.json(ticket);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Ticket not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Create a new ticket
  async createTicket(req, res) {
    try {
      const { title, type, description, iduser, affectdate, assignedagent, priority, difficulty, status } = req.body;

      if (!title || !description || !iduser) {
        return res.status(400).json({ error: 'Title, description, and iduser are required' });
      }

      const ticket = new Ticket({
        title,
        type,
        description,
        iduser,
        publishdate: new Date().toISOString(),
        affectdate,
        assignedagent,
        priority: priority || 'medium',
        difficulty: difficulty || 'medium',
        status: status || 'open'
      });
      const savedTicket = await ticket.save();
      res.status(201).json(savedTicket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update an existing ticket
  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const { title, type, description, iduser, affectdate, resolvedate, assignedagent, priority, difficulty, status } = req.body;

      const ticket = await Ticket.findById(id);
      ticket.title = title || ticket.title;
      ticket.type = type || ticket.type;
      ticket.description = description || ticket.description;
      ticket.iduser = iduser || ticket.iduser;
      ticket.affectdate = affectdate || ticket.affectdate;
      ticket.resolvedate = resolvedate || ticket.resolvedate;
      ticket.assignedagent = assignedagent || ticket.assignedagent;
      ticket.priority = priority || ticket.priority;
      ticket.difficulty = difficulty || ticket.difficulty;
      ticket.status = status || ticket.status;

      const updatedTicket = await ticket.save();
      res.json(updatedTicket);
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Ticket not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Delete a ticket
  async deleteTicket(req, res) {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findById(id);
      await ticket.delete();
      res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      if (error.code === 'PGRST116') {
        res.status(404).json({ error: 'Ticket not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  }
};

module.exports = ticketController;
