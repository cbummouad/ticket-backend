const express = require('express');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

// GET /api/tickets - Get all tickets
router.get('/', ticketController.getAllTickets);

// GET /api/tickets/:id - Get a single ticket by ID
router.get('/:id', ticketController.getTicketById);

// POST /api/tickets - Create a new ticket
router.post('/', ticketController.createTicket);

// PUT /api/tickets/:id - Update an existing ticket
router.put('/:id', ticketController.updateTicket);

// DELETE /api/tickets/:id - Delete a ticket
router.delete('/:id', ticketController.deleteTicket);

module.exports = router;
