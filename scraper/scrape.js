const path = require('path');
const commandLineArgs = require('command-line-args');
const find = require('find');

const models = require('../models');
const config = require('./config.js');
const seasons = require('./seasons.js');
const parser = require('./parser/parser.js');

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
    const filename = path.basename(f);

    seasons.findOrCreateSeason(filename)
    .spread((season, created) => {
      // parse fully, then findCreateFind both teams
      // then create game and team participations
      parser.parseAndCreate(f, season);
    });
  });
});
