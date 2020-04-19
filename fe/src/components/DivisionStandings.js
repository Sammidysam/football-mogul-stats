import React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const api = require('../api.js');

class DivisionStandings extends React.Component {
  render() {
    const { division, standings, teams } = this.props;

    const divisionTeams = teams.filter(t => t.DivisionId === division.id);
    const relevantStandings = standings.filter(s => divisionTeams.map(t => t.id).includes(s.TeamId));

    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        {relevantStandings.map(s => {
          const team = divisionTeams.find(t => t.id === s.TeamId);

          return (
            <Paper display="flex" flexDirection="row" key={s.TeamId}>
              <Typography>
                {team.name}
              </Typography>

              <Typography>
                {s.regularSeason.wins}
                -
                {s.regularSeason.losses}
              </Typography>
            </Paper>
          );
        })}
      </Box>
    );
  }
}

export default DivisionStandings;
