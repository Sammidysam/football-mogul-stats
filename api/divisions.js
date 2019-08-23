const express = require('express');
const router = express.Router();

const models = require('../models');
const find = require('./helpers/find.js');

router.get('/', (req, res) => (
  find.findAll(models.Division, req.query, res)
));

router.get('/:divisionId', (req, res) => (
  find.findByPk(models.Division, req.params.divisionId, res)
));

module.exports = router;
