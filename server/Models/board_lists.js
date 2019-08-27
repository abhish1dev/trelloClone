/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const BoardList = sequelize.define('board_lists', {
    list_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'boards',
        key: 'board_id'
      }
    },
    list_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    list_order: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
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
    }
  }, {
    tableName: 'board_lists'
  });
  BoardList.associate = (models) => {
    BoardList.belongsTo(models.Boards, {
      foreignKey: 'board_id',
      as: 'boardLists'
    });
    BoardList.hasMany(models.ListTickets, {
      as: 'boardTickets'
    });
  };
  return BoardList;
}
