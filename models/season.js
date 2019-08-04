'use strict';
module.exports = (sequelize, DataTypes) => {
  const Season = sequelize.define('Season', {
    year: DataTypes.INTEGER
  }, {});
  Season.associate = function(models) {
    // associations can be defined here
  };
  return Season;
};