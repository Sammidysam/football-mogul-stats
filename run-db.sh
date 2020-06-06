docker run -dit --restart unless-stopped -p 3039:3306 -e "MYSQL_ROOT_HOST=%" -e "MYSQL_ALLOW_EMPTY_PASSWORD=true" --name fm-mysql mysql/mysql-server:5.7
