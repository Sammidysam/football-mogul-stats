const models = require('../models');

const seasonRoutes = server => {
  server.get('/seasons', (req, res) => (
    models.Season.findAll().then(seasons => res.json(seasons))
  ));
};

module.exports = {
  seasonRoutes
};
