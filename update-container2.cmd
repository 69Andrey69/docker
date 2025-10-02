@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    ОБНОВЛЕНИЕ КОНТЕЙНЕРА ИЗ GIT
echo ========================================
echo.

cd C:\Users\Администратор\Desktop\my-node-app

echo [1/5] Останавливаем существующие контейнеры...
docker-compose down

echo [2/5] Получаем последние изменения из Git...
git pull

echo [3/5] Пересобираем и запускаем контейнеры...
docker-compose up --build -d

echo [4/5] Проверяем статус контейнеров...
docker-compose ps

echo [5/5] Ждем запуска сервисов...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo    ОБНОВЛЕНИЕ УСПЕШНО ЗАВЕРШЕНО!
echo ========================================
echo.
echo ДОСТУПНЫЕ СЕРВИСЫ:
echo    Приложение: http://localhost:3000
echo    PgAdmin:    http://localhost:8080
echo    Mongo Express: http://localhost:8081
echo    PostgreSQL:   localhost:5432
echo    MongoDB:      localhost:27017
echo    Portainer:    http://localhost:9000
echo.
echo БЫСТРЫЕ КОМАНДЫ ДЛЯ ПРОВЕРКИ:
echo    curl http://localhost:3000/health
echo    curl http://localhost:3000/api/test-db
echo.
echo Логи приложения: docker-compose logs app
echo ========================================
echo.