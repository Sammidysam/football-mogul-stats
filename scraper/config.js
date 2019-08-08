const BOX_SCORE_REGEX = /Box-([0-9]*)-([0-9]*)\.htm$/;
//const id = Number(match[2]);
const HEAD_TITLE_REGEX = /(.*): (.*) at (.*)/;

const HEAD_SELECTOR = 'head title';

module.exports = {
  BOX_SCORE_REGEX,
  HEAD_TITLE_REGEX,
  HEAD_SELECTOR
};
