import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const api = require('../api.js');

class WeekSelect extends React.Component {
  constructor(props) {
    super(props);

    // This only contains the values from `latest`.
    this.state = {
      latest: {
        playoff: false,
        week: 1,
        season: {
          year: 2000
        }
      }
    }
  }

  componentDidMount() {
    // Minor issue, as latest should probably hold same data across Schedule and here (update).
    // Redux?
    api.fetch('latest')
    .then(
      result => this.setState({ latest: result })
    );
  }

  renderWeek(element) {
    const week = element;

    if (week.playoff) {
      switch (week.week) {
        case 1:
        return 'WC';
        case 2:
        return 'DIV';
        case 3:
        return 'CONF';
        case 4:
        return 'SB';
      }
    } else {
      return week.week;
    }
  }

  // I wonder if this could be more functional.
  weekMenuItems(end) {
    let week = { week: 1, playoff: false };
    let menuItems = [];

    if (!end) {
      end = {
        week: 4,
        playoff: true
      };
    }

    // We go one higher to make sure the last entry renders.
    while (week.week !== end.week + 1 || week.playoff !== end.playoff) {
      menuItems.push(
        <MenuItem value={Object.assign({}, week)} key={JSON.stringify(week)}>
          {this.renderWeek(week)}
        </MenuItem>
      );

      // Increment.
      if (week.week === 17) {
        week = {
          week: 1,
          playoff: true
        };
      } else {
        week.week += 1;
      }
    }

    return menuItems;
  }

  renderWeeks() {
    const { latest } = this.state;
    const { value, season } = this.props;

    return this.weekMenuItems(season.year === latest.season.year && { week: latest.week, playoff: latest.playoff });
  }

  render() {
    const { latest } = this.state;
    const { onChange, value, season } = this.props;

    return (
      <Select
        onChange={onChange}
        value={value}
        renderValue={this.renderWeek}
      >
        {this.renderWeeks()}
      </Select>
    );
  }
}

export default WeekSelect;
