const queryString = require('query-string');

const API_URL = process.env.REACT_APP_API_URL;

if (!process.env.REACT_APP_API_URL) {
  console.error('You must provide an API url!');
  // Set default value?  Exit?
}

const fetch = (url, params) => {
  return window.fetch(`http://${API_URL}/${url}${params ? `?${queryString.stringify(params)}` : ''}`)
  .then(res => res.json());
};

module.exports = {
  fetch
};
