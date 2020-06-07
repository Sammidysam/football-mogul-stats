import React from 'react';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import SeasonSelect from '../SeasonSelect.js';
import Groupings from '../Groupings.js';

const api = require('../../api.js');

class GroupingsPage extends React.Component {
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

        <Groupings
          season={season}
        />
      </Box>
    );
  }
}

export default GroupingsPage;
