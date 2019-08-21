import React from 'react';

import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { withStyles } from '@material-ui/styles';

const api = require('../api.js');

const styles = {
  paper: {
    margin: [[5, 0]]
  }
};

class GameList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [],
      teams: [],
      teamParticipations: []
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.week !== prevProps.week ||
      this.props.playoff !== prevProps.playoff ||
      this.props.season.year !== prevProps.season.year
    ) {
      api.fetch('games', {
        week: this.props.week,
        playoff: this.props.playoff,
        SeasonYear: this.props.season.year
      })
      .then(games => {
        this.setState({ games: games });

        api.fetch('team-participations', {
          GameId: games.map(g => g.id)
        })
        .then(teamParticipations => this.setState({ teamParticipations: teamParticipations }));
      });
    }
  }

  componentDidMount() {
    api.fetch('teams')
    .then(teams => this.setState({ teams: teams }));
  }

  render() {
    const { games, teams, teamParticipations } = this.state;
    const { playoff, week, season, classes } = this.props;

    return (
      <Box display="flex" flexDirection="column" width="80%">
        {games.map(g => {
          const away = teamParticipations.find(tp => tp.GameId === g.id && !tp.home) || {};
          const awayTeam = teams.find(t => t.id === away.TeamId) || {};
          const home = teamParticipations.find(tp => tp.GameId === g.id && tp.home) || {};
          const homeTeam = teams.find(t => t.id === home.TeamId) || {};

          const winnerId = away.score > home.score ? away.id : home.id;

          return (
            <Paper display="flex" flexDirection="column" className={classes.paper} key={g.id}>
              <Box padding="5px">
                <Box>
                  <Typography>
                    <Box fontWeight={winnerId === away.id ? 'fontWeightMedium' : 'fontWeightRegular'}>
                      {awayTeam.name} {away.score}
                    </Box>
                  </Typography>
                </Box>
                <Box>
                  <Typography>
                    <Box fontWeight={winnerId === home.id ? 'fontWeightMedium' : 'fontWeightRegular'}>
                      {homeTeam.name} {home.score}
                    </Box>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          );
        })}
      </Box>
    );
  }
}

export default withStyles(styles)(GameList);
