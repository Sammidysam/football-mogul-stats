const path = require('path');
const commandLineArgs = require('command-line-args');
const find = require('find');
const fs = require('fs');
const cheerio = require('cheerio');
const ncp = require('ncp').ncp;

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
const publicDir = `${__dirname}/../fe/public`;
const copyDirs = [
  options.directory,
  path.join(options.directory, '..', 'HTML_Templates'),
  path.join(options.directory, '..', 'Logos')
];

copyDirs.forEach(dir => (
  ncp(dir, path.join(publicDir, path.basename(dir)), err => {console.log(err)})
));

const BOX_SCORE_REGEX = /Box-([0-9]*)-([0-9]*)\.htm$/;

/**
 * The easiest starting assumption is from a blank database.
 * Later, we can append to an existing database, and this
 * will probably be the default behavior.
 */
models.sequelize.sync({ force: true })
.then(() => {
  find.file(BOX_SCORE_REGEX, options.directory, files => {
    const promises = files.map(f => {
      const filename = path.basename(f);
      const filenameMatch = filename.match(BOX_SCORE_REGEX);

      const data = fs.readFileSync(f, 'utf8');
      const $ = cheerio.load(data);

      return seasons.findOrCreateSeason(filenameMatch)
      .spread((season, created) => {
        const gameString = $('head title').text();
        const gameStringMatch = gameString.match(/(.*): (.*) at (.*)/);

        return teams.findOrCreateTeams(gameStringMatch).spread((awayTeam, homeTeam) => (
          games.createGame(gameStringMatch, filename, season).then(game => (
            teamParticipations.createTeamParticipations($, game, awayTeam, homeTeam)
            .then(teamParticipations => (
              divisionsConferences.createGroupingLink(game, awayTeam, homeTeam, season)
            ))
          ))
        ))
      });
    });

    /**
     * Asynchronous nature kills the ability to create divisions because of the
     * uniqueness required and the lack of knowledge of a name of a division /
     * conference, which would be the unique constraint required.
     * So, we can create them all after creating the links from the data above.
     *
     * I wonder if there is a better solution than this.
     */
    Promise.all(promises).then(result => {
      divisionsConferences.resolveAndCommitGroupings(result);
    });
  });
});
