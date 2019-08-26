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
  // Invite user
  inviteUser: {
    body: {
      email: Joi.string().email({
        minDomainAtoms: 2
      }).required()
    }
  }
};
