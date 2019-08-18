#! /bin/sh

nodemon api/server.js &
yarn --cwd "fe" start &
