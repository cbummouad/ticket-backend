const Ticket = require('../models/Ticket');

// In-memory storage for testing (replace with database in production)
let tickets = [
  {
    id: '1',
    title: 'Sample Ticket 1',
    description: 'This is a sample ticket',
    status: 'open',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const ticketController = {
  // Get all tickets
  async getAllTickets(req, res) {
    try {
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get a single ticket by ID
  async getTicketById(req, res) {
    try {
      const { id } = req.params;
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create a new ticket
  async createTicket(req, res) {
    try {
      const { title, description, status } = req.body;

      if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
      }

      const newTicket = {
        id: Date.now().toString(),
        title,
        description,
        status: status || 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await  new Ticket(newTicket).save()
      tickets.push(newTicket);
      res.status(201).json(newTicket);
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update an existing ticket
  async updateTicket(req, res) {
    try {
      const { id } = req.params;
      const { title, description, status } = req.body;

      const ticketIndex = tickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      tickets[ticketIndex] = {
        ...tickets[ticketIndex],
        title: title || tickets[ticketIndex].title,
        description: description || tickets[ticketIndex].description,
        status: status || tickets[ticketIndex].status,
        updated_at: new Date().toISOString()
      };

      res.json(tickets[ticketIndex]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete a ticket
  async deleteTicket(req, res) {
    try {
      const { id } = req.params;
      const ticketIndex = tickets.findIndex(t => t.id === id);
      if (ticketIndex === -1) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      tickets.splice(ticketIndex, 1);
      res.json({ message: 'Ticket deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = ticketController;
