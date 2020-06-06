const express = require('express');
const router = express.Router();

const models = require('../models');

// Started copied from standings.js - find overlap and remove patterns?
router.get('/', (req, res) => {
  const seasonQuery = Promise.resolve((
    req.query.year ?
      models.Season.findAll({ where: { year: req.query.year } }) :
      false
  ));

  seasonQuery
  .then(seasons => (
    models.Team.findAll({})
    .then(teams => {
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

                toAdd.offense += ours.rushingYards + ours.passingYards;
                toAdd.defense += currentValue.rushingYards + currentValue.passingYards;
                toAdd.opponentIds.push(currentValue.TeamId);

                return total;
              }, {
                regularSeason: {
                  offense: 0,
                  defense: 0,
                  opponentIds: []
                },
                postSeason: {
                  offense: 0,
                  defense: 0,
                  opponentIds: []
                }
              })
            }
          ))
        ))
      ));

      Promise.all(promises).then(result => {
        const sorted = result.sort((a, b) => b.regularSeason.offense - a.regularSeason.offense);
        sorted.forEach((t, index) => t.ranking = index + 1);

        sorted.forEach(t => {
          t.regularSeason.opponentIds = t.regularSeason.opponentIds.map(oid => ({
            [oid]: sorted.find(it => it.TeamId === oid).ranking
          }))
        });

        res.json(sorted);
      });
    })
  ));
});

module.exports = router;
