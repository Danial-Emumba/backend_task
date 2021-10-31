'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('verification_tokens', {
      id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
        allowNull : false,
        validate : {
          notEmpty : true,
          notNull : true
        }
      },
      userID: {
        type: DataTypes.UUID,
        allowNull : false,
        validate : {
          notNull : true,
          notEmpty : true
        } 
      },
      token : {
        type: DataTypes.STRING,
        allowNull : false,
        validate : {
          notNull : true,
          notEmpty : true
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('verification_tokens');
  }
};