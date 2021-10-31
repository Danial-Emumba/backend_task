'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Users}) {
      // define association here
      this.belongsTo(Users, {foreignKey : "userID", as : "user"})
    }
  };
  Tasks.init({
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
       allowNull : false,
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
      allowNull : false,
      validate:{
        notEmpty : true,
        notNull:true
      }
    },
    dueDate: {
      type : DataTypes.DATE,
      defaultValue : DataTypes.NOW,
      allowNull : false,
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
  
  }, {
    sequelize,
    modelName: 'Tasks',
    timestamps: true
  });
  return Tasks;
};