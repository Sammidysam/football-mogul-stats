'use strict';
module.exports = (sequelize, DataTypes) => {
  const Conference = sequelize.define('Conference', {
    name: DataTypes.STRING
  }, {});
  Conference.associate = function(models) {
    Conference.hasMany(models.Division);
  };
  return Conference;
};
