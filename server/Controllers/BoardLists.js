import db from '../../config/db';
import ResponseObject from '../Helpers/ResponseObject';
import Message from '../Helpers/Message';

const Op = db.Op;
const debug = require('debug')('trelloClone: Controller/BoardLists');

class BoardLists {

  /**
   * Create, update a list in board
   * @params req.body
   * @return Promise
   */


  static async boardList(req, res, next) {
    try {
      const post = req.body;
      if (post.list_id === undefined) {
        const createdBoardList = await db.BoardList.create(post);
        db.BoardList.max('list_order', {
          where: {
            board_id: post.board_id
          },
          raw: true,
        }).then((listCount) => {
          const boardCount = (listCount === null || listCount == 0) ? 1 : listCount + 1;
          db.BoardList.update({
            list_order: boardCount
          }, {
            where: {
              list_id: createdBoardList.list_id
            }
          });
        });
        res.status(201).json(new ResponseObject(201, Message.listCreated));
      } else {
        await db.BoardList.update(post, {
          where: {
            list_id: post.list_id
          }
        });
        res.status(201).json(new ResponseObject(201, Message.listUpdated));
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * Change list order board
   * @params req.body
   * @return Promise
   */


  static async changeListOrder(req, res, next) {
    const post = req.body;
    try {
      await db.BoardList.update({
        list_order: post.new_order
      }, {
        where: {
          list_id: post.list_id
        }
      });
      await db.BoardList.update({
        list_order: db.Sequelize.literal('list_order + 1')
      }, {
        where: {
          board_id: post.board_id,
          list_id: {
            [Op.ne]: post.list_id
          },
          list_order: {
            [Op.gte]: post.new_order,
            [Op.lt]: post.old_order
          }
        }
      });
      res.status(201).json(new ResponseObject(201, Message.listUpdated));
    } catch (err) {
      next(err);
    }
  }

}

export default BoardLists;
