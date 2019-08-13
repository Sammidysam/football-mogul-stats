const path = require('path');
const models = require('../models');

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

const boxScoreToRecap = file => {
  const dirname = path.dirname(file);
  const newBasename = path.basename(file).replace('Box', 'Recap');

  return path.join(dirname, newBasename);
};

const createGame = (match, file, season) => {
  const week = match[1];

  return models.Game.create({
    ...weekStatus(week),
    boxScoreLink: file,
    recapLink: boxScoreToRecap(file),
    SeasonYear: season.year
  });
};

module.exports = {
  createGame
};
