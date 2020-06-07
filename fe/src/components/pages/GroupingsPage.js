import React from 'react';

import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';

import GroupingSelect from '../GroupingSelect.js';
import SeasonSelect from '../SeasonSelect.js';
import Groupings from '../Groupings.js';

const api = require('../../api.js');

class GroupingsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      grouping: 'divisionconference',
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
    const { grouping, seasons, season } = this.state;
    const { type } = this.props;

    return (
      <Box display="flex" style={{flexDirection: "column"}} alignItems="center">
        <Typography variant="h2">
          Standings
        </Typography>

        <Box display="flex">
          <FormControl>
            <InputLabel>
              Year
            </InputLabel>
            <SeasonSelect
              onChange={e => this.setState({ season: { year: e.target.value } })}
              value={seasons.length > 0 ? season.year : ''}
              seasons={seasons}
            />
          </FormControl>

          <FormControl>
            <InputLabel>
              Grouping
            </InputLabel>
            <GroupingSelect
              onChange={e => this.setState({ grouping: e.target.value })}
              value={grouping}
            />
          </FormControl>
        </Box>

        <Groupings
          season={season}
          type={type}
          grouping={grouping}
        />
      </Box>
    );
  }
}

export default GroupingsPage;
