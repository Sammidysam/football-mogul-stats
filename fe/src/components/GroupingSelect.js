import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const GROUPINGS = {
  'divisionconference': 'Division and Conference',
  'division': 'Division',
  'conference': 'Conference',
  'sorted': 'None'
};

class GroupingSelect extends React.Component {
  render() {
    const { onChange, value } = this.props;

    return (
      <Select
        onChange={onChange}
        value={value}
      >
        {Object.entries(GROUPINGS).map(g => (
          <MenuItem value={g[0]} key={g[0]}>{g[1]}</MenuItem>
        ))}
      </Select>
    );
  }
}

export default GroupingSelect;
