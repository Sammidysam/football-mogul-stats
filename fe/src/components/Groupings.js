import React from 'react';

import Box from '@material-ui/core/Box';

import ConferenceGroupings from './ConferenceGroupings';

const api = require('../api.js');

class Groupings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conferences: [],
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
  }

  render() {
    const { conferences, standings } = this.state;

    return (
      <Box display="flex" style={{flexDirection: "row"}} alignItems="center">
        {conferences.map(c => {
          const conferenceGrouping = standings.find(s => s.ConferenceId === c.id);

          return (<ConferenceGroupings
            key={c.id}
            conference={c}
            standings={conferenceGrouping && conferenceGrouping.Divisions}
          />);
        })}
      </Box>
    );
  }
}

export default Groupings;
