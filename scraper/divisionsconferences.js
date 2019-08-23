const models = require('../models');

const linkHelper = require('./helpers/links.js');

// I've seen that 1959 is starting to be supported later, so this may change.
const SUPER_BOWL_WEEK = 4;

/**
 * Returns a link object as such:
 * {
 *   object: "Conference"|"Division",
 *   type: "same"|"different"
 *   teamIds: [
 *     1,
 *     2
 *   ]
 * }
 */
const createGroupingLink = (game, awayTeam, homeTeam, season) => {
  // From playoff games we create Conferences;
  // from regular season we create Divisions.
  if (game.playoff) {
    return Promise.resolve({
      object: 'Conference',
      type: game.week === SUPER_BOWL_WEEK ? 'different' : 'same',
      teamIds: [
        awayTeam.id,
        homeTeam.id
      ]
    });
  } else {
    // It feels like this should be one query.
    return models.TeamParticipation.findAll({
      where: {
        TeamId: awayTeam.id
      },
      include: [{
        model: models.Game,
        where: {
          playoff: false,
          SeasonYear: season.year
        }
      }]
    })
    .then(awayParticipations => {
      const gameIds = awayParticipations.map(tp => tp.Game.id);

      return models.TeamParticipation.findAll({
        where: {
          TeamId: homeTeam.id,
          GameId: gameIds
        }
      })
      .then(combinedParticipations => {
        // combinedParticipations.length will be 1 if not same division,
        // 2 if same division
        if (combinedParticipations.length === 2) {
          // This is a workaround for a bug in Football Mogul 18 where the Jets and Giants
          // schedules are replaced.
          const antiJetsType = season.year === 1998 &&
            (awayTeam.name === 'Jets' || homeTeam.name === 'Jets' ||
            awayTeam.name === 'Giants' || homeTeam.name === 'Giants')
            ? 'different' : 'same';

          return Promise.resolve({
            object: 'Division',
            type: antiJetsType,
            teamIds: [
              awayTeam.id,
              homeTeam.id
            ]
          });
        } else {
          return Promise.resolve({});
        }
      });
    });
  }
};

const resolveGroupingLinks = links => {
  const divisionLinks = links.filter(r => r.object === 'Division');
  const conferenceLinks = links.filter(r => r.object === 'Conference');

  const divisions = linkHelper.linksToGroups(divisionLinks);
  const conferences = linkHelper.linksToGroups(conferenceLinks, divisions);

  console.log(divisions);
  console.log(conferences);
};

module.exports = {
  createGroupingLink,
  resolveGroupingLinks
};
