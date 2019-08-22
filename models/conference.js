'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conference = sequelize.define('Conference', {
    name: DataTypes.STRING
  }, {});
  Conference.associate = function(models) {
    // In the future, this should probably belong to a season.
    Conference.hasMany(models.Division);
  };
  return Conference;
};
