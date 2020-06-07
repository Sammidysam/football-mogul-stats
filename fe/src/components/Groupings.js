import React from 'react';

import Box from '@material-ui/core/Box';

import ConferenceGroupings from './ConferenceGroupings';

const api = require('../api.js');

class Groupings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conferences: [],
      teams: [],
      standings: []
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.season.year !== prevProps.season.year) {
      api.fetch('standings', {
        year: this.props.season.year,
        grouping: 'divisionconference'
      })
      .then(
        result => this.setState({ standings: result })
      );
    }
  }

  componentDidMount() {
    api.fetch('conferences')
    .then(
      result => this.setState({ conferences: result })
    );

    api.fetch('teams')
    .then(
      result => this.setState({ teams: result })
    );
  }

  render() {
    const { conferences, teams, standings } = this.state;
    const { season } = this.props;

    console.log(standings);

    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        {conferences.map(c => (
          <ConferenceGroupings
            key={c.id}
            conference={c}
            standings={standings.length > 0 && standings.find(s => s.ConferenceId === c.id).Divisions}
            teams={teams}
          />
        ))}
      </Box>
    );
  }
}

export default Groupings;
