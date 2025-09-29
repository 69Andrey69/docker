@echo off
echo Обновление контейнера из Git репозитория...

cd C:\Users\Администратор\Desktop\my-node-app

echo Останавливаем существующие контейнеры...
docker-compose down

echo Получаем последние изменения из Git...
git pull

echo Пересобираем и запускаем контейнеры...
docker-compose up --build -d

echo Готово! Контейнер обновлен из Git.