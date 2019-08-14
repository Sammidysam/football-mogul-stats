const express = require('express');
const server = express();
const port = 3000;

const models = require('../models');

server.get('/', (req, res) => models.TeamParticipation.findAll().then(teams => res.json(teams)));

server.listen(port, () => console.log(`Example app listening on port ${port}!`))
