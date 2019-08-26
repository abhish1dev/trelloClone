import express from 'express';
import Validate from 'express-validation';
import Tickets from '../Controllers/Tickets';
import Auth from '../Auth/auth';
import Validation from '../Validations/index';

const router = express.Router();

router.route('/')
  /* POST /v1.0/tickets/ - Create update a ticket in list */
  .post(Auth, Tickets.listTicket)
  /* PUT /v1.0/tickets/ - User updated a ticket order */
  .put(Auth, Tickets.changeTicketOrder);

module.exports = router;
