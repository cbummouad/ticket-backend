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
      const { title, description, status } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      const ticket = new Ticket({ title, description, status });
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
      const { title, description, status } = req.body;

      const ticket = await Ticket.findById(id);
      ticket.title = title || ticket.title;
      ticket.description = description || ticket.description;
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
