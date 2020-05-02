const express = require('express');
const router = express.Router();

const models = require('../models');

const DIVISION_AND_CONFERENCE = "divisionconference";
const DIVISION = "division";
const CONFERENCE = "conference";

// When sorting by wins, we should be sure that we include ties into consideration.
const teamWins = teamStandings => teamStandings.regularSeason.wins + (0.5 * teamStandings.regularSeason.ties);

/**
 * Provides the standings over a given time range and with some groupings, etc.
 *
 * Possible query values:
 * year: controls the SeasonYear that gets handled.
 * grouping: can be "division", "conference", or "division+conference".
 */
router.get('/', (req, res) => {
  // For efficiency's sake, we only want to make a query if necessary.
  const seasonQuery = Promise.resolve((
    req.query.year ?
      models.Season.findAll({ where: { year: req.query.year } }) :
      false
  ));

  seasonQuery
  .then(seasons => (
    models.Team.findAll({})
    .then(teams => {
      // Possible future optimization: mark two results at the same time.
      // However, this would be hard to work with asynchronous calls.
      const promises = teams.map(team => (
        models.TeamParticipation.findAll({
          where: {
            TeamId: team.id
          },
          include: [{
            model: models.Game,
            ...(seasons && { where: {
              SeasonYear: seasons.map(s => s.year)
            }})
          }]
        })
        .then(teamParticipations => (
          models.TeamParticipation.findAll({
            where: {
              GameId: teamParticipations.map(tp => tp.Game.id),
              TeamId: {
                [models.Sequelize.Op.not]: team.id
              }
            }
          })
          .then(others => (
            {
              TeamId: team.id,
              DivisionId: team.DivisionId,
              ...others.reduce((total, currentValue) => {
                const ours = teamParticipations.find(tp => tp.GameId === currentValue.GameId);
                const toAdd = ours.Game.playoff ? total.postSeason : total.regularSeason;

                if (ours.score > currentValue.score) {
                  toAdd.wins += 1;
                  toAdd.winIds.push(currentValue.TeamId);
                } else if (ours.score === currentValue.score) {
                  toAdd.ties += 1;
                  toAdd.tieIds.push(currentValue.TeamId);
                } else {
                  toAdd.losses += 1;
                  toAdd.lossIds.push(currentValue.TeamId);
                }

                return total;
              }, {
                regularSeason: {
                  wins: 0,
                  losses: 0,
                  ties: 0,
                  winIds: [],
                  lossIds: [],
                  tieIds: []
                },
                postSeason: {
                  wins: 0,
                  losses: 0,
                  ties: 0,
                  winIds: [],
                  lossIds: [],
                  tieIds: []
                }
              })
            }
          ))
        ))
      ));

      Promise.all(promises).then(result => {
        if (req.query.grouping === DIVISION_AND_CONFERENCE) {
          models.Conference.findAll({
            include: {
              model: models.Division
            }
          })
          .then(conferences => {
            grouped = conferences.map(c => ({
              ConferenceId: c.id,
              Divisions: c.Divisions.map(d => ({
                DivisionId: d.id,
                // This passes through result c.Division.length times,
                // so it could be more efficient?
                Teams: result.filter(t => t.DivisionId === d.id)
                  .sort((a, b) => teamWins(b) - teamWins(a))
              }))
            }));

            res.json(grouped);
          });
        } else if (req.query.grouping === DIVISION) {

        } else if (req.query.grouping === CONFERENCE) {

        } else {
          res.json(result);
        }
      });
    })
  ));
});

module.exports = router;
