const express = require('express');
const router = express.Router();

const groupable = require('./helpers/groupable.js');
const rankable = require('./helpers/rankable.js');

router.get('/', (req, res) => (
  rankable.produceTeamData(
    req,
    (total, currentValue, teamParticipations) => {
      const ours = teamParticipations.find(tp => tp.GameId === currentValue.GameId);
      const toAdd = ours.Game.playoff ? total.postSeason : total.regularSeason;

      toAdd.offense += ours.rushingYards + ours.passingYards;
      toAdd.defense += currentValue.rushingYards + currentValue.passingYards;
      toAdd.opponentIds.push(currentValue.TeamId);

      return total;
    },
    {
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
    }
  )
  .then(result => {
    groupable.groupResult(
      req,
      result,
      (a, b) => b.regularSeason.offense - a.regularSeason.offense
    )
    .then(grouped => {
      grouped.forEach((t, index) => t.ranking = index + 1);

      grouped.forEach(t => {
        t.regularSeason.opponentIds = t.regularSeason.opponentIds.map(oid => ({
          [oid]: grouped.find(it => it.TeamId === oid).ranking
        }))
      });

      res.json(grouped);
    })
  })
));

module.exports = router;
