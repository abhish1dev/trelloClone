import express from 'express';
import Validate from 'express-validation';
import Board from '../Controllers/Board';
import Auth from '../Auth/auth';
import Validation from '../Validations/index';

const router = express.Router();

router.route('/')
  /* POST /v1.0/boards/ - User created a board */
  .post(Auth, Board.createBoard)
  /* PUT /v1.0/boards/ - User updated a board */
  .put(Auth, Board.updateBoard);

router.route('/inviteUser')
  /* POST /v1.0/boards/inviteUser - Invite user to board */
  .post(Auth, Validate(Validation.inviteUser), Board.inviteUser);

router.route('/registerInvitedUser/:token')
  /* PUT /v1.0/boards/inviteUser - Register the invited user */
  .put(Board.registerInvitedUser);

// router.route('/login')
//   /* POST /v1.0/frontDesk/login - frontDesk login */
//   .post(Validate(Validation.login), User.login);

module.exports = router;
