const models = require('../models');
const config = require('./config.js');

const WEEK_REGEX = /Week ([0-9]*)/;

const PLAYOFF_WEEKS = [
  'Wild Card',
  'Division Round',
  'Conference Championship',
  'Super Bowl'
];

/**
 * Returns the week number and if this game is a playoff game or not.
 * Week number of playoff rounds restarts.
 */
const weekStatus = week => {
  const match = week.match(WEEK_REGEX);

  // If match is true, we are regular season.
  return match ? {
    week: match[1],
    playoff: false
  } : {
    week: PLAYOFF_WEEKS.indexOf(week) + 1,
    playoff: true
  };
};

const createGame = (match, season) => {
  const week = match[1];

  return models.Game.create({
    ...weekStatus(week),
    SeasonYear: season.year
  });
};

module.exports = {
  createGame
};
