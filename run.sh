docker run -dit -p 3041:3000 --restart unless-stopped -v $(pwd):/app -v /app/node_modules --link fm-mysql:fm-mysql --name fbmogul-be fbmogul-be
