'use strict';
module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    name: {
      type: DataTypes.STRING,
      unique: true
    },
    location: DataTypes.STRING
  }, {});
  Team.associate = function(models) {
    Team.belongsToMany(models.Game, { through: models.TeamParticipation });
  };
  return Team;
};
