import React from 'react';

import Box from '@material-ui/core/Box';

import ConferenceGroupings from './ConferenceGroupings';

const api = require('../api.js');

class Groupings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conferences: [],
      data: []
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.season.year !== prevProps.season.year) {
      api.fetch(this.props.type, {
        year: this.props.season.year,
        grouping: 'divisionconference'
      })
      .then(
        result => this.setState({ data: result })
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
    const { conferences, data } = this.state;

    return (
      <Box display="flex" style={{flexDirection: "row"}} alignItems="center">
        {conferences.map(c => {
          const conferenceGrouping = data.find(s => s.ConferenceId === c.id);

          return (
            <ConferenceGroupings
              key={c.id}
              conference={c}
              data={conferenceGrouping && conferenceGrouping.Divisions}
            />
          );
        })}
      </Box>
    );
  }
}

export default Groupings;
