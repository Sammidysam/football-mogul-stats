import React from 'react';

import Box from '@material-ui/core/Box';

import DivisionGroupingTable from './DivisionGroupingTable';

const api = require('../api.js');

class ConferenceGroupings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      divisions: []
    }
  }

  getDivisions() {
    api.fetch('divisions', {
      ConferenceId: this.props.conference.id
    })
    .then(
      result => this.setState({ divisions: result })
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.conference.id !== prevProps.conference.id) {
      this.getDivisions();
    }
  }

  componentDidMount() {
    this.getDivisions();
  }

  render() {
    const { data } = this.props;
    const { divisions } = this.state;

    return (
      <Box display="flex" style={{flexDirection: "column"}} alignItems="center">
        {divisions.map(d => {
          const currentGrouping = data && data.find(s => s.DivisionId === d.id);

          return (
            <DivisionGroupingTable
              key={d.id}
              division={d}
              data={currentGrouping && currentGrouping.Teams}
            />
          );
        })}
      </Box>
    );
  }
}

export default ConferenceGroupings;
