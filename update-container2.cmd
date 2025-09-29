@echo off
echo [%DATE% %TIME%] Starting container update from GitHub...

:: Переходим в директорию проекта
cd /d "C:\Users\Администратор\Desktop\my-node-app"

:: Останавливаем и удаляем старые контейнеры
echo Stopping and removing old containers...
docker-compose down

:: Получаем последние изменения из GitHub
echo Pulling latest code from GitHub...
git pull origin main

:: Пересобираем и запускаем контейнеры
echo Building and starting new containers...
docker-compose up --build -d

:: Проверяем статус контейнеров
echo Checking container status...
docker ps

:: Логируем завершение
echo [%DATE% %TIME%] Update completed successfully!
echo Container is running on http://localhost:3000
pause