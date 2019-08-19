import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';

import WeekSelect from './WeekSelect.js';

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
            <MenuItem value={s} key={s.year}>{s.year}</MenuItem>
          ))}
        </Select>

        <WeekSelect
          onChange={e => this.setState({ week: e.target.value.week, playoff: e.target.value.playoff })}
          value={{ week: week, playoff: playoff }}
          season={season}
        />
      </div>
    );
  }
}

export default Schedule;
