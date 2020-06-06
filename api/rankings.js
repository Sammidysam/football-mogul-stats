const express = require('express');
const router = express.Router();

const models = require('../models');
const groupable = require('./helpers/groupable.js');
const rankable = require('./helpers/rankable.js');

const SPECIAL_VARS = {
  "defenseYards": (ours, currentValue) => currentValue.offenseYards
};
const SPECIAL_VARS_LIST = Object.keys(SPECIAL_VARS);

router.get('/', (req, res) => {
  const variables = req.query.variable ? (Array.isArray(req.query.variables) || [req.query.variable]) : models.TeamParticipation.rankingVariables.concat(SPECIAL_VARS_LIST);

  // Build the function to populate the data object.
  const dataFunction = (toAdd, ours, currentValue) => (
    variables.forEach(v => (
      toAdd[v] += SPECIAL_VARS_LIST.includes(v) ? SPECIAL_VARS[v](ours, currentValue) : ours[v]
    ))
  );

  // Build the object to store this data within.
  const dataObject = {
    regularSeason: {
      opponentIds: []
    },
    postSeason: {
      opponentIds: []
    }
  };

  variables.forEach(v => {
    dataObject.regularSeason[v] = 0;
    dataObject.postSeason[v] = 0;
  });

  rankable.produceTeamData(
    req,
    (total, currentValue, teamParticipations) => {
      const ours = teamParticipations.find(tp => tp.GameId === currentValue.GameId);
      const toAdd = ours.Game.playoff ? total.postSeason : total.regularSeason;

      dataFunction(toAdd, ours, currentValue);
      toAdd.opponentIds.push(currentValue.TeamId);

      return total;
    },
    dataObject
  )
  .then(result => {
    // Should this be automatically sorted at times?
    const groupingQuery = req.query.grouping;

    groupable.groupResult(
      groupingQuery,
      result,
      (a, b) => b.regularSeason[req.params.variable] - a.regularSeason[req.params.variable]
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
});

module.exports = router;
