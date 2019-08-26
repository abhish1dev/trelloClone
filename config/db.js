import Sequelize from 'sequelize';
import env from '../env';

import User from '../server/Models/users';
import Board from '../server/Models/boards';
import UserBoard from '../server/Models/user_board_association';
import BoardList from '../server/Models/board_lists';
import ListTicket from '../server/Models/list_ticket';

const Op = Sequelize.Op;
const sequelize = new Sequelize(env.DATABASE_NAME, env.DATABASE_USERNAME, env.DATABASE_PASSWORD, {
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  dialect: 'mysql',
  dialectOptions: {
    multipleStatements: true
  },
  define: {
    underscored: true
  },
  operatorAliases: Op,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

// Connect all the models/tables in the database to a db object,
// so everything is accessible via one object

const models = {
  Users: User(sequelize, Sequelize),
  Boards: Board(sequelize, Sequelize),
  UserBoards: UserBoard(sequelize, Sequelize),
  BoardList: BoardList(sequelize, Sequelize),
  ListTickets: ListTicket(sequelize, Sequelize)
};

Object.values(models)
  .filter(model => typeof model.associate === "function")
  .forEach(model => model.associate(models));

const db = {
  ...models,
  sequelize,
  Sequelize,
  Op
};

module.exports = db;
