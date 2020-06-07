import React from 'react';

import Box from '@material-ui/core/Box';

import DivisionGroupings from './DivisionGroupings';

const api = require('../api.js');

class ConferenceGroupings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      divisions: []
    }
  }

  componentDidMount() {
    api.fetch('divisions')
    .then(
      result => this.setState({ divisions: result })
    );
  }

  render() {
    const { divisions } = this.state;
    const { conference, standings, teams } = this.props;

    console.log(standings);

    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        {divisions && divisions.filter(d => d.ConferenceId === conference.id).map(d => (
          <DivisionGroupings
            key={d.id}
            division={d}
            standings={standings && standings.find(s => s.DivisionId === d.id).Teams}
            teams={teams}
          />
        ))}
      </Box>
    );
  }
}

export default ConferenceGroupings;
