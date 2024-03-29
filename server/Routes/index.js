import express from 'express';
import userRoutes from './User';
import boardRoutes from './Board';
import boardListsRoutes from './BoardLists';
import ticketRoutes from './Tickets';
import ResponseObject from '../Helpers/ResponseObject';

const router = express.Router();

/** GET /welcome - Welcome to Trello Clone API */
router.get('/welcome', (req, res) =>
  res.status(200).json(new ResponseObject(200, {
    message: 'Welcome to Trello Clone API'
  }))
);

// mount user routes at /users
router.use('/users', userRoutes);

// mount board routes at /boards
router.use('/boards', boardRoutes);

// mount board lists routes at /boardLists
router.use('/boardLists', boardListsRoutes);

// mount list tickets routes at /listTickets
router.use('/listTickets', ticketRoutes);

export default router;
