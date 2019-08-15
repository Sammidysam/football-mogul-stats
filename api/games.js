const express = require('express');
const router = express.Router();

const models = require('../models');
const common = require('./common.js');

router.get('/', (req, res) => (
  models.Game.findAll().then(games => res.json(games))
));

router.get('/:gameId', (req, res) => (
  models.Game.findByPk(req.params.gameId).then(game => {
    if (game) {
      res.json(game);
    } else {
      res.status(404);
      res.json(common.ERROR_404);
    }
  })
));

module.exports = router;
