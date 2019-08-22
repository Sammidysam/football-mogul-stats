'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conference = sequelize.define('Conference', {
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  Conference.associate = function(models) {
    // In the future, this should probably belong to a season.
    Conference.hasMany(models.Division);
  };
  return Conference;
};
