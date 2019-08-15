const models = require('../models');

const teamParticipationRoutes = server => {
  server.get('/team-participations', (req, res) => (
    models.TeamParticipation.findAll().then(teamParticipations => res.json(teamParticipations))
  ));
};

module.exports = {
  teamParticipationRoutes
};
