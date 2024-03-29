/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const UserBoard = sequelize.define('user_board_association', {
    user_board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    invited_to: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    board_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'boards',
        key: 'board_id'
      }
    },
    invitation_accepted: {
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
    tableName: 'user_board_association'
  });
  UserBoard.associate = (models) => {
    UserBoard.belongsTo(models.Users, {
      foreignKey: 'invited_to',
      as: 'invited'
    });
    UserBoard.belongsTo(models.Boards, {
      foreignKey: 'board_id',
      as: 'board'
    });
  };
  return UserBoard;
}
