const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', (req, res) => (
  models.Season.findAll().then(seasons => res.json(seasons))
));

module.exports = router;
