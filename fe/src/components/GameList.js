import React from 'react';

const api = require('../api.js');

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

      api.fetch('teams')
      .then(teams => this.setState({ teams: teams }));
    }
  }

  render() {
    const { games, teams, teamParticipations } = this.state;
    const { playoff, week, season } = this.props;

    return games.map(g => {
      const away = teamParticipations.find(tp => tp.GameId === g.id && !tp.home) || {};
      const awayTeam = teams.find(t => t.id === away.TeamId) || {};
      const home = teamParticipations.find(tp => tp.GameId === g.id && tp.home) || {};
      const homeTeam = teams.find(t => t.id === home.TeamId) || {};

      return (
        <div key={g.id}>
          {awayTeam.name} {away.score} - {homeTeam.name} {home.score}
        </div>
      );
    });
  }
}

export default GameList;
