const AWAY_SELECTOR = 'td .tmc';
const HOME_SELECTOR = 'td .tbc';

const AWAY = 0;
const HOME = 1;

const getScore = ($, side) => {
  const selector = side === AWAY ? AWAY_SELECTOR : HOME_SELECTOR;

  return Number($(selector).find('b').first().text());
};

const createTeamParticipations = ($, game, awayTeam, homeTeam) => {
  return game.addTeam(awayTeam, {
    through: {
      home: false,
      score: getScore($, AWAY)
    }
  })
  .then(away => (
    game.addTeam(homeTeam, {
      through: {
        home: true,
        score: getScore($, HOME)
      }
    })
    .then(home => (
      [away, home]
    ))
  ));
};

module.exports = {
  createTeamParticipations
};
