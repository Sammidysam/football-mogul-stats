const models = require('../models');

const findOrCreateTeams = match => {
  const away = match[2];
  const home = match[3];

  return models.Team.findCreateFind({ where: { name: away } })
  .spread((awayTeam, created) => (
    models.Team.findCreateFind({ where: { name: home } })
    .spread((homeTeam, created) => (
      [awayTeam, homeTeam]
    ))
  ));
};

module.exports = {
  findOrCreateTeams
};
