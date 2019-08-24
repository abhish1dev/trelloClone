import Joi from 'joi';

export default {
  /** Users Model */
  // Login
  login: {
    body: {
      email: Joi.string().required(),
      password: Joi.string().required(),
    }
  },
  // Register User
  registration: {
    body: {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email({
        minDomainAtoms: 2
      }).required(),
      password: Joi.string().required()
    }
  }
};
