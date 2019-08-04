'use strict';
module.exports = (sequelize, DataTypes) => {
  const Season = sequelize.define('Season', {
    year: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {});
  Season.associate = function(models) {
    // associations can be defined here
  };
  return Season;
};
