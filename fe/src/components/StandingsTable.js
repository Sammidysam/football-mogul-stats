import React from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class StandingsTable extends React.Component {
  render() {
    const { data, teams } = this.props;

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Team</TableCell>
              <TableCell align="right">Wins</TableCell>
              <TableCell align="right">Losses</TableCell>
              <TableCell align="right">Ties</TableCell>
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
                  <TableCell align="right">
                    {s.regularSeason.ties}
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

export default StandingsTable;
