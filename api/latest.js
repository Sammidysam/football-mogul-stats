const express = require('express');
const router = express.Router();

const models = require('../models');

/**
 * Being a router here is a little bit overkill, but it fits the pattern of the
 * other routes.
 * This is simply more versatile for the road ahead.
 *
 * Returns an object like so:
 * {
 *   week: 14
 *   playoff: false
 *   season: {
 *     year: 1999
 *   }
 * }
 */
router.get('/', (req, res) => (
  models.Season.max('year')
  .then(year => (
    // We then find it to allow for when we have to have season have an id
    // to handle multiple saves.
    models.Season.findByPk(year)
    .then(season => (
      models.Game.findOne({ where: { SeasonYear: season.year, playoff: true } })
      .then(game => (
        models.Game.max('week', { where: { SeasonYear: season.year, playoff: Boolean(game) } })
        .then(week => (
          res.json(
            {
              week: week,
              playoff: Boolean(game),
              season: season
            }
          )
        ))
      ))
    ))
  ))
));

module.exports = router;
