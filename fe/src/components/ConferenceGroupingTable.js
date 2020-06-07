import React from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
    const { data } = this.props;
    const { teams } = this.state;

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell align="right">Wins</TableCell>
              <TableCell align="right">Losses</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map(s => {
              const team = teams.find(t => t.id === s.TeamId);

              return team && (
                <TableRow key={s.TeamId}>
                  <TableCell component="th" scope="row">
                    {team.name}
                  </TableCell>

                  <TableCell align="right">
                    {s.regularSeason.wins}
                  </TableCell>
                  <TableCell align="right">
                    {s.regularSeason.losses}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
}

export default ConferenceGroupingTable;
