const path = require('path');
const commandLineArgs = require('command-line-args');
const find = require('find');
const fs = require('fs');
const cheerio = require('cheerio');
const symlinkDir = require('symlink-dir');

const models = require('../models');
const divisionsConferences = require('./divisionsconferences.js');
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

// Make our Output folder available to our frontend.
symlinkDir(path.dirname(options.directory), `${__dirname}/../fe/public/FootballMogul`)
.then(result => {
  console.log('Created symbolic link for Output folder');
});

const BOX_SCORE_REGEX = /Box-([0-9]*)-([0-9]*)\.htm$/;

/**
 * The easiest starting assumption is from a blank database.
 * Later, we can append to an existing database, and this
 * will probably be the default behavior.
 */
models.sequelize.sync({ force: true })
.then(() => {
  find.eachfile(BOX_SCORE_REGEX, options.directory, f => {
    const filename = path.basename(f);
    const filenameMatch = filename.match(BOX_SCORE_REGEX);

    const data = fs.readFileSync(f, 'utf8');
    const $ = cheerio.load(data);

    seasons.findOrCreateSeason(filenameMatch)
    .spread((season, created) => {
      const gameString = $('head title').text();
      const gameStringMatch = gameString.match(/(.*): (.*) at (.*)/);

      teams.findOrCreateTeams(gameStringMatch).spread((awayTeam, homeTeam) => {
        games.createGame(gameStringMatch, filename, season).then(game => {
          teamParticipations.createTeamParticipations($, game, awayTeam, homeTeam)
          .then(teamParticipations => {
            divisionsConferences.createGroupingLink(game, awayTeam, homeTeam, season);
          });
        });
      });
    });
  });
});
