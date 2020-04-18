import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

class SeasonSelect extends React.Component {
  render() {
    const { onChange, value, seasons } = this.props;

    return (
      <Select
        onChange={onChange}
        value={value}
        renderValue={e => e.year}
      >
        {seasons.map(s => (
          <MenuItem value={s} key={s.year}>{s.year}</MenuItem>
        ))}
      </Select>
    );
  }
}

export default SeasonSelect;
