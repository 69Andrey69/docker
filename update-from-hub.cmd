@echo off
echo Обновление контейнера из Docker Hub...

cd C:\Users\Администратор\Desktop\my-node-app

echo Останавливаем существующие контейнеры...
docker-compose down

echo Удаляем старый образ...
docker rmi nomano/proba:1.0

echo Загружаем последний образ из Docker Hub...
docker pull nomano/proba:1.0

echo Запускаем контейнер с новым образом...
docker run -d -p 3000:3000 --name my-node-app nomano/proba:1.0

echo Готово! Контейнер обновлен из Docker Hub.