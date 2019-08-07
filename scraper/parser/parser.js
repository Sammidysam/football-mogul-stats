const fs = require('fs');
const cheerio = require('cheerio');

const models = require('../../models');
const game = require('./game.js');
const teamParticipation = require('./teamparticipation.js');

const parseAndCreate = (file, season) => {
  const data = fs.readFileSync(file, 'utf8');

  const $ = cheerio.load(data);
  const gameString = $(game.SELECTOR).text();
  const match = gameString.match(game.HEAD_TITLE_REGEX);

  // handle playoff rounds
  const week = match[1];
  const away = match[2];
  const home = match[3];

  const awayFinal = teamParticipation.getScore($, teamParticipation.AWAY);
  const homeFinal = teamParticipation.getScore($, teamParticipation.HOME);

  models.Team.findCreateFind({ where: { name: away } })
  .spread((awayTeam, created) => {
    models.Team.findCreateFind({ where: { name: home } })
    .spread((homeTeam, created) => {
      console.log(`${season.year} ${week}: ${awayTeam.name} ${awayFinal} at ${homeTeam.name} ${homeFinal}`);
    });
  });
};

module.exports = {
  parseAndCreate
};
