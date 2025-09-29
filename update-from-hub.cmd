@echo off
echo [%DATE% %TIME%] Starting update from Docker Hub...

cd /d "C:\Users\Администратор\Desktop\my-node-app"

echo Stopping old containers...
docker-compose -f docker-compose.prod.yml down

echo Pulling latest image from Docker Hub...
docker-compose -f docker-compose.prod.yml pull

echo Starting containers with new image...
docker-compose -f docker-compose.prod.yml up -d

echo Cleaning up...
docker image prune -f

echo Checking status...
docker ps

echo [%DATE% %TIME%] Update from Docker Hub completed!
pause