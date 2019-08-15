const models = require('../models');

const teamRoutes = server => {
  server.get('/teams', (req, res) => (
    models.Team.findAll().then(teams => res.json(teams))
  ));
};

module.exports = {
  teamRoutes
};
