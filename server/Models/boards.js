/* jshint indent: 2 */

export default (sequelize, DataTypes) => {
  const Board = sequelize.define('boards', {
    board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    board_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    board_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    board_image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'http://localhost/trelloClone/public/images/board.png'
    },
    board_thumbnail_image: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: 'http://localhost/trelloClone/public/images/boardThumbnail.png'
    },
    board_created_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    is_active: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '1'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    board_order: {
      type: DataTypes.INTEGER(3),
      allowNull: false,
      defaultValue: '0'
    }
  }, {
    tableName: 'boards'
  });
  Board.associate = (models) => {
    Board.belongsTo(models.Users, {
      foreignKey: 'board_created_by',
      as: 'boardAdmin'
    });
    Board.belongsToMany(models.Users, {
      through: 'UserBoards',
      foreignKey: 'invited_to',
      as: 'invitedUsers'
    });
    Board.hasMany(models.BoardList, {
      as: 'boardList'
    });
  };
  return Board;
};
