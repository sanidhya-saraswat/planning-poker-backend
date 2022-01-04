'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      this.belongsTo(models.Game,{ foreignKey: 'link' }); 
    }
  };
  Player.init({
    name: {type:DataTypes.STRING,allowNull:false,primaryKey:true},
    admin: {type:DataTypes.BOOLEAN,defaultValue:false,allowNull:false},
    link: {type:DataTypes.STRING,allowNull:false,primaryKey:true},
    socket_id: {type:DataTypes.STRING},
    active:{type:DataTypes.BOOLEAN,defaultValue:false},
    score:{type:DataTypes.INTEGER,defaultValue:-1}
  }, {
    sequelize,
    modelName: 'Player',
    tableName:"player"
  });
  return Player;
};