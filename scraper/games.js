const path = require('path');
const models = require('../models');

const WEEK_REGEX = /Week ([0-9]*)/;

const PLAYOFF_WEEKS = {
  'Wild Card': 1,
  'Division Round': 2,
  // 'Conference Championship' appears in FM18, while the conference is specifically
  // named in FM20.
  'Conference Championship': 3,
  'AFC Title Game': 3,
  'NFC Title Game': 3,
  'Super Bowl': 4
};

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
    week: PLAYOFF_WEEKS[week],
    playoff: true
  };
};

const boxScoreToRecap = file => {
  const dirname = path.dirname(file);
  const newBasename = path.basename(file).replace('Box', 'Recap');

  return path.join(dirname, newBasename);
};

const createGame = (match, filename, season) => {
  const week = match[1];

  return models.Game.create({
    ...weekStatus(week),
    boxScoreLink: `Output/${filename}`,
    recapLink: `Output/${boxScoreToRecap(filename)}`,
    SeasonYear: season.year
  });
};

module.exports = {
  createGame
};
