const express = require('express');
const router = express.Router();

const models = require('../models');
const find = require('./helpers/find.js');

router.get('/', (req, res) => (
  find.findAllResponse(models.TeamParticipation, req.query, res)
));

router.get('/:teamParticipationId', (req, res) => (
  find.findByPkResponse(models.TeamParticipation, req.params.teamParticipationId, res)
));

module.exports = router;
