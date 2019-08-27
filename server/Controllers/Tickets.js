import db from '../../config/db';
import ResponseObject from '../Helpers/ResponseObject';
import Message from '../Helpers/Message';

const Op = db.Op;
const debug = require('debug')('trelloClone: Controller/Tickets');

class Tickets {

  /**
   * Create, update a ticket in list
   * @params req.body
   * @return Promise
   */


  static async listTicket(req, res, next) {
    try {
      const post = req.body;
      if (post.ticket_id === undefined) {
        const createdListTicket = await db.ListTickets.create(post);
        db.ListTickets.max('ticket_order', {
          where: {
            list_id: post.list_id
          },
          raw: true,
        }).then((ticketCount) => {
          const tCount = (ticketCount === null || ticketCount == 0) ? 1 : ticketCount + 1;
          db.ListTickets.update({
            ticket_order: tCount
          }, {
            where: {
              ticket_id: createdListTicket.dataValues.ticket_id
            }
          });
        });
        res.status(201).json(new ResponseObject(201, Message.ticketCreated));
      } else {
        await db.ListTickets.update(post, {
          where: {
            ticket_id: post.ticket_id
          }
        });
        res.status(201).json(new ResponseObject(201, Message.ticketUpdated));
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * Change ticket order 
   * @params req.body
   * @return Promise
   */


  static async changeTicketOrder(req, res, next) {
    const post = req.body;
    try {
      const oldOrder = await db.ListTickets.findOne({
        where: {
          ticket_id: post.ticket_id
        },
        raw: true,
        attributes: ['ticket_order']
      });
      const maxOrder = await db.ListTickets.max('ticket_order', {
        where: {
          list_id: post.list_id
        },
        raw: true
      });
      if (post.new_order <= maxOrder) {
        await db.ListTickets.update({
          ticket_order: post.new_order
        }, {
          where: {
            ticket_id: post.ticket_id
          }
        });
        const orderChange = (post.new_order > oldOrder.ticket_order) ? 'ticket_order - 1' : 'ticket_order + 1';
        const orderCondition = (post.new_order > oldOrder.ticket_order) ? {
          [Op.gte]: oldOrder.ticket_order,
          [Op.lte]: post.new_order
        } : {
          [Op.gte]: post.new_order,
          [Op.lt]: oldOrder.ticket_order
        };
        await db.ListTickets.update({
          ticket_order: db.Sequelize.literal(orderChange)
        }, {
          where: {
            list_id: post.list_id,
            ticket_id: {
              [Op.ne]: post.ticket_id
            },
            ticket_order: orderCondition
          }
        });
        res.status(201).json(new ResponseObject(201, Message.ticketUpdated));
      } else {
        res.status(200).json(new ResponseObject(400, Message.notInRange));
      }
    } catch (err) {
      next(err);
    }
  }

  /**
   * Comment on tickets
   * @params req.body
   * @return Promise
   */


  static async ticketComments(req, res, next) {
    try {
      const post = req.body;
      post.commented_by = req.user.query.user_id;
      await db.TicketComments.create(post);
      res.status(201).json(new ResponseObject(201, Message.ticketComment));
    } catch (err) {
      next(err);
    }
  }
}

export default Tickets;
