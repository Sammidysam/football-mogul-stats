import React from 'react';

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

class RankingsTable extends React.Component {
  render() {
    const { data, teams } = this.props;

    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Rank</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="right">Offensive Yards</TableCell>
              <TableCell align="right">Defensive Yards</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data && data.map((s, index) => {
              const team = teams.find(t => t.id === s.TeamId);

              return team && (
                <TableRow key={s.TeamId}>
                  <TableCell>
                    {index + 1}
                  </TableCell>

                  <TableCell component="th" scope="row">
                    {team.name}
                  </TableCell>

                  <TableCell align="right">
                    {s.regularSeason.offenseYards}
                  </TableCell>
                  <TableCell align="right">
                    {s.regularSeason.defenseYards}
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

export default RankingsTable;
