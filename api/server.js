const express = require('express');
const server = express();
const PORT = 3001;

const games = require('./games');
const latest = require('./latest');
const seasons = require('./seasons');
const teams = require('./teams');
const teamParticipations = require('./teamparticipations');

const routers = {
  '/games': games,
  '/latest': latest,
  '/seasons': seasons,
  '/teams': teams,
  '/team-participations': teamParticipations
};

Object.keys(routers).forEach(k => {
  server.use(k, routers[k]);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
