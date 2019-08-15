const express = require('express');
const server = express();
const PORT = 3000;

const games = require('./games');
const seasons = require('./seasons');
const teams = require('./teams');
const teamParticipations = require('./teamparticipations');

games.gameRoutes(server);
seasons.seasonRoutes(server);
teams.teamRoutes(server);
teamParticipations.teamParticipationRoutes(server);

server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
