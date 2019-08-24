const express = require('express');
const router = express.Router();

const models = require('../models');
const find = require('./helpers/find.js');

router.get('/', (req, res) => (
  find.findAllResponse(models.Season, req.query, res)
));

router.get('/:seasonId', (req, res) => (
  find.findByPkResponse(models.Season, req.params.seasonId, res)
));

router.get('/:seasonId/standings', (req, res) => {
  find.findByPk(models.Season, req.params.seasonId)
  .then(season => (
    models.Team.findAll({})
    .then(teams => {
      const promises = teams.map(team => (
        models.TeamParticipation.findAll({ where: { TeamId: team.id } })
        .then(teamParticipations => (
          models.Game.findAll({ where: { id: teamParticipations.map(tp => tp.GameId), SeasonYear: season.year } })
          .then(games => (
            models.TeamParticipation.findAll({
              where: {
                GameId: games.map(g => g.id),
                TeamId: {
                  [models.Sequelize.Op.not]: team.id
                }
              }
            })
            .then(others => (
              others.reduce((total, currentValue) => {
                const ours = teamParticipations.find(tp => tp.GameId === currentValue.GameId);

                if (ours.score > currentValue.score) {
                  total.wins += 1;
                } else if (ours.score === currentValue.score) {
                  total.ties += 1;
                } else {
                  total.losses += 1;
                }

                return total;
              }, {
                wins: 0,
                losses: 0,
                ties: 0
              })
            ))
          ))
        ))
      ));

      Promise.all(promises).then(result => {
        return res.json(result)
      });
    })
  ))
});

module.exports = router;
