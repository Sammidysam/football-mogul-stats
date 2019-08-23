const express = require('express');
const router = express.Router();

const models = require('../models');
const find = require('./helpers/find.js');

router.get('/', (req, res) => (
  find.findAll(models.Team, req.query, res)
));

router.get('/:teamId', (req, res) => (
  find.findByPk(models.Team, req.params.teamId, res)
));

module.exports = router;
