'use strict';
module.exports = (sequelize, DataTypes) => {
  const Season = sequelize.define('Season', {
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
