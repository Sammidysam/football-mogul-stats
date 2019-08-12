'use strict';
module.exports = (sequelize, DataTypes) => {
  const Season = sequelize.define('Season', {
    // This will need to have ID not be primary key eventually, to allow
    // for multiple saves.
    year: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {});
  Season.associate = function(models) {
    Season.hasMany(models.Game);
  };
  return Season;
};
