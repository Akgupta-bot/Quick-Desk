const express = require('express');
const ticketController = require('../controllers/ticketController');
const authController = require('../controllers/userController');
const commentRouter = require('./commentRoutes');

const router = express.Router();

router.use('/:ticketId/comments', commentRouter);

router.use(authController.protect);

router
    .route('/')
    .get(ticketController.getAllTickets)
    .post(
        ticketController.uploadTicketAttachments,
        ticketController.processTicketAttachments,
        ticketController.createTicket
    );

router.get(
    '/my-tickets',
    authController.restrictTo('SupportAgent', 'Admin'),
    ticketController.getMyTickets
);

router.patch(
    '/:id/assign',
    authController.restrictTo('SupportAgent', 'Admin'),
    ticketController.assignTicketToMe
);

router.patch('/:id/vote', ticketController.voteOnTicket);

router
    .route('/:id')
    .get(ticketController.getTicket)
    .patch(
        authController.restrictTo('SupportAgent', 'Admin'),
        ticketController.updateTicket
    )
    .delete(
        authController.restrictTo('Admin'),
        ticketController.deleteTicket
    );


module.exports = router;