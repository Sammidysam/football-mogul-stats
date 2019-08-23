const express = require('express');
const router = express.Router();

const models = require('../models');
const find = require('./helpers/find.js');

router.get('/', (req, res) => (
  find.findAll(models.Conference, req.query, res)
));

router.get('/:conferenceId', (req, res) => (
  find.findByPk(models.Conference, req.params.conferenceId, res)
));

module.exports = router;
