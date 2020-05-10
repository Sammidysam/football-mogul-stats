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
  // In/out division rule 1:
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

  const percentageGrouping = groupBy(versusOthersCalc, "percentage", {
    idFunc: "id",
    rankingFunc: "ranking"
  });

  // If we have tied teams, we will need to sort them separately.
  percentageGrouping.forEach((pg, key) => {
    if (pg.length > 1) {
      sortGroup(pg, withinTeams, teams);
      percentageGrouping.delete(key);
    }
  });

  if (percentageGrouping.size > 0) {
    const array = Array.from(percentageGrouping);

    // Each grouping must have only one member due to the above loop.
    const rankings = array.map(([key, value]) => value[0].ranking).sort();
    const localTeams = array.map(([key, value]) => teams[value[0].ranking]);

    array.forEach(([key, value], index) => {
      teams[rankings[index]] = localTeams.find(team => team.TeamId === value[0].id);

      // Should this magic string be a variable later?
      teams[rankings[index]].tiebreaker = {
        type: "head-to-head",
        percentage: key
      };
    });
  }
};

// This is just like versusOthers and probably needs to be refactored.
const withinTeams = (group, teams) => {
  // In division rule 2:
  const withinTeamsCalc = group.map(entry => {
    const current = teams.find(t => t.TeamId === entry.id);

    const standings = teams.reduce((total, currentEntry) => {
      if (currentEntry.TeamId !== entry.id) {
        total.ranking = entry.ranking;

        total.wins += instances(current.regularSeason.winIds, currentEntry.TeamId);
        total.losses += instances(current.regularSeason.lossIds, currentEntry.TeamId);
        total.ties += instances(current.regularSeason.tieIds, currentEntry.TeamId);
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

  const percentageGrouping = groupBy(withinTeamsCalc, "percentage", {
    idFunc: "id",
    rankingFunc: "ranking"
  });

  // If we have tied teams, we will need to sort them separately.
  percentageGrouping.forEach((pg, key) => {
    if (pg.length > 1) {
      sortGroup(pg, commonGames, teams);
      percentageGrouping.delete(key);
    }
  });

  if (percentageGrouping.size > 0) {
    const array = Array.from(percentageGrouping);

    // Each grouping must have only one member due to the above loop.
    const rankings = array.map(([key, value]) => value[0].ranking).sort();
    const localTeams = array.map(([key, value]) => teams[value[0].ranking]);

    array.forEach(([key, value], index) => {
      teams[rankings[index]] = localTeams.find(team => team.TeamId === value[0].id);

      // Should this magic string be a variable later?
      teams[rankings[index]].tiebreaker = {
        type: "within-division",
        percentage: key
      };
    });
  }
};

// This is just like versusOthers and probably needs to be refactored.
const commonGames = (group, teams) => {
  const opponentIds = group.map(groupTeam => teams.find(t => t.TeamId === groupTeam.id)
    .regularSeason).map(rs => rs.winIds.concat(rs.lossIds).concat(rs.tieIds));
  const commonOpponents = opponentIds[0].reduce((total, current, index) => {
    const included = opponentIds.every((oid, i) => i === index || oid.includes(current));

    if (included && !total.includes(current))
      total.push(current);

    return total;
  }, []);

  // In division rule 3:
  const commonOpponentsCalc = group.map(entry => {
    const current = teams.find(t => t.TeamId === entry.id);

    const standings = commonOpponents.reduce((total, currentEntry) => {
      if (currentEntry !== entry.id) {
        total.ranking = entry.ranking;

        total.wins += instances(current.regularSeason.winIds, currentEntry);
        total.losses += instances(current.regularSeason.lossIds, currentEntry);
        total.ties += instances(current.regularSeason.tieIds, currentEntry);
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

  const percentageGrouping = groupBy(commonOpponentsCalc, "percentage", {
    idFunc: "id",
    rankingFunc: "ranking"
  });

  // If we have tied teams, we will need to sort them separately.
  percentageGrouping.forEach((pg, key) => {
    if (pg.length > 1) {
      sortGroup(pg, null, teams);
      percentageGrouping.delete(key);
    }
  });

  if (percentageGrouping.size > 0) {
    const array = Array.from(percentageGrouping);

    // Each grouping must have only one member due to the above loop.
    const rankings = array.map(([key, value]) => value[0].ranking).sort();
    const localTeams = array.map(([key, value]) => teams[value[0].ranking]);

    array.forEach(([key, value], index) => {
      teams[rankings[index]] = localTeams.find(team => team.TeamId === value[0].id);

      // Should this magic string be a variable later?
      teams[rankings[index]].tiebreaker = {
        type: "common-games",
        percentage: key
      };
    });
  }
};

const groupBy = (teams, func, options = { idFunc: "TeamId" }) => {
  const map = new Map();

  teams.forEach((t, i) => {
    const value = typeof(func) === "function" ? func(t) : t[func];
    const object = {
      id: t[options.idFunc],
      ranking: options.rankingFunc ? t[options.rankingFunc] : i
    };

    if (map.has(value)) {
      map.get(value).push(object);
    } else {
      map.set(value, [object]);
    }
  });

  return map;
};

const sortGroup = (group, func, teams) => {
  // If our group is one team, we will not try to sort.
  if (group.length === 1 || !func) {
    return;
  }

  func(group, teams);
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
                  sortGroup(group, versusOthers, d.Teams)
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
