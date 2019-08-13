const commandLineArgs = require('command-line-args');
const find = require('find');
const fs = require('fs');
const cheerio = require('cheerio');

const models = require('../models');
const config = require('./config.js');
const seasons = require('./seasons.js');
const teams = require('./teams.js');
const games = require('./games.js');
const teamParticipations = require('./teamparticipations.js');

// Future option will be which game save to link it to.
const optionDefinitions = [
  { name: 'directory', alias: 'd', type: String }
];
const options = commandLineArgs(optionDefinitions);

if (!options.directory) {
  console.error('You must pass an output directory!');
  process.exit(1);
}

/**
 * The easiest starting assumption is from a blank database.
 * Later, we can append to an existing database, and this
 * will probably be the default behavior.
 */
models.sequelize.sync({ force: true })
.then(() => {
  find.eachfile(config.BOX_SCORE_REGEX, options.directory, f => {
    const data = fs.readFileSync(f, 'utf8');
    const $ = cheerio.load(data);

    seasons.findOrCreateSeason(f)
    .spread((season, created) => {
      // create teams
      // create game + team participations
      const gameString = $('head title').text();
      const match = gameString.match(/(.*): (.*) at (.*)/);

      teams.findOrCreateTeams(match).spread((awayTeam, homeTeam) => {
        games.createGame(match, season).then(game => {
          teamParticipations.createTeamParticipations($, game, awayTeam, homeTeam)
          .spread((away, home) => {
            console.log(JSON.stringify(away));
            console.log(JSON.stringify(home));
          });
        });
      });
    });
  });
});
