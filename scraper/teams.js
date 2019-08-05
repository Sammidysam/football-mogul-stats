const fs = require('fs');
const cheerio = require('cheerio');
const models = require('../models');

const HEAD_TITLE_REGEX = /: (.*) at (.*)/;

const createTeams = files => {
  const teamNames = new Set(files.map(f => {
    const data = fs.readFileSync(f, 'utf8');

    const $ = cheerio.load(data);
    const gameString = $('head title').text();
    const match = gameString.match(HEAD_TITLE_REGEX);

    const away = match[1];
    const home = match[2];

    return [away, home];
  }).flat());

  console.log(teamNames);
};

module.exports = {
  createTeams
};
