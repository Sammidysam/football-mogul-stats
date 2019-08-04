const models = require('../models');
const config = require('./config.js');

const EARLIEST_GAME_START = 70;
const LATER_CENTURY = 2000;
const EARLIER_CENTURY = 1900;

const twoDigitToFourDigitYear = year => {
  return year < EARLIEST_GAME_START ? LATER_CENTURY + year : EARLIER_CENTURY + year;
};

// Returns promise of all of the season objects that were created.
const createSeasons = filenames => {
  const years = new Set(filenames.map(f => {
    const match = f.match(config.BOX_SCORE_REGEX);
    const year = Number(match[1]);

    return twoDigitToFourDigitYear(year);
  }));

  const dbObjects = [...years].map(y => (
    { year: y }
  ));

  return models.Season.bulkCreate(dbObjects)
         .then(() => models.Season.findAll());
};

module.exports = {
  createSeasons
};
