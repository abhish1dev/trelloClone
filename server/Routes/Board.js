import express from 'express';
import Validate from 'express-validation';
import Board from '../Controllers/Board';
import Auth from '../Auth/auth';
import Validation from '../Validations/Users';

const router = express.Router();

router.route('/')
  /* POST /v1.0/boards/ - User created a board */
  .post(Auth, Board.createBoard)
  /* PUT /v1.0/boards/ - User updated a board */
  .put(Auth, Board.updateBoard);

// router.route('/verify/:token')
//   /* GET /v1.0/users/ - Verify email of user by token */
//   .get(User.emailVerification);

// router.route('/login')
//   /* POST /v1.0/frontDesk/login - frontDesk login */
//   .post(Validate(Validation.login), User.login);

module.exports = router;
