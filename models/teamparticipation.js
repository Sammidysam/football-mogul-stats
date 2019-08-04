'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeamParticipation = sequelize.define('TeamParticipation', {
    score: DataTypes.INTEGER,
    box_score_link: DataTypes.STRING,
    recap_link: DataTypes.STRING,
    team_id: DataTypes.INTEGER,
    game_id: DataTypes.INTEGER
  }, {});
  TeamParticipation.associate = function(models) {
    // associations can be defined here
  };
  return TeamParticipation;
};