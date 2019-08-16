const express = require('express');
const server = express();
const PORT = 3001;

const games = require('./games');
const latest = require('./latest');
const seasons = require('./seasons');
const teams = require('./teams');
const teamParticipations = require('./teamparticipations');

server.use('/games', games);
server.use('/latest', latest);
server.use('/seasons', seasons);
server.use('/teams', teams);
server.use('/team-participations', teamParticipations);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
