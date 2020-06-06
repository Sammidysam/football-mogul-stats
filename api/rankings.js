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
    // Later will automatically be sorted at times.
    const groupingQuery = req.query.grouping;

    groupable.groupResult(
      groupingQuery,
      result,
      (a, b) => b.regularSeason.offense - a.regularSeason.offense
    )
    .then(grouped => {
      const setRanking = (t, index) => t.ranking = index + 1;

      // While we simply want to add a ranking, the process is different
      // for each grouping type, so we need to check groupings as well.
      if (groupingQuery === groupable.SORTED) {
        grouped.forEach(setRanking);
      } else if (groupingQuery === groupable.DIVISION || groupingQuery === groupable.CONFERENCE) {
        grouped.forEach(group => group.Teams.forEach(setRanking));
      } else if (groupingQuery === groupable.DIVISION_AND_CONFERENCE) {
        grouped.forEach(conference => conference.Divisions.forEach(division => (
          division.Teams.forEach(setRanking)
        )));
      }

      // Below was a way to make getting an average ranking per team easier, but could
      // it be better to do this client-side?
      // grouped.forEach(t => {
      //   t.regularSeason.opponentIds = t.regularSeason.opponentIds.map(oid => ({
      //     [oid]: grouped.find(it => it.TeamId === oid).ranking
      //   }))
      // });

      res.json(grouped);
    })
  })
));

module.exports = router;
