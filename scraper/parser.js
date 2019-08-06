const fs = require('fs');
const cheerio = require('cheerio');
const models = require('../models');

const HEAD_TITLE_REGEX = /(.*): (.*) at (.*)/;

const parseAndCreate = (file, season) => {
  const data = fs.readFileSync(file, 'utf8');

  const $ = cheerio.load(data);
  const gameString = $('head title').text();
  const match = gameString.match(HEAD_TITLE_REGEX);

  // handle playoff rounds
  const week = match[1];
  const away = match[2];
  const home = match[3];

  models.Team.findCreateFind({ where: { name: away } })
  .spread((awayTeam, created) => {
    models.Team.findCreateFind({ where: { name: home } })
    .spread((homeTeam, created) => {
      console.log(`${season.year} ${week}: ${awayTeam.name} at ${homeTeam.name}`);
    });
  });
};

module.exports = {
  parseAndCreate
};
