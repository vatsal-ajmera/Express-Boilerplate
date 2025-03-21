'use strict';
const {
  Model
} = require('sequelize');
const { tokenTypes } = require('../config/tokens');
module.exports = (sequelize, DataTypes) => {
  class TokenModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TokenModel.belongsTo(models.UserModel, {
          as: 'userDetails',
          foreignKey: 'userId',
      });
    }
  }
  TokenModel.init({
    userId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    blacklisted: DataTypes.BOOLEAN,
    type: {
      type: DataTypes.ENUM(
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL
      ),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'TokenModel',
    tableName: 'tokens'
  });
  return TokenModel;
};