const models = require('../models');

// I've seen that 1959 is starting to be supported later, so this may change.
const SUPER_BOWL_WEEK = 4;

const createGroupings = (game, awayTeam, homeTeam, season) => {
  // From playoff games we create Conferences;
  // from regular season we create Divisions.

  // Filter out null values so that we can only do anything with two valid DivisionIds.
  awayTeam.reload();
  homeTeam.reload();
  const divisionIds = [awayTeam.DivisionId, homeTeam.DivisionId].filter(d => d);

  if (game.playoff) {
    if (divisionIds.length !== 2) {
      return;
    }

    models.Division.findAll({ where: { id: divisionIds } })
    .then(divisions => {
      const conferenceIds = divisions.map(d => d.ConferenceId);

      models.Conference.findAll({ where: { id: conferenceIds } })
      .then(conferences => {
        console.log(conferences.length);
      });
    });
    if (game.week === SUPER_BOWL_WEEK) {

    }
  } else {
    // It feels like this should be one query.
    models.TeamParticipation.findAll({
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

      models.TeamParticipation.findAll({
        where: {
          TeamId: homeTeam.id,
          GameId: gameIds
        }
      })
      .then(combinedParticipations => {
        // combinedParticipations.length will be 1 if not same division,
        // 2 if same division
        if (combinedParticipations.length === 2) {
          if (divisionIds.length > 0) {
            awayTeam.setDivision(divisionIds[0]);
            homeTeam.setDivision(divisionIds[0]);
          } else {
            models.Division.create({})
            .then(division => {
              awayTeam.setDivision(division);
              homeTeam.setDivision(division);
            });
          }
        }
      });
    });
  }
};

module.exports = {
  createGroupings
};
