const express = require('express');
const router = express.Router();

const models = require('../models');
const find = require('./helpers/find.js');

router.get('/', (req, res) => (
  find.findAllResponse(models.Game, req.query, res)
));

router.get('/:gameId', (req, res) => (
  find.findByPkResponse(models.Game, req.params.gameId, res)
));

module.exports = router;
