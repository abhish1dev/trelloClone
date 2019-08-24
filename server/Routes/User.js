import express from 'express';
import Validate from 'express-validation';
import User from '../Controllers/User';
import Auth from '../Auth/auth';
import Validation from '../Validations/Users';

const router = express.Router();


router.route('/')
  /* POST /v1.0/users/ - Register user */
  .post(User.registration);

router.route('/verify/:token')
  /* GET /v1.0/users/ - Verify email of user by token */
  .get(User.emailVerification);

router.route('/login')
  /* POST /v1.0/frontDesk/login - frontDesk login */
  .post(Validate(Validation.login), User.login);

module.exports = router;
