const express = require('express');
const server = express();
const PORT = 3000;

const games = require('./games');
const seasons = require('./seasons');
const teams = require('./teams');
const teamParticipations = require('./teamparticipations');

server.use('/games', games);
server.use('/seasons', seasons);
server.use('/teams', teams);
server.use('/team-participations', teamParticipations);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
