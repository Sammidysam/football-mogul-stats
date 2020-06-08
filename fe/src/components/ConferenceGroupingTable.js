import React from 'react';

import RankingsTable from './RankingsTable';
import StandingsTable from './StandingsTable';

const api = require('../api.js');

class ConferenceGroupingTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: []
    }
  }

  getTeams() {
    api.fetch('divisions', {
      ConferenceId: this.props.conference.id
    })
    .then(result => (
      api.fetch('teams', {
        DivisionId: result.map(d => d.id)
      })
      .then(
        result => this.setState({ teams: result })
      )
    ));
  }

  componentDidUpdate(prevProps) {
    if (this.props.conference.id !== prevProps.conference.id) {
      this.getTeams();
    }
  }

  componentDidMount() {
    this.getTeams();
  }

  render() {
    const { data, type } = this.props;
    const { teams } = this.state;

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

export default ConferenceGroupingTable;
