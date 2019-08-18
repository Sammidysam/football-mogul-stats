import React from 'react';

const api = require('../api.js');

class Schedule extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      playoff: false,
      week: 1,
      season: {
        year: 2000
      }
    }
  }

  componentDidMount() {
    api.fetch('latest')
    .then(
      result => this.setState(result)
    );
  }

  render() {
    const { playoff, week, season: { year } } = this.state;

    return (
      <h1>
        Schedule
      </h1>
    );
  }
}

export default Schedule;
