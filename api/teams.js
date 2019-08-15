const express = require('express');
const router = express.Router();

const models = require('../models');
const common = require('./common.js');

router.get('/', (req, res) => (
  models.Team.findAll().then(teams => res.json(teams))
));

router.get('/:teamId', (req, res) => (
  models.Team.findByPk(req.params.teamId).then(team => {
    if (team) {
      res.json(team);
    } else {
      res.status(404);
      res.json(common.ERROR_404);
    }
  })
));

module.exports = router;
