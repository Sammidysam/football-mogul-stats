const AWAY = 0;
const HOME = 1;

const getScore = ($, side) => {
  const selector = side === AWAY ? 'td .tmc' : 'td .tbc';

  return Number($(selector).find('b').first().text());
};

const getRushingYards = ($, side) => {
  const selector = "td.lml:contains('Rushing')";
  const yardsCandidates = $(selector).first().siblings();
  const yardsNode = side === AWAY ? yardsCandidates.first() : yardsCandidates.last();

  return Number(yardsNode.text().split(' ')[2]);
};

const getPassingYards = ($, side) => {
  const selector = "td.lml:contains('Passing')";
  const yardsCandidates = $(selector).first().siblings();
  const yardsNode = side === AWAY ? yardsCandidates.first() : yardsCandidates.last();

  return Number(yardsNode.text().split(' ')[0]);
};

const createTeamParticipations = ($, game, awayTeam, homeTeam) => {
  // Needs to become more scalable.
  return game.addTeam(awayTeam, {
    through: {
      home: false,
      score: getScore($, AWAY),
      rushingYards: getRushingYards($, AWAY),
      passingYards: getPassingYards($, AWAY),
      offenseYards: getRushingYards($, AWAY) + getPassingYards($, AWAY)
    }
  })
  .then(away => (
    game.addTeam(homeTeam, {
      through: {
        home: true,
        score: getScore($, HOME),
        rushingYards: getRushingYards($, HOME),
        passingYards: getPassingYards($, HOME),
        offenseYards: getRushingYards($, HOME) + getPassingYards($, HOME)
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
