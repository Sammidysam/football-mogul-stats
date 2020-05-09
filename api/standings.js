const express = require('express');
const router = express.Router();

const models = require('../models');

const DIVISION_AND_CONFERENCE = "divisionconference";
const DIVISION = "division";
const CONFERENCE = "conference";

// When sorting by wins, we should be sure that we include ties into consideration.
const teamWins = teamStandings => teamStandings.wins + (0.5 * teamStandings.ties);
const teamRSWins = team => teamWins(team.regularSeason);
const totalGames = teamStandings => teamStandings.wins + teamStandings.losses + teamStandings.ties;
const winPercentage = teamStandings => teamWins(teamStandings) / totalGames(teamStandings);

const instances = (array, value) => array.reduce((n, val) => (
  n + (val === value)
), 0);

const versusOthers = (group, teams) => {
  // In division two clubs rule 1:
  const versusOthersCalc = group.map(entry => {
    const standings = group.reduce((total, currentEntry) => {
      if (currentEntry.id !== entry.id) {
        const current = teams.find(t => t.TeamId === entry.id);
        total.ranking = entry.ranking;

        total.wins += instances(current.regularSeason.winIds, currentEntry.id);
        total.losses += instances(current.regularSeason.lossIds, currentEntry.id);
        total.ties += instances(current.regularSeason.tieIds, currentEntry.id);
      }

      return total;
    },
    {
      wins: 0,
      losses: 0,
      ties: 0
    });

    return {
      id: entry.id,
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
    const value = func(t);

    if (map.has(value)) {
      map.get(value).push({
        id: t.TeamId,
        ranking: i
      });
    } else {
      map.set(value, [{
        id: t.TeamId,
        ranking: i
      }]);
    }
  });

  return map;
};

const sortGroup = (group, funcs, teams) => {
  // If our group is one team, we will not try to sort.
  if (group.length === 1) {
    return;
  }

  const currentFunc = funcs[0];

  // If we are out of ways to sort, we will give up.
  if (!currentFunc) {
    return;
  }

  if (!currentFunc(group, teams)) {
    sortGroup(group, funcs.slice(1), teams);
  }
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
                const winsMap = groupBy(d.Teams, teamRSWins);

                winsMap.forEach(group => {
                  sortGroup(group, [versusOthers], d.Teams)
                });
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
