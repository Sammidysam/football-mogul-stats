const queryString = require('query-string');

const API_URL = process.env.REACT_APP_API_URL;

if (!process.env.REACT_APP_API_URL) {
  console.error('You must provide an API url!');
  // Set default value?  Exit?
}

const fetch = (url, params, debug = false) => {
  const query = `http://${API_URL}/${url}${params ? `?${queryString.stringify(params)}` : ''}`;

  if (debug)
    console.log(query);

  return window.fetch(query)
  .then(res => res.json());
};

module.exports = {
  fetch
};
