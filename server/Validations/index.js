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
  },
  /** BoardList Model */
  createdBoardList: {
    body: Joi.object().keys({
      board_id: Joi.required(),
      list_title: Joi.string().required(),
      list_id: Joi.required()
    }).min(2).max(2)
  }
};
