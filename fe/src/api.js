const API_URL = process.env.REACT_APP_API_URL;

if (!process.env.REACT_APP_API_URL) {
  console.error('You must provide an API url!');
  // Set default value?  Exit?
}

const fetch = url => {
  return window.fetch(`http://${API_URL}/${url}`)
  .then(res => res.json());
};

module.exports = {
  fetch
};
