import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Schedule from './components/pages/Schedule';
import GroupingsPage from './components/pages/GroupingsPage';

// Not sure if App will actually be used later on.
// Maybe implement later parts of https://codeburst.io/getting-started-with-react-router-5c978f70df91
const routing = (
  <Router>
    <Route path="/schedule" component={Schedule} />
    <Route path="/standings" render={(props) => <GroupingsPage {...props} type="standings" />} />
    <Route path="/rankings" render={(props) => <GroupingsPage {...props} type="rankings" />} />
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
