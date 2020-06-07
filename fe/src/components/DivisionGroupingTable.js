import React from 'react';

import StandingsTable from './StandingsTable';

const api = require('../api.js');

class DivisionGroupingTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      teams: []
    }
  }

  getTeams() {
    api.fetch('teams', {
      DivisionId: this.props.division.id
    })
    .then(
      result => this.setState({ teams: result })
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.division.id !== prevProps.division.id) {
      this.getTeams();
    }
  }

  componentDidMount() {
    this.getTeams();
  }

  render() {
    const { data } = this.props;
    const { teams } = this.state;

    return (
      <StandingsTable
        data={data}
        teams={teams}
      />
    );
  }
}

export default DivisionGroupingTable;
