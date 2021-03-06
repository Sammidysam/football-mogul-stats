const models = require('../models');

const EARLIEST_GAME_START = 70;
const LATER_CENTURY = 2000;
const EARLIER_CENTURY = 1900;

const twoDigitToFourDigitYear = year => {
  return year < EARLIEST_GAME_START ? LATER_CENTURY + year : EARLIER_CENTURY + year;
};

// Returns promise of all of the season objects that were created.
const findOrCreateSeason = match => {
  const year = Number(match[1]);

  const fourDigitYear = twoDigitToFourDigitYear(year);
  const whereClause = { year: fourDigitYear };

  return models.Season.findCreateFind({ where: whereClause });
};

module.exports = {
  findOrCreateSeason
};
