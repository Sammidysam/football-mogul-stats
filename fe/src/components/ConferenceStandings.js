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

    const conferenceDivisions = divisions.filter(d => d.ConferenceId === conference.id);

    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        {conferenceDivisions.map(d => (
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
