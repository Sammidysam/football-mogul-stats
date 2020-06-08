import React from 'react';

import Box from '@material-ui/core/Box';

import ConferenceGroupings from './ConferenceGroupings';
import ConferenceGroupingTable from './ConferenceGroupingTable';
import DivisionGroupingTable from './DivisionGroupingTable';
import RankingsTable from './RankingsTable';
import StandingsTable from './StandingsTable';

const api = require('../api.js');

class Groupings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      conferences: [],
      divisions: [],
      teams: [],
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
        grouping: this.props.grouping,
        sort: 'offenseYards'
      })
      .then(
        result => this.setState({ data: result })
      );

      if (this.props.grouping === 'division' && this.state.divisions.length === 0) {
        api.fetch('divisions')
        .then(
          result => this.setState({ divisions: result })
        );
      }

      if (this.props.grouping === 'sorted' && this.state.teams.length === 0) {
        api.fetch('teams')
        .then(
          result => this.setState({ teams: result })
        );
      }
    }
  }

  componentDidMount() {
    api.fetch('conferences')
    .then(
      result => this.setState({ conferences: result })
    );
  }

  groupingComponent() {
    const { conferences, divisions, teams, data } = this.state;
    const { grouping, type } = this.props;

    if (grouping === 'divisionconference' || grouping === 'conference') {
      return conferences.map(c => {
        const conferenceGrouping = data.find(s => s.ConferenceId === c.id);

        if (grouping === 'divisionconference') {
          return (
            <ConferenceGroupings
              key={c.id}
              conference={c}
              data={conferenceGrouping && conferenceGrouping.Divisions}
              type={type}
            />
          );
        } else {
          return (
            <ConferenceGroupingTable
              key={c.id}
              conference={c}
              data={conferenceGrouping && conferenceGrouping.Teams}
              type={type}
            />
          );
        }
      });
    } else if (grouping === 'division') {
      return divisions.map(d => {
        const divisionGrouping = data.find(s => s.DivisionId === d.id);

        return (
          <DivisionGroupingTable
            key={d.id}
            division={d}
            data={divisionGrouping && divisionGrouping.Teams}
            type={type}
          />
        );
      });
    } else if (grouping === 'sorted') {
      return type === 'standings' ? (
        <StandingsTable
          data={data}
          teams={teams}
        />
      ) : (
        <RankingsTable
          data={data}
          teams={teams}
        />
      );
    }
  }

  render() {
    const { grouping } = this.props;

    // Add disclaimer of all tiebreakers not yet being implemented.
    // Also, probably should just make the box included in the function output.
    return (
      <Box display="flex" style={{flexDirection: "row", maxWidth: grouping === 'division' ? 610 : '100%'}} flexWrap={grouping === 'division' ? 'wrap' : 'nowrap'} alignItems="center">
        {this.groupingComponent()}
      </Box>
    );
  }
}

export default Groupings;
