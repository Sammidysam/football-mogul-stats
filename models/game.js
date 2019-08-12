'use strict';
module.exports = (sequelize, DataTypes) => {
  const Game = sequelize.define('Game', {
    week: DataTypes.INTEGER,
    playoff: DataTypes.BOOLEAN
  }, {});
  Game.associate = function(models) {
    Game.belongsTo(models.Season);
    // Should always be two.
    Game.belongsToMany(models.Team, { through: models.TeamParticipation });
  };
  return Game;
};
