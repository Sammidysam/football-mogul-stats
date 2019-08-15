const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', (req, res) => (
  models.Game.findAll().then(games => res.json(games))
));

module.exports = router;
