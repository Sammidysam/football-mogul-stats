const models = require('../models');

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

// Genericize this and resolveConferenceLinks.
const resolveDivisionLinks = divisionLinks => (
  divisionLinks.reduce((total, currentValue) => {
    // All division links should be 'same' unless something weird is going on
    // (like the Jets bug).
    // If so, we skip it.
    if (currentValue.type === 'different')
      return total;

    const teamIds = currentValue.teamIds;
    const indexes = teamIds.map(tid => total.findIndex(d => d.has(tid)));
    const greatestIndex = Math.max(...indexes);

    if (greatestIndex === -1) {
      total.push(new Set(teamIds));
    } else if (indexes.every(i => i > -1) && (new Set(indexes)).size > 1) {
      // Merge the two groups.
      const removed = total[indexes[0]];

      teamIds.forEach(tid => total[indexes[1]].add(tid));
      total.splice(indexes[0], 1);
    } else {
      teamIds.forEach(tid => total[greatestIndex].add(tid));
    }

    return total;
  }, [])
);

const resolveConferenceLinks = (conferenceLinks, divisions) => (
  conferenceLinks.reduce((total, currentValue) => {
    if (currentValue.type === 'different')
      return total;

    const divisionIndexes = currentValue.teamIds.map(tid => divisions.findIndex(d => d.has(tid)));
    const indexes = divisionIndexes.map(tid => total.findIndex(c => c.has(tid)));
    const greatestIndex = Math.max(...indexes);

    if (greatestIndex === -1) {
      total.push(new Set(divisionIndexes));
    } else if (indexes.every(i => i > -1) && (new Set(indexes)).size > 1) {
      // Merge the two groups.
      const removed = total[indexes[0]];

      divisionIndexes.forEach(di => total[indexes[1]].add(di));
      total.splice(indexes[0], 1);
    } else {
      divisionIndexes.forEach(di => total[greatestIndex].add(di));
    }

    return total;
  }, [])
);

const resolveGroupingLinks = links => {
  const divisionLinks = links.filter(r => r.object === 'Division');
  const conferenceLinks = links.filter(r => r.object === 'Conference');

  const divisions = resolveDivisionLinks(divisionLinks);
  const conferences = resolveConferenceLinks(conferenceLinks, divisions);

  console.log(divisions);
  console.log(conferences);
};

module.exports = {
  createGroupingLink,
  resolveGroupingLinks
};
