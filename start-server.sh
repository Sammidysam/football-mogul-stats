#! /bin/sh

osascript -e "tell application \"Terminal\" to do script \"cd $(pwd); nodemon --watch api api/server.js\""
osascript -e "tell application \"Terminal\" to do script \"cd $(pwd); REACT_APP_API_URL=localhost:3002 yarn --cwd fe start\""
