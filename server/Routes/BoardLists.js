import express from 'express';
import Validate from 'express-validation';
import BoardLists from '../Controllers/BoardLists';
import Auth from '../Auth/auth';
import Validation from '../Validations/index';

const router = express.Router();

router.route('/')
  /* POST /v1.0/boardLists/ - Create a list in board */
  .post(Auth, BoardLists.boardList)
  /* PUT /v1.0/boardLists/ - User updated a list order */
  .put(Auth, BoardLists.changeListOrder);

module.exports = router;
