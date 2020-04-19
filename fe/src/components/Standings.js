import React from 'react';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import SeasonSelect from './SeasonSelect.js';
import SeasonStandings from './SeasonStandings.js';

const api = require('../api.js');

class Standings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      seasons: [],
      season: {
        year: 2000
      }
    };
  }

  componentDidMount() {
    api.fetch('latest')
    .then(result => this.setState({ season: result.season })
    );

    api.fetch('seasons')
    .then(
      result => this.setState({ seasons: result })
    );
  }

  // Need a custom onChange to regrab standings to pass along to SeasonSelect.

  render() {
    const { seasons, season } = this.state;

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

        <SeasonStandings
          season={season}
        />
      </Box>
    );
  }
}

export default Standings;
