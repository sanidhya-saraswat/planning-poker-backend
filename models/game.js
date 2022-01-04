'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    static associate(models) {
      this.hasMany(models.Player,{ foreignKey: 'link' }); 
    }
  };
  Game.init({
    link: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
    show: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false }
  }, {
    sequelize,
    modelName: 'Game',
    tableName:'game'
  });
  return Game;
};
