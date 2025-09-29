@echo off
echo Stopping and removing old container...
docker stop my-app 2>nul
docker rm my-app 2>nul

echo Building new image...
docker build --tag myapp:latest .

echo Running new container...
docker run -d -p 3000:3000 --name my-app -e PORT=3000 -e APP_NAME="Docker App" -e NODE_ENV=production myapp:latest

echo Update completed!
docker ps