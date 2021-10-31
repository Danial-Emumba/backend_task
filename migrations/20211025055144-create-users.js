'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Users', {
      id :{
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
        allowNull : false,
        notEmpty : true
      },
      firstname: {
        type : DataTypes.STRING,
        validate : {
          notNull : {msg : "First Name field cannot be null"},
          notEmpty : {msg : "First Name field cannot be Empty"},
        }
      },
      lastname: {
        type : DataTypes.STRING,
        validate : {
          notNull : {msg : "Last Name field cannot be null"},
          notEmpty : {msg : "Last Name field cannot be Empty"},
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
      email: {
        type : DataTypes.STRING,
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
        validate:{
          notNull : {msg : "Password field cannot be null"},
          notEmpty : {msg : "Password field cannot be Empty"},
        }
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('Users');
  }
};