import db from '../../config/db';
import ResponseObject from '../Helpers/ResponseObject';
import Message from '../Helpers/Message';
import uploadFile from '../Helpers/uploadFile';

const Op = db.Op;
const debug = require('debug')('trelloClone: Controller/User');

class Users {

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
        console.log(req.user);
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
        res.status(201).json(new ResponseObject(201, Message.boardCreated));
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
}

export default Users;
