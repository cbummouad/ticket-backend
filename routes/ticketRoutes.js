const express = require('express');
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/tickets - Get all tickets (protected)
router.get('/', auth, ticketController.getAllTickets);

// GET /api/tickets/:id - Get a single ticket by ID (protected)
router.get('/:id', auth, ticketController.getTicketById);

// POST /api/tickets - Create a new ticket (protected)
router.post('/', auth, ticketController.createTicket);

// PUT /api/tickets/:id - Update an existing ticket (protected)
router.put('/:id', auth, ticketController.updateTicket);

// DELETE /api/tickets/:id - Delete a ticket (protected)
router.delete('/:id', auth, ticketController.deleteTicket);

module.exports = router;
