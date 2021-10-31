'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Tasks, {foreignKey : "userID", as : "tasks"})
      this.hasOne(models.verification_tokens, {foreignKey : "userID", as : "verification_token"})
    }
  };
  Users.init({
    id :{
      type : DataTypes.UUID,
      defaultValue : DataTypes.UUIDV4,
      primaryKey : true,
      allowNull : false,
      notEmpty : true
    },
    firstname: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {msg : "First Name field cannot be null"},
        notEmpty : {msg : "First Name field cannot be Empty"},
      }
    },
    auth_provider: {
      type : DataTypes.STRING,
      allowNull: false,
      defaultValue : "local",
      validate : {
        notNull : true,
        notEmpty: true
      }
    },
    lastname: {
      type : DataTypes.STRING,
      allowNull : false,
      validate : {
        notNull : {msg : "Last Name field cannot be null"},
        notEmpty : {msg : "Last Name field cannot be Empty"},
      }
    },
    email: {
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        isEmail : {msg: "Email must be a valid email address"},
        notNull : {msg : "EmailID field cannot be null"},
        notEmpty : {msg : "EmailID field cannot be Empty"},
      }
    },
    verified : {
      type: DataTypes.BOOLEAN,
      defaultValue : false
    },
    password: {
      type: DataTypes.STRING,
      allowNull : false,
      validate:{
        notNull : {msg : "Password field cannot be null"},
        notEmpty : {msg : "Password field cannot be Empty"},
      }
    }
  }, {
    sequelize,
    modelName: 'Users',
    timestamps :false
  });
  return Users;
};