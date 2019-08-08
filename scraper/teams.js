const models = require('../models');
const config = require('./config.js');

const findOrCreateTeams = $ => {
  const gameString = $(config.HEAD_SELECTOR).text();
  const match = gameString.match(config.HEAD_TITLE_REGEX);

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
