'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    week: DataTypes.INTEGER,
    playoff: DataTypes.BOOLEAN,
    season_id: DataTypes.INTEGER,
    away_team_participation_id: DataTypes.INTEGER,
    home_team_participation_id: DataTypes.INTEGER
  }, {});
  Game.associate = function(models) {
    // associations can be defined here
  };
  return Game;
};