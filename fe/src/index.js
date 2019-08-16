import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'
import App from './App';
import Schedule from './Schedule';

// Not sure if App will actually be used later on.
// Maybe implement later parts of https://codeburst.io/getting-started-with-react-router-5c978f70df91
const routing = (
  <Router>
    <Route exact path="/" component={App} />
    <Route path="/schedule" component={Schedule} />
  </Router>
);

ReactDOM.render(routing, document.getElementById('root'));
