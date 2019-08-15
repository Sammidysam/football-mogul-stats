const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', (req, res) => (
  models.Team.findAll().then(teams => res.json(teams))
));

module.exports = router;
