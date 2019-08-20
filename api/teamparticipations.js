const express = require('express');
const router = express.Router();

const models = require('../models');

router.get('/', (req, res) => (
  models.TeamParticipation.findAll({ where: req.query }).then(teamParticipations => res.json(teamParticipations))
));

module.exports = router;
