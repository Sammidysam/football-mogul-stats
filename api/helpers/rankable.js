const models = require('../../models');

const produceTeamData = (req, reduceFunc, reduceObj) => {
  // For efficiency's sake, we only want to make a query if necessary.
  const seasonQuery = Promise.resolve((
    req.query.year ?
      models.Season.findAll({ where: { year: req.query.year } }) :
      false
  ));

  return seasonQuery
  .then(seasons => (
    models.Team.findAll({})
    .then(teams => {
      // Possible future optimization: mark two results at the same time.
      // However, this would be hard to work with asynchronous calls.
      const promises = teams.map(team => (
        models.TeamParticipation.findAll({
          where: {
            TeamId: team.id
          },
          include: [{
            model: models.Game,
            ...(seasons && { where: {
              SeasonYear: seasons.map(s => s.year)
            }})
          }]
        })
        .then(teamParticipations => (
          models.TeamParticipation.findAll({
            where: {
              GameId: teamParticipations.map(tp => tp.Game.id),
              TeamId: {
                [models.Sequelize.Op.not]: team.id
              }
            }
          })
          .then(others => (
            {
              TeamId: team.id,
              DivisionId: team.DivisionId,
              ...others.reduce(
                (total, currentValue) => reduceFunc(total, currentValue, teamParticipations),
                // Pesky way of cloning an object.
                JSON.parse(JSON.stringify(reduceObj))
              )
            }
          ))
        ))
      ));

      return Promise.all(promises);
    })
  ));
};

module.exports = {
  produceTeamData
};
