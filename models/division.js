'use strict';
module.exports = (sequelize, DataTypes) => {
  const Division = sequelize.define('Division', {
    name: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {});
  Division.associate = function(models) {
    Division.belongsTo(models.Conference);
    Division.hasMany(models.Team);
  };
  return Division;
};
