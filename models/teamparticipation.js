'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeamParticipation = sequelize.define('TeamParticipation', {
    // better to be an enum to allow for neutral site
    home: DataTypes.BOOLEAN,
    score: DataTypes.INTEGER
  }, {});
  TeamParticipation.associate = function(models) {
    TeamParticipation.belongsTo(models.Team);
    TeamParticipation.belongsTo(models.Game);
  };
  return TeamParticipation;
};
