'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class verification_tokens extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {foreignKey : "userID"})
    }
  };
  verification_tokens.init({
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
    }
  }, {
    sequelize,
    modelName: 'verification_tokens',
  });
  return verification_tokens;
};