const AWAY_SELECTOR = 'td .tmc';
const HOME_SELECTOR = 'td .tbc';

const AWAY = 0;
const HOME = 1;

const getScore = ($, side) => {
  const selector = side === AWAY ? AWAY_SELECTOR : HOME_SELECTOR;

  return Number($(selector).find('b').first().text());
}

module.exports = {
  AWAY,
  HOME,
  getScore
};
