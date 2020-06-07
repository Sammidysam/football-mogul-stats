import React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const api = require('../api.js');

class DivisionGroupings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: []
    }
  }

  getTeams() {
    api.fetch('teams', {
      DivisionId: this.props.division.id
    })
    .then(
      result => this.setState({ teams: result })
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.division.id !== prevProps.division.id) {
      this.getTeams();
    }
  }

  componentDidMount() {
    this.getTeams();
  }

  render() {
    const { data } = this.props;
    const { teams } = this.state;

    return (
      <Box display="flex" style={{flexDirection: "column"}} alignItems="center">
        {data && data.map(s => {
          const team = teams.find(t => t.id === s.TeamId);

          return (
            <Paper display="flex" style={{flexDirection: "row"}} key={s.TeamId}>
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

export default DivisionGroupings;
