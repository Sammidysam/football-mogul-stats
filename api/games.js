const express = require('express');
const router = express.Router();

const models = require('../models');
const find = require('./helpers/find.js');

router.get('/', (req, res) => (
  find.findAll(models.Game, req.query, res)
));

router.get('/:gameId', (req, res) => (
  find.findByPk(models.Game, req.params.gameId, res)
));

module.exports = router;
