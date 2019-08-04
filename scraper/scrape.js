const path = require('path');
const commandLineArgs = require('command-line-args');
const find = require('find');
const models = require('../models');

const optionDefinitions = [
  { name: 'directory', alias: 'd', type: String }
];
const options = commandLineArgs(optionDefinitions);

if (!options.directory) {
  console.error('You must pass an output directory!');
  process.exit(1);
}

const boxScoreRegex = /Box-([0-9]*)-([0-9]*)\.htm$/;
find.eachfile(boxScoreRegex, options.directory, (file) => {
  const filename = path.basename(file);

  const match = filename.match(boxScoreRegex);
  const year = Number(match[1]);
  const id = Number(match[2]);

  // Our database will only hold 4-digit years.
  const dbYear = year < 70 ? 2000 + year : 1900 + year;
  // async causing problems
  // models.Season.findOrCreate({ where: { year: dbYear } })
  // .then(season => {
  //   console.log(JSON.stringify(season));
  // });
});
