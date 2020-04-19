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

module.exports = router;
