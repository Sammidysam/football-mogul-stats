const express = require('express');
const router = express.Router();

const models = require('../models');

const DIVISION_AND_CONFERENCE = "divisionconference";
const DIVISION = "division";
const CONFERENCE = "conference";

// When sorting by wins, we should be sure that we include ties into consideration.
const teamWins = teamStandings => teamStandings.wins + (0.5 * teamStandings.ties);
const totalGames = teamStandings => teamStandings.wins + teamStandings.losses + teamStandings.ties;
const winPercentage = teamStandings => teamWins(teamStandings) / totalGames(teamStandings);

const instances = (array, value) => array.reduce((n, val) => (
  n + (val === value)
), 0);

const versusOthers = (teams, group) => {
  // In division two clubs rule 1:
  const versusOthersCalc = group.map(team => {
    const standings = group.reduce((total, currentValue) => {
      if (currentValue !== team) {
        const current = teams.find(t => t.TeamId === team);
        total.ranking = current.ranking;

        total.wins += instances(current.regularSeason.winIds, currentValue);
        total.losses += instances(current.regularSeason.lossIds, currentValue);
        total.ties += instances(current.regularSeason.tieIds, currentValue);
      }

      return total;
    },
    {
      wins: 0,
      losses: 0,
      ties: 0
    });

    return {
      id: team,
      ranking: standings.ranking,
      percentage: winPercentage(standings)
    }
  }).sort((a, b) => b.percentage - a.percentage);

  // If we have differentiation, we need to sort based on this.
  if (versusOthersCalc[0].percentage !== versusOthersCalc[versusOthersCalc.length - 1].percentage) {
    const ranked = [...versusOthersCalc].sort((a, b) => a.ranking - b.ranking);
    const localTeams = versusOthersCalc.map(t => teams[t.ranking]);

    versusOthersCalc.forEach((t, i) => {
      teams[ranked[i].ranking] = localTeams.find(team => team.TeamId === t.id);
      // This magic string should be a variable in the final JSON.
      teams[ranked[i].ranking].tiebreaker = {
        type: "head-to-head",
        percentage: t.percentage
      };
    });

    return true;
  } else {
    return false;
  }
};

const groupBy = (teams, func) => {
  const map = new Map();

  teams.forEach((t, i) => {
    // If this is an outward-facing variable, it probably needs
    // to be incremented by 1.
    // Not a worry for now.
    // This should probably not be returned in the final JSON.
    t.ranking = i;

    const wins = func(t.regularSeason);

    if (map.has(wins)) {
      map.get(wins).push(t.TeamId);
    } else {
      map.set(func(t.regularSeason), [t.TeamId]);
    }
  });

  return map;
};

const sortBy = (teams, funcs) => {
  const currentFunc = funcs[0];

  // If we are out of ways to sort, we will give up.
  if (!currentFunc) {
    return teams;
  }

  // Need to genericize.
  // Grouping function is probably different than the sorting function - but how?
  const map = groupBy(teams, teamWins);

  map.forEach(group => {
    if (group.length > 1) {
      // We need to sort these teams against each other.
      if (group.length === 2) {
        if (!currentFunc(teams, group)) {
          sortBy(teams, funcs.slice(1));
        }
      } else {

      }
    }
  });
};

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
            const grouped = conferences.map(c => ({
              ConferenceId: c.id,
              Divisions: c.Divisions.map(d => ({
                DivisionId: d.id,
                // This passes through result c.Division.length times,
                // so it could be more efficient?
                Teams: result.filter(t => t.DivisionId === d.id)
                  .sort((a, b) => teamWins(b.regularSeason) - teamWins(a.regularSeason))
              }))
            }));

            grouped.forEach(c => {
              c.Divisions.forEach(d => {
                sortBy(d.Teams, [versusOthers]);
              });
            });

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
