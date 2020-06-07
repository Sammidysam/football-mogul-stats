# football-mogul-stats
Creating advanced stats through parsing Football Mogul's HTML output

Note, this started as written for Football Mogul 18, but seems to work with 20.
Structure might have to change for future year upgrades.

## Setting Up MySQL

First, run `./run-db.sh`.
Then, the following command will likely be needed:

```
npx sequelize-cli db:create --env local
```

The goal would later be to build this into `run-db.sh`.

## Procedure

First, you will want to scrape your existing HTML output to create a working database:
```
NODE_ENV=local node scraper/scrape.js -d 'directory'
```

Then, execute `./build.sh` in both `.` and `fe`, as well as `./run.sh` in both
folders.
The frontend will be on `localhost:3040` and the backend will be on `localhost:3041`.

Actually, possibly run React on the local machine, as it is dreadfully slow in Docker.
