const models = require('../models');

// I've seen that 1959 is starting to be supported later, so this may change.
const SUPER_BOWL_WEEK = 4;

const createGroupings = (game, awayTeam, homeTeam, season) => {
  // From playoff games we create Conferences;
  // from regular season we create Divisions.

  // Filter out null values so that we can only do anything with two valid DivisionIds.
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
    models.Game.findAll({
      where: {
        playoff: false,
        SeasonYear: season.year
      },
      include: [{
        model: models.Team,
        where: {
          id: [awayTeam.id, homeTeam.id]
        }
      }]
    })
    .then(games => {
      console.log(games.length);
    });
  }
};

module.exports = {
  createGroupings
};
