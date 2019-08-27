import hat from 'hat';
import db from '../../config/db';
import ResponseObject from '../Helpers/ResponseObject';
import Message from '../Helpers/Message';
import uploadFile from '../Helpers/uploadFile';
import Email from '../Email/user';
import PasswordManager from '../Helpers/PasswordManager';

const Op = db.Op;
const debug = require('debug')('trelloClone: Controller/Board');

class Board {

  /**
   * User create a board
   * @params req.body
   * @return Promise
   */


  static createBoard(req, res, next) {
    uploadFile.uploadFile(req, async (cb) => {
      if (cb.success != true) {
        res.status(500).json(new ResponseObject(500, cb));
      }
      try {
        const post = cb.fields;
        const userId = req.user.query.user_id;
        debug(req.user);
        post.board_created_by = userId;
        const boardCreated = await db.Boards.create(post);
        const boardId = boardCreated.board_id;
        db.Boards.max('board_order', {
          where: {
            board_created_by: userId
          },
          raw: true,
        }).then((board) => {
          const boardCount = (board === null || board == 0) ? 1 : board + 1;
          db.Boards.update({
            board_order: boardCount
          }, {
            where: {
              board_id: boardId
            }
          });
        });
        if (cb.fileDetail.length) {
          const imgpath = `board/${boardId}/`;
          uploadFile.generateThumbnail(imgpath, cb.fileDetail[0], (fileObj) => {
            db.Boards.update({
              board_image: fileObj.profile_image,
              board_thumbnail_image: fileObj.profile_thumbnail_image
            }, {
              where: {
                board_id: boardId
              }
            });
          });
        }
        res.status(201).json(new ResponseObject(201, Message.boardCreated, boardId));
      } catch (err) {
        next(err);
      }
    });
  }

  /**
   * User update a board
   * @params req.body
   * @return Promise
   */


  static updateBoard(req, res, next) {
    uploadFile.uploadFile(req, async (cb) => {
      if (cb.success != true) {
        res.status(500).json(new ResponseObject(500, cb));
      }
      try {
        const post = cb.fields;
        const boardCreated = await db.Boards.update(post, {
          where: {
            board_id: post.board_id
          }
        });
        if (cb.fileDetail.length) {
          const boardId = boardCreated.board_id;
          const imgpath = `board/${boardId}/`;
          uploadFile.generateThumbnail(imgpath, cb.fileDetail[0], (fileObj) => {
            db.Boards.update({
              board_image: fileObj.profile_image,
              board_thumbnail_image: fileObj.profile_thumbnail_image
            }, {
              where: {
                board_id: boardId
              }
            });
          });
        }
        res.status(201).json(new ResponseObject(201, Message.boardUpdated));
      } catch (err) {
        next(err);
      }
    });
  }

  /**
   * Invite User
   * @params req.body
   * @return Promise
   */


  static async inviteUser(req, res, next) {
    const post = req.body;
    const invitedBy = req.user.query.first_name;
    try {
      const userExisted = await db.Users.findOne({
        where: {
          email: post.email
        },
        raw: true,
        attributes: ['user_id']
      });
      if (userExisted) {
        const invitationExisted = await db.UserBoards.findOne({
          where: {
            invited_to: userExisted.user_id,
            board_id: post.board_id
          },
          raw: true,
          attributes: ['invitation_accepted']
        });
        if (invitationExisted) {
          res.status(200).json(new ResponseObject(200, Message.userAlreadyInvited));
        } else {
          await associateUserBoard(post.email, invitedBy, userExisted.user_id, post.board_id, 1, null);
          res.status(201).json(new ResponseObject(201, Message.userInvited));
        }
      } else {
        const token = hat() + Date.now();
        const userCreated = await db.Users.create({
          email: post.email,
          verification_token: token
        });
        await associateUserBoard(post.email, invitedBy, userCreated.user_id, post.board_id, 0, token);
        res.status(201).json(new ResponseObject(201, Message.userInvited));
      }
    } catch (err) {
      next(err);
    }
    const token = hat() + Date.now();
  }

  /**
   * Register Invited User
   * @params req.body
   * @return Promise
   */


  static async registerInvitedUser(req, res, next) {
    const token = req.params.token;
    const verifyToken = await db.Users.findOne({
      where: {
        verification_token: token
      },
      raw: true,
      attributes: ['user_id', 'email']
    });
    console.log(verifyToken);
    if (verifyToken !== null) {
      uploadFile.uploadFile(req, async (cb) => {
        if (cb.success != true) {
          res.status(500).json(new ResponseObject(500, cb));
        }
        const post = cb.fields;
        const pmHelper = new PasswordManager();
        pmHelper.txtPassword = post.password;
        const passwordObj = pmHelper.createPasswordHash();
        post.password = passwordObj.password;
        post.salt = passwordObj.salt;
        post.verification_token = null;
        try {
          const userCreated = await db.Users.update(post, {
            where: {
              verification_token: token
            }
          });
          const invitationAccepted = await db.UserBoards.update({
            invitation_accepted: 1
          }, {
            where: {
              invited_to: verifyToken.user_id
            }
          });
          if (cb.fileDetail.length) {
            const userId = verifyToken.user_id;
            const imgpath = `profile/${userId}/`;
            uploadFile.generateThumbnail(imgpath, cb.fileDetail[0], (fileObj) => {
              db.Users.update(fileObj, {
                where: {
                  user_id: userId
                }
              });
            });
          }
          res.status(200).json(new ResponseObject(200, Message.invitedRegistration));
        } catch (err) {
          next(err);
        }
      });
    } else {
      res.status(200).json(new ResponseObject(400, Message.linkExpired));
    }
  }


}


/**
 * Create user board association
 * @params email, invitedBy, userId, boardId, invitationAccepted, token
 * @return Promise
 */

async function associateUserBoard(uEmail, invitedBy, userId, boardId, invitationAccepted, token) {
  return new Promise((resolve, reject) => {
    const userBoardAssociated = db.UserBoards.create({
      invited_to: userId,
      board_id: boardId,
      invitation_accepted: invitationAccepted
    });
    if (!invitationAccepted) {
      const email = new Email();
      email.inviteUser(uEmail, invitedBy, token);
    }
    resolve(userBoardAssociated);
  });
}

export default Board;
