/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const TicketComment = sequelize.define('ticket_comments', {
    comment_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    ticket_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'list_ticket',
        key: 'ticket_id'
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    commented_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
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
    tableName: 'ticket_comments',
  });
  TicketComment.associate = (models) => {
    TicketComment.belongsTo(models.ListTickets, {
      foreignKey: 'ticket_id',
      as: 'listTickets'
    });
  };
  return TicketComment;
}
