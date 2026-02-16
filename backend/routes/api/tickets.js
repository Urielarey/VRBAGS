const express = require('express');
const router = express.Router();
const ticketController = require('../../controllers/ticketController');
const { authenticate, authorize } = require('../../middleware/auth');

// POST para usuarios autenticados
router.post('/', authenticate, ticketController.createTicket.bind(ticketController));

// POST para usuarios NO autenticados (guest)
router.post('/guest', ticketController.createGuestTicket.bind(ticketController));

// GET tickets del usuario actual (debe ir antes de /all y /:tid)
router.get('/', authenticate, ticketController.getUserTickets.bind(ticketController));

// GET todos los tickets (solo admin) - debe ir antes de /:tid
router.get('/all', authenticate, authorize('admin'), ticketController.getAllTickets.bind(ticketController));

// GET tickets por email (para asociar al registrarse/iniciar sesión) - sin autenticación
router.get('/email/:email', ticketController.getTicketsByEmail.bind(ticketController));

// PUT para asociar tickets pendientes a un usuario
router.put('/associate', authenticate, ticketController.associateTicketsToUser.bind(ticketController));

// PUT para actualizar estado de un ticket (solo admin) - debe ir antes de /:tid
router.put('/:id/status', authenticate, authorize('admin'), ticketController.updateTicketStatus.bind(ticketController));

// GET ticket por ID (debe ir al final)
router.get('/:tid', authenticate, ticketController.getTicketById.bind(ticketController));

module.exports = router;
