'use strict';
module.exports = (sequelize, DataTypes) => {
  const TeamParticipation = sequelize.define('TeamParticipation', {
    // this will be needed for PlayerParticipation attaching to TeamParticipation
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // better to be an enum to allow for neutral site
    home: DataTypes.BOOLEAN,
    score: DataTypes.INTEGER,
    rushingYards: DataTypes.INTEGER,
    passingYards: DataTypes.INTEGER
  }, {});
  TeamParticipation.associate = function(models) {
    TeamParticipation.belongsTo(models.Team);
    TeamParticipation.belongsTo(models.Game);
  };
  return TeamParticipation;
};
