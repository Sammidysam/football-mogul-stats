const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', (req, res) => {
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
          model: models.Game
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
            ...others.reduce((total, currentValue) => {
              const ours = teamParticipations.find(tp => tp.GameId === currentValue.GameId);
              const toAdd = ours.Game.playoff ? total.postSeason : total.regularSeason;

              if (ours.score > currentValue.score) {
                toAdd.wins += 1;
              } else if (ours.score === currentValue.score) {
                toAdd.ties += 1;
              } else {
                toAdd.losses += 1;
              }

              return total;
            }, {
              regularSeason: {
                wins: 0,
                losses: 0,
                ties: 0
              },
              postSeason: {
                wins: 0,
                losses: 0,
                ties: 0
              }
            })
          }
        ))
      ))
    ));

    Promise.all(promises).then(result => (
      res.json(result)
    ));
  })
});

module.exports = router;
