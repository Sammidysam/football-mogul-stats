const config = require('./config.js');

const createGame = ($, season, awayTeam, homeTeam) => {
  const gameString = $(config.HEAD_SELECTOR).text();
  const match = gameString.match(config.HEAD_TITLE_REGEX);

  // handle playoff rounds
  const week = match[1];
  const away = match[2];
  const home = match[3];
};
