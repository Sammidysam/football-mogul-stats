const models = require('../models');

const gameRoutes = server => {
  server.get('/games', (req, res) => (
    models.Game.findAll().then(games => res.json(games))
  ));
};

module.exports = {
  gameRoutes
};
