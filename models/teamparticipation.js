'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeamParticipation = sequelize.define('TeamParticipation', {
    home: DataTypes.BOOLEAN,
    score: DataTypes.INTEGER,
    box_score_link: DataTypes.STRING,
    recap_link: DataTypes.STRING
  }, {});
  TeamParticipation.associate = function(models) {
    TeamParticipation.belongsTo(models.Team);
    TeamParticipation.belongsTo(models.Game);
  };
  return TeamParticipation;
};
