import express from 'express';
import Tickets from '../Controllers/Tickets';
import Auth from '../Auth/auth';

const router = express.Router();

router.route('/')
  /* POST /v1.0/tickets/ - Create update a ticket in list */
  .post(Auth, Tickets.listTicket)
  /* PUT /v1.0/tickets/ - User updated a ticket order */
  .put(Auth, Tickets.changeTicketOrder);

router.route('/comment')
    /* POST /v1.0/tickets/comment - Post a comment on tickets */
    .post(Auth, Tickets.ticketComments);

module.exports = router;
