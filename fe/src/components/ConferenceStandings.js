import React from 'react';

import Box from '@material-ui/core/Box';

import DivisionStandings from './DivisionStandings';

const api = require('../api.js');

class ConferenceStandings extends React.Component {
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

    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        {divisions.map(d => (
          <DivisionStandings
            key={d.id}
            division={d}
            standings={standings}
            teams={teams}
          />
        ))}
      </Box>
    );
  }
}

export default ConferenceStandings;
