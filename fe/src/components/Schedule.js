import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

const api = require('../api.js');

class Schedule extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      playoff: false,
      week: 1,
      season: {
        year: 2000
      },
      seasons: []
    }
  }

  componentDidMount() {
    api.fetch('latest')
    .then(
      result => this.setState(result)
    );

    api.fetch('seasons')
    .then(
      result => this.setState({ seasons: result })
    );
  }

  render() {
    const { playoff, week, season, seasons } = this.state;

    return (
      <div>
        <Typography variant="h2" align="center">
          Schedule
        </Typography>

        <Select
          onChange={e => this.setState({ season: e.target.value })}
          renderValue={e => e.year}
          value={season}
        >
          {seasons.map(s => (
            <MenuItem value={s}>{s.year}</MenuItem>
          ))}
        </Select>
      </div>
    );
  }
}

export default Schedule;
