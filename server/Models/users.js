/* jshint indent: 2 */

export default class User {

  static schema(sequelize, DataTypes) {
    return sequelize.define('users', {
      user_id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      salt: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      last_name: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
      profile_image: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'http://localhost/trelloClone/public/images/profile.png'
      },
      profile_thumbnail_image: {
        type: DataTypes.STRING(255),
        allowNull: false,
        defaultValue: 'http://localhost/trelloClone/public/images/profileThumbnail.png'
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      email_verified: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: '0'
      },
      verification_token: {
        type: DataTypes.STRING(255),
        allowNull: true
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
      tableName: 'users'
    });
  }
}
