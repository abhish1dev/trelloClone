/* jshint indent: 2 */

export default function (sequelize, DataTypes) {
  const ListTickets = sequelize.define('list_ticket', {
    ticket_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    list_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'board_lists',
        key: 'list_id'
      }
    },
    ticket_title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    ticket_assigned_to: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    ticket_assigned_by: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    ticket_description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    ticket_start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ticket_end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ticket_order: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
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
    tableName: 'list_ticket'
  });
  return ListTickets;
}
