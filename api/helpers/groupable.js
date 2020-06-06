const DIVISION_AND_CONFERENCE = "divisionconference";
const DIVISION = "division";
const CONFERENCE = "conference";

const models = require('../../models');

const groupResult = (req, result, sortingFunc) => {
  if (req.query.grouping === DIVISION_AND_CONFERENCE) {
    return models.Conference.findAll({
      include: {
        model: models.Division
      }
    })
    .then(conferences => {
      const grouped = conferences.map(c => ({
        ConferenceId: c.id,
        Divisions: c.Divisions.map(d => ({
          DivisionId: d.id,
          // This passes through result c.Division.length times,
          // so it could be more efficient?
          Teams: result.filter(t => t.DivisionId === d.id)
            .sort(sortingFunc)
        }))
      }));

      return grouped;
    });
  } else if (req.query.grouping === DIVISION) {

  } else if (req.query.grouping === CONFERENCE) {

  } else {
    return Promise.resolve(result);
  }
};

module.exports = {
  DIVISION_AND_CONFERENCE,
  DIVISION,
  CONFERENCE,
  groupResult
};
