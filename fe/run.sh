docker run -dit -p 3040:3000 --restart always -e "REACT_APP_API_URL=localhost:3041" -v $(pwd):/app -v /app/node_modules -e CHOKIDAR_USEPOLLING=true --name football-mogul-stats football-mogul-stats

