import React from 'react';

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
      }
    }
  }

  componentDidMount() {
    api.fetch('latest')
    .then(
      result => this.setState(result)
    );
  }

  render() {
    const { playoff, week, season: { year } } = this.state;

    return (
      <Typography variant="h1" align="center">
        Schedule
      </Typography>
    );
  }
}

export default Schedule;
