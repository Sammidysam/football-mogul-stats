import React from 'react';

import Box from '@material-ui/core/Box';

import ConferenceStandings from './ConferenceStandings';

const api = require('../api.js');

class SeasonStandings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conferences: [],
      teams: []
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
    const { conferences, teams } = this.state;
    const { standings, season } = this.props;

    return (
      <Box display="flex" flexDirection="row" alignItems="center">
        {conferences.map(c => (
          <ConferenceStandings
            key={c.id}
            conference={c}
            standings={standings}
            teams={teams}
          />
        ))}
      </Box>
    );
  }
}

export default SeasonStandings;
