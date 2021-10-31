'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('Tasks', {
      id:{
        type : DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey : true,
        allowNull : false,
        validate:{
          notEmpty : true
        }
      },
      title: {
         type: DataTypes.STRING,
         validate:{
           notEmpty : true,
           notNull:true
         }
      },
      userID :{
        type: DataTypes.UUID,
        allowNull : false
      },
      description: {
        type: DataTypes.STRING,
        validate:{
          notEmpty : true,
          notNull:true
        }
      },
      dueDate: {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW,
        validate:{
          notNull : true,
          notEmpty : true
        }
      },
      attachments : {
        type : DataTypes.STRING
      },
      completionStatus : {
        type : DataTypes.ENUM("Not Started",'In Progress', 'Completed'),
        defaultValue : 'Not Started'
      },
      createdAt: {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW
      },
      updatedAt: {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW
      }
    
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('Tasks');
  }
};