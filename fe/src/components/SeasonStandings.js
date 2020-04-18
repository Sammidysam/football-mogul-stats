import React from 'react';

import Box from '@material-ui/core/Box';

const api = require('../api.js');

class SeasonStandings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conferences: []
    }
  }

  componentDidMount() {
    api.fetch('conferences')
    .then(
      result => this.setState({ conferences: result })
    );
  }

  render() {
    const { conferences } = this.state;

    return (
      <Box display="flex" flexDirection="row" alignItems="center">

      </Box>
    );
  }
}

export default SeasonStandings;
