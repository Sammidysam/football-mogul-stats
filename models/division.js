'use strict';
module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define('Division', {
    name: DataTypes.STRING
  }, {});
  Division.associate = function(models) {
    Division.belongsTo(models.Conference);
    Division.hasMany(models.Team);
  };
  return Division;
};
