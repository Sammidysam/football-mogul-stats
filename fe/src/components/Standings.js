import React from 'react';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import SeasonSelect from './SeasonSelect.js';

const api = require('../api.js');

class Standings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conferences: [],
      divisions: [],
      teams: [],
      seasons: [],
      season: {
        year: 2000
      }
    };
  }

  componentDidMount() {
    api.fetch('latest')
    .then(
      result => this.setState({ season: result.season })
    );

    api.fetch('conferences')
    .then(
      result => this.setState({ conferences: result })
    );

    api.fetch('divisions')
    .then(
      result => this.setState({ divisions: result })
    );

    api.fetch('teams')
    .then(
      result => this.setState({ teams: result })
    );

    api.fetch('seasons')
    .then(
      result => this.setState({ seasons: result })
    );
  }

  render() {
    const { conferences, divisions, teams, seasons, season } = this.state;

    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h2">
          Standings
        </Typography>

        <FormControl>
          <InputLabel>
            Year
          </InputLabel>
          <SeasonSelect
            onChange={e => this.setState({ season: e.target.value })}
            value={season}
            seasons={seasons}
          />
        </FormControl>
      </Box>
    );
  }
}

export default Standings;
