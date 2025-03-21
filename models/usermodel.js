'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class UserModel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserModel.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'UserModel',
    tableName: 'users',
  });
  Model.prototype.isPasswordMatch = async function (password) {
      const user = this;
      return bcrypt.compare(password, user.password);
  };
  UserModel.addHook('beforeCreate', async (user) => {
      user.password = await bcrypt.hash(user.password, 8);
  });
  UserModel.addHook('beforeUpdate', async (user) => {
      user.password = await bcrypt.hash(user.password, 8);
  });
  return UserModel;
};