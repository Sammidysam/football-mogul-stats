const express = require('express');
const boolParser = require('express-query-boolean');
const server = express();
const PORT = 3002;

const DEVELOPMENT = 0;
const ENVIRONMENT = DEVELOPMENT;

const conferences = require('./conferences');
const divisions = require('./divisions');
const games = require('./games');
const latest = require('./latest');
const seasons = require('./seasons');
const standings = require('./standings');
const teams = require('./teams');
const teamParticipations = require('./teamparticipations');

const routers = {
  '/conferences': conferences,
  '/divisions': divisions,
  '/games': games,
  '/latest': latest,
  '/seasons': seasons,
  '/standings': standings,
  '/teams': teams,
  '/team-participations': teamParticipations
};

if (ENVIRONMENT === DEVELOPMENT) {
  server.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });
}

server.use(boolParser());

Object.keys(routers).forEach(k => {
  server.use(k, routers[k]);
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
