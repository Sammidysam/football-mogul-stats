import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router } from 'react-router-dom';

import Schedule from './components/pages/Schedule';
import StandingsPage from './components/pages/StandingsPage';

// Not sure if App will actually be used later on.
// Maybe implement later parts of https://codeburst.io/getting-started-with-react-router-5c978f70df91
const routing = (
  <Router>
    <Route path="/schedule" component={Schedule} />
    <Route path="/standings" component={StandingsPage} />
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
