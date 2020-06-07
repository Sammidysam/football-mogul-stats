import React from 'react';

import Box from '@material-ui/core/Box';

import ConferenceGroupings from './ConferenceGroupings';
import ConferenceGroupingTable from './ConferenceGroupingTable';

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
    if (
      this.props.season.year !== prevProps.season.year ||
      this.props.grouping !== prevProps.grouping
    ) {
      api.fetch(this.props.type, {
        year: this.props.season.year,
        grouping: this.props.grouping
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
    const { grouping } = this.props;

    return (
      <Box display="flex" style={{flexDirection: "row"}} alignItems="center">
        {conferences.map(c => {
          const conferenceGrouping = data.find(s => s.ConferenceId === c.id);

          return grouping === 'divisionconference' ? (
            <ConferenceGroupings
              key={c.id}
              conference={c}
              data={conferenceGrouping && conferenceGrouping.Divisions}
            />
          ) : (
            <ConferenceGroupingTable
              key={c.id}
              conference={c}
              data={conferenceGrouping && conferenceGrouping.Teams}
            />
          );
        })}
      </Box>
    );
  }
}

export default Groupings;
