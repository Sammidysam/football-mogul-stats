# football-mogul-stats
Creating advanced stats through parsing Football Mogul's HTML output

Note, this is written for Football Mogul 18.
Structure might have to change for future year upgrades.

## Setting Up MySQL

Altering a user to give it the password you want:
```
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
```

## Procedure

First, you will want to scrape your existing HTML output to create a working database:
```
node scraper/scrape.js -d 'directory'
```

Then, you will want to run the backend server.
```
node api/server.js
```
(use `nodemon` in development)
