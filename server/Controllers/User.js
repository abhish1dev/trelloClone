import db from '../../config/db';
import ResponseObject from '../Helpers/ResponseObject';
import Message from '../Helpers/Message';
import uploadFile from '../Helpers/uploadFile';
import PasswordManager from '../Helpers/PasswordManager';
import Email from '../Email/user';
import Jwt from '../Helpers/AuthJWT';

const Op = db.Op;
const debug = require('debug')('trelloClone: Controller/User');

class Users {

  /**
   * Login verification of user
   * @params req.body{email_id,password}
   * @return Promise
   */


  static async login(req, res, next) {
    try {
      const post = req.body;
      const userDetail = await db.Users.findOne({
        where: {
          email: post.email
        },
        raw: true,
        attributes: ['password', 'salt', 'user_id', 'first_name', 'last_name', 'email_verified', 'is_active']
      });

      if (userDetail) {
        const isActive = userDetail.is_active;
        const emailVerified = userDetail.email_verified;
        const pmHelper = new PasswordManager();
        pmHelper.salt = userDetail.salt;
        pmHelper.inputedPassword = post.password;
        pmHelper.existingPassword = userDetail.password;
        if (pmHelper.verifyPassword()) {
          if (isActive === 0 || emailVerified === 0) {
            const statusMessage = (isActive === 0) ? Message.accountDeactivated : Message.emailNotVerified;
            res.status(200).json(new ResponseObject(500, statusMessage));
          }
          const auth = new Jwt();
          const payloadQuery = {
            user_id: userDetail.user_id,
            first_name: userDetail.first_name,
            last_name: userDetail.last_name
          };
          auth.payload = {
            query: payloadQuery
          };
          const tokenObj = auth.generateToken();
          res.status(200).json(new ResponseObject(200, Message.loggedIn, tokenObj));
        } else {
          res.status(200).json(new ResponseObject(500, Message.wrongEmail));
        }
      } else {
        res.status(200).json(new ResponseObject(500, Message.wrongEmail));
      }
    } catch (err) {
      next(err);
    }
  }


  /**
   * User registration
   * @params req.body
   * @return Promise
   */


  static registration(req, res, next) {
    uploadFile.uploadFile(req, async (cb) => {
      if (cb.success != true) {
        res.status(500).json(new ResponseObject(500, cb));
      }
      const post = cb.fields;
      const pmHelper = new PasswordManager();
      const email = new Email();
      pmHelper.txtPassword = post.password;
      const passwordObj = pmHelper.createPasswordHash();
      post.password = passwordObj.password;
      post.salt = passwordObj.salt;
      try {
        const userCreated = await db.Users.create(post);
        email.registration(userCreated);
        debug(cb.fileDetail);
        if (cb.fileDetail.length) {
          const userId = userCreated.user_id;
          const imgpath = `profile/${userId}/`;
          uploadFile.generateThumbnail(imgpath, cb.fileDetail[0], (fileObj) => {
            db.Users.update(fileObj, {
              where: {
                user_id: userId
              }
            });
          });
        }
        res.status(200).json(new ResponseObject(200, Message.registration));
      } catch (err) {
        next(err);
      }
    });
  }


  /**
   * Email verification
   * @params req.params
   * @return Promise
   */


  static async emailVerification(req, res, next) {
    try {
      const token = req.params.token;
      const userVerified = await db.Users.update({
        email_verified: 1,
        verification_token: null
      }, {
        where: {
          verification_token: token
        }
      });
      const statusMessage = (userVerified[0] === 0) ? Message.linkExpired : Message.emailVerified;
      res.status(200).json(new ResponseObject(200, statusMessage));
    } catch (err) {
      next(err);
    }
  }
}
export default Users;
